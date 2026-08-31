import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import ChromatogramDiagram from "./ChromatogramDiagram"

describe("ChromatogramDiagram", () => {
  it("labels the main peak with a purity figure and the axes with real units", () => {
    render(<ChromatogramDiagram />)
    expect(screen.getByText(/98\.\d%/)).toBeInTheDocument()
    expect(screen.getByText(/retention time/i)).toBeInTheDocument()
    expect(screen.getByText(/absorbance/i)).toBeInTheDocument()
  })
})
