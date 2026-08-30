import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import WhatsAppOrderButton from "./WhatsAppOrderButton"
import { products } from "@/lib/data"

describe("WhatsAppOrderButton", () => {
  it("links to wa.me with the product name in the message", () => {
    const product = products[0]
    render(<WhatsAppOrderButton product={product} className="btn primary" label="Order" />)
    const link = screen.getByRole("link", { name: /order/i })
    expect(link).toHaveAttribute("href", expect.stringContaining("wa.me"))
    expect(decodeURIComponent(link.getAttribute("href") || "")).toContain(product.name)
  })
})
