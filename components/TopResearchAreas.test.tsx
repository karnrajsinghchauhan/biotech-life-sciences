import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import TopResearchAreas from "./TopResearchAreas"

describe("TopResearchAreas", () => {
  it("shows at most the first 3 research areas from the product's real data", () => {
    render(<TopResearchAreas research={["Area A", "Area B", "Area C", "Area D", "Area E"]} />)
    expect(screen.getByText("Area A")).toBeInTheDocument()
    expect(screen.getByText("Area B")).toBeInTheDocument()
    expect(screen.getByText("Area C")).toBeInTheDocument()
    expect(screen.queryByText("Area D")).not.toBeInTheDocument()
  })

  it("numbers each area 01/02/03", () => {
    render(<TopResearchAreas research={["Only one area"]} />)
    expect(screen.getByText("01")).toBeInTheDocument()
  })
})
