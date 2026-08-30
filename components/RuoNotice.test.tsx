import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import RuoNotice from "./RuoNotice"
import { site } from "@/lib/config"

describe("RuoNotice", () => {
  it("renders the disclaimer with the highlighted notice styling, not a muted caption", () => {
    render(<RuoNotice />)
    const el = screen.getByText(site.disclaimer)
    expect(el).toHaveClass("notice")
    expect(el).not.toHaveClass("minimal-ruo-notice")
  })
})
