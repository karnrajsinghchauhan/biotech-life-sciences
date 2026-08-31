import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import FulfillmentBadges from "./FulfillmentBadges"
import { site } from "@/lib/config"

describe("FulfillmentBadges", () => {
  it("states the three real fulfillment facts, and links tracking to the order-status flow", () => {
    render(<FulfillmentBadges />)
    expect(screen.getByText(/bacteriostatic water/i)).toBeInTheDocument()
    expect(screen.getByText(/48.hour/i)).toBeInTheDocument()
    const trackingLink = screen.getByRole("link", { name: /track your order/i })
    expect(trackingLink).toBeInTheDocument()
    expect(trackingLink).toHaveAttribute("href", `${site.url}/account/orders`)
  })
})
