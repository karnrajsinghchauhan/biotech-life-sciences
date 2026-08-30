import { describe, it, expect, vi, beforeEach } from "vitest"
import { render } from "@testing-library/react"
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
