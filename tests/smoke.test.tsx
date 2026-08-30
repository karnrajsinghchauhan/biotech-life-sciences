import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

function Hello() {
  return <p>harness works</p>
}

describe("test harness", () => {
  it("renders with RTL and jest-dom matchers", () => {
    render(<Hello />)
    expect(screen.getByText("harness works")).toBeInTheDocument()
  })
})
