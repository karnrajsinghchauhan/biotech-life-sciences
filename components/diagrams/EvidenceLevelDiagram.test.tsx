import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import EvidenceLevelDiagram from "./EvidenceLevelDiagram"
import { evidenceLevels } from "@/lib/evidence"

describe("EvidenceLevelDiagram", () => {
  it("shows all 5 real evidence levels from lib/evidence.ts, in strongest-to-weakest order", () => {
    render(<EvidenceLevelDiagram />)
    for (const level of Object.values(evidenceLevels)) {
      expect(screen.getByText(level.label)).toBeInTheDocument()
    }
  })
})
