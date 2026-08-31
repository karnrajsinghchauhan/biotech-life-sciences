import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import WhyTrustUs from "./WhyTrustUs"

describe("WhyTrustUs", () => {
  it("states the three real, verified trust facts", () => {
    render(<WhyTrustUs />)
    expect(screen.getByText(/oxford/i)).toBeInTheDocument()
    expect(screen.getByText(/heavy metal/i)).toBeInTheDocument()
    expect(screen.getByText(/certificate of analysis|coa/i)).toBeInTheDocument()
  })

  it("does not claim we operate the synthesis line", () => {
    render(<WhyTrustUs />)
    expect(screen.queryByText(/we synthesize|our synthesis/i)).not.toBeInTheDocument()
  })
})
