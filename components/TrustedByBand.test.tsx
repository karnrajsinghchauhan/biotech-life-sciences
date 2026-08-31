import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import TrustedByBand from "./TrustedByBand"

describe("TrustedByBand", () => {
  it("lists real institution categories, not named clients", () => {
    render(<TrustedByBand />)
    expect(screen.getByText(/research laboratories/i)).toBeInTheDocument()
    expect(screen.getByText(/universities/i)).toBeInTheDocument()
    expect(screen.getByText(/biotechnology companies/i)).toBeInTheDocument()
  })
})
