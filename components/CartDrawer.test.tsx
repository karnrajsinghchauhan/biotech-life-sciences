import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import CartDrawer from "./CartDrawer"

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ cart: null }),
  }) as unknown as typeof fetch
})

describe("CartDrawer accessibility", () => {
  it("marks the drawer inert via a real DOM attribute when closed", () => {
    render(<CartDrawer open={false} onClose={() => {}} onCountChange={() => {}} />)
    const aside = document.getElementById("cart-drawer")!
    expect(aside.hasAttribute("inert")).toBe(true)
  })

  it("removes the inert attribute when open", () => {
    render(<CartDrawer open={true} onClose={() => {}} onCountChange={() => {}} />)
    const aside = document.getElementById("cart-drawer")!
    expect(aside.hasAttribute("inert")).toBe(false)
  })
})

describe("CartDrawer concurrent mutations", () => {
  it("ignores a stale response superseded by a newer mutation on the same line", async () => {
    const cartV1 = {
      id: "c1", checkoutUrl: "#", totalQuantity: 1,
      cost: { totalAmount: { amount: "10", currencyCode: "INR" } },
      lines: [{
        id: "line-a", quantity: 1,
        merchandise: {
          title: "10mg", price: { amount: "10", currencyCode: "INR" },
          product: { title: "Test Compound", handle: "test", featuredImage: null },
        },
      }],
    }
    const cartAfterFirstClick = { ...cartV1, totalQuantity: 2, lines: [{ ...cartV1.lines[0], quantity: 2 }] }
    const cartAfterSecondClick = { ...cartV1, totalQuantity: 3, lines: [{ ...cartV1.lines[0], quantity: 3 }] }

    let patchCall = 0
    const patchBodies: unknown[] = []
    global.fetch = vi.fn(async (url: string, init?: RequestInit) => {
      if (init?.method === "PATCH") {
        patchCall += 1
        const thisCall = patchCall
        if (typeof init.body === "string") patchBodies.push(JSON.parse(init.body))
        // First PATCH resolves LAST (simulates the out-of-order network response
        // this bug depends on), second PATCH resolves FIRST.
        const delayMs = thisCall === 1 ? 30 : 0
        await new Promise((r) => setTimeout(r, delayMs))
        const cart = thisCall === 1 ? cartAfterFirstClick : cartAfterSecondClick
        return { ok: true, json: async () => ({ cart }) }
      }
      return { ok: true, json: async () => ({ cart: cartV1 }) }
    }) as unknown as typeof fetch

    const onCountChange = vi.fn()
    render(<CartDrawer open={true} onClose={() => {}} onCountChange={onCountChange} />)

    const increment = await screen.findByLabelText(/increase test compound quantity/i)
    // Both clicks fire synchronously, in the same tick, before React has a
    // chance to re-render. `line.quantity` in the click handler's closure is
    // therefore the SAME stale value (1) for both calls, so both requests
    // actually compute and send `quantity: 2` — not an increasing 2-then-3 as
    // the response mocks below might suggest. That's a real, separate bug
    // surface (double-increment clicks under-count), but it is NOT what this
    // test is checking. This test verifies the sequence-guard: when two
    // identical-looking requests are in flight and the FIRST one's response
    // arrives LAST, the guard must still keep the result of the SECOND
    // (later) mutation, discarding the stale response of the first — which
    // is why the mocked responses intentionally diverge (2 vs 3) even though
    // the real requests do not.
    increment.click()
    increment.click()

    await new Promise((r) => setTimeout(r, 50))

    // Verify what was actually sent on the wire, rather than assuming it.
    expect(patchBodies).toEqual([
      { lineId: "line-a", quantity: 2 },
      { lineId: "line-a", quantity: 2 },
    ])

    // The later click's result (quantity 3) must win, not the earlier click's
    // stale response (quantity 2) arriving after it.
    expect(await screen.findByText("3")).toBeInTheDocument()
  })
})
