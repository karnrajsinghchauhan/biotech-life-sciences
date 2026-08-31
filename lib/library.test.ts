import { describe, it, expect } from "vitest"
import { articles } from "./library"
import { DIAGRAM_COMPONENTS } from "@/components/diagrams"

describe("library article diagrams", () => {
  it("every article's diagram key, if set, resolves to a real component", () => {
    for (const a of articles) {
      if (a.diagram) {
        expect(DIAGRAM_COMPONENTS[a.diagram]).toBeDefined()
      }
    }
  })

  it("the 4 core technical articles each have a diagram assigned", () => {
    const withDiagram = ["what-are-research-peptides", "how-to-read-a-coa", "understanding-hplc", "understanding-mass-spectrometry"]
    for (const slug of withDiagram) {
      const article = articles.find((a) => a.slug === slug)
      expect(article?.diagram).toBeTruthy()
    }
  })
})

describe("new library articles", () => {
  const newSlugs = ["reconstitution-math-for-research-use", "understanding-evidence-levels", "peptide-bioregulators"]

  it("all 3 new articles exist with a diagram assigned", () => {
    for (const slug of newSlugs) {
      const article = articles.find((a) => a.slug === slug)
      expect(article).toBeDefined()
      expect(article?.diagram).toBeTruthy()
      expect(article?.body.length).toBeGreaterThan(2)
    }
  })

  it("the reconstitution article stays laboratory-math framing, never a dosing instruction", () => {
    const article = articles.find((a) => a.slug === "reconstitution-math-for-research-use")!
    const text = article.body.join(" ").toLowerCase()
    expect(text).not.toMatch(/\brecommended dose\b|\badminister\b|\binject\b/)
  })
})
