import { describe, it, expect, vi, beforeEach } from "vitest"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Header from "./Header"

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ cart: null }),
  }) as unknown as typeof fetch
})

describe("Header mobile menu accessibility", () => {
  it("is inert when closed", () => {
    render(<Header />)
    const menu = document.querySelector(".mobile-menu")
    expect(menu?.hasAttribute("inert")).toBe(true)
  })

  it("removes the inert attribute once opened", async () => {
    const user = userEvent.setup()
    render(<Header />)
    await user.click(document.querySelector(".burger")!)
    const menu = document.querySelector(".mobile-menu")
    expect(menu?.hasAttribute("inert")).toBe(false)
  })
})
