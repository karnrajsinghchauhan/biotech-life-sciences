import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Footer from "./Footer"

describe("Footer links", () => {
  const expectedHrefs = ["/shop", "/coa", "/library", "/wholesale", "/about", "/faq", "/calculator", "/quality",
    "/research-use-only", "/shipping", "/returns", "/privacy", "/terms", "/disclaimer"]

  it("links to every page that has no other way to be reached", () => {
    const { container } = render(<Footer />)
    for (const href of expectedHrefs) {
      const link = container.querySelector(`a[href="${href}"]`)
      expect(link).not.toBeNull()
    }
  })
})
