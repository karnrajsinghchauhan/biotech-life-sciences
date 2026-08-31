import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import MassSpecDiagram from "./MassSpecDiagram"

describe("MassSpecDiagram", () => {
  it("labels the m/z axis and the relative intensity axis", () => {
    render(<MassSpecDiagram />)
    expect(screen.getByText(/m\/z/)).toBeInTheDocument()
    expect(screen.getByText(/relative intensity/i)).toBeInTheDocument()
  })
})
