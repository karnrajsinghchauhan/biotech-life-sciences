import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import PeptideChainDiagram from "./PeptideChainDiagram"

describe("PeptideChainDiagram", () => {
  it("labels the N-terminus, C-terminus, and a peptide bond", () => {
    render(<PeptideChainDiagram />)
    expect(screen.getByText("N-terminus")).toBeInTheDocument()
    expect(screen.getByText("C-terminus")).toBeInTheDocument()
    expect(screen.getByText("Peptide bond")).toBeInTheDocument()
  })
})
