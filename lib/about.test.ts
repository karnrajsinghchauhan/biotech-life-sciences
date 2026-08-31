import { describe, it, expect } from "vitest"
import { aboutContent } from "./about"

const bannedPhrases = [
  "world's leading", "world leading", "50+ countries", "25+ years",
]

describe("about page content", () => {
  it("never contains a superlative or unverifiable stat this project has already agreed to remove", () => {
    const allText = JSON.stringify(aboutContent).toLowerCase()
    for (const phrase of bannedPhrases) {
      expect(allText).not.toContain(phrase.toLowerCase())
    }
  })

  it("describes the Oxford facility as QC/repackaging/storage, never as where synthesis happens", () => {
    const text = aboutContent.facilityParagraph.toLowerCase()
    expect(text).toContain("oxford")
    expect(text).toMatch(/quality.?check|qc|repackag|storag/)
    expect(text).not.toMatch(/synthesi[sz]e|manufactur(e|ing) (the|our) (peptide|compound)/)
  })

  it("states the real testing scope, including the two newly-confirmed panels", () => {
    const text = aboutContent.testingParagraph.toLowerCase()
    expect(text).toContain("hplc")
    expect(text).toMatch(/mass spectrometry|\bms\b/)
    expect(text).toContain("heavy metal")
    expect(text).toMatch(/endotoxin|residual solvent/)
  })

  it("only uses stats that are actually derivable from the codebase", () => {
    const labels = aboutContent.stats.map((s) => s.label.toLowerCase())
    expect(labels.some((l) => l.includes("countries"))).toBe(false)
    expect(labels.some((l) => l.includes("years of excellence"))).toBe(false)
  })

  it("has the three trust reasons used by the WhyTrustUs section", () => {
    expect(aboutContent.trustReasons).toHaveLength(3)
  })
})
