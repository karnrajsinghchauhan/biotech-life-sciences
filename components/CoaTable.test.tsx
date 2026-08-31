import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import CoaTable from "./CoaTable"

const sampleCoas = [
  { batch: "BTLS-24-0091", testDate: "2026-06-01", purity: "99.1%", identity: "Confirmed", pdf: "/coa/sample.pdf" },
]

describe("CoaTable", () => {
  it("lists batch, purity and a PDF link when batches exist", () => {
    render(<CoaTable coas={sampleCoas} />)
    expect(screen.getByText("BTLS-24-0091")).toBeInTheDocument()
    expect(screen.getByText("99.1%")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /view pdf/i })).toHaveAttribute("href", "/coa/sample.pdf")
  })

  it("shows a documented fallback when no batches exist yet", () => {
    render(<CoaTable coas={[]} />)
    expect(screen.getByText(/verified independently/i)).toBeInTheDocument()
  })
})
