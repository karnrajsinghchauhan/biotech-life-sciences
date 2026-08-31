import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import WhyTrustUs from "./WhyTrustUs"

describe("WhyTrustUs", () => {
  it("states the three real, verified trust facts", () => {
    render(<WhyTrustUs />)
    expect(screen.getAllByText(/oxford/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/heavy[- ]metal/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/certificate of analysis|coa/i).length).toBeGreaterThan(0)
  })

  it("does not claim we operate the synthesis line", () => {
    render(<WhyTrustUs />)
    expect(screen.queryByText(/we synthesize|our synthesis/i)).not.toBeInTheDocument()
  })
})
