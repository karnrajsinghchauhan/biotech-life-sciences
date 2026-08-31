import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import DilutionDiagram from "./DilutionDiagram"

describe("DilutionDiagram", () => {
  it("shows the worked reconstitution math end to end", () => {
    render(<DilutionDiagram />)
    expect(screen.getByText("10 mg")).toBeInTheDocument()
    expect(screen.getByText("2 mL")).toBeInTheDocument()
    expect(screen.getByText("5 mg/mL")).toBeInTheDocument()
  })
})
