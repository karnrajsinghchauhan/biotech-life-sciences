import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import CoaAnatomyDiagram from "./CoaAnatomyDiagram"

describe("CoaAnatomyDiagram", () => {
  it("annotates the five fields a real COA must carry", () => {
    render(<CoaAnatomyDiagram />)
    for (const label of ["Batch number", "Purity (RP-HPLC)", "Identity (MS)", "Test date", "Issuing lab"]) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })
})
