import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import DiagramFrame from "./DiagramFrame"

describe("DiagramFrame", () => {
  it("renders a labeled caption and its children", () => {
    render(
      <DiagramFrame title="Test Diagram" caption="A caption explaining the figure.">
        <svg role="img"><title>inner</title></svg>
      </DiagramFrame>
    )
    expect(screen.getByText("Test Diagram")).toBeInTheDocument()
    expect(screen.getByText("A caption explaining the figure.")).toBeInTheDocument()
  })
})
