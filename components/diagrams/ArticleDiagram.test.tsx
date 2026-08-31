import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import ArticleDiagram from "./ArticleDiagram"

describe("ArticleDiagram", () => {
  it("renders nothing when no diagram key is given", () => {
    const { container } = render(<ArticleDiagram />)
    expect(container).toBeEmptyDOMElement()
  })

  it("renders the matching diagram component for a valid key", () => {
    render(<ArticleDiagram diagram="peptide-chain" />)
    expect(screen.getByText("N-terminus")).toBeInTheDocument()
  })
})
