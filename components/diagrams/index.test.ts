import { describe, it, expect } from "vitest"
import { DIAGRAM_COMPONENTS, type DiagramKey } from "./index"

const ALL_KEYS: DiagramKey[] = [
  "peptide-chain", "chromatogram", "mass-spec", "coa-anatomy",
  "dilution", "evidence-level", "bioregulator-class",
]

describe("DIAGRAM_COMPONENTS registry", () => {
  it("every declared key resolves to a component", () => {
    for (const key of ALL_KEYS) {
      expect(DIAGRAM_COMPONENTS[key]).toBeDefined()
    }
  })
})
