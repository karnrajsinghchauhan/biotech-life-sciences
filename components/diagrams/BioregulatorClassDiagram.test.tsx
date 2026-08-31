import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import BioregulatorClassDiagram from "./BioregulatorClassDiagram"
import { bySlug } from "@/lib/data"

describe("BioregulatorClassDiagram", () => {
  it("names all 6 real bioregulator products from the catalogue, not invented ones", () => {
    render(<BioregulatorClassDiagram />)
    for (const slug of ["epitalon", "pinealon", "cartalax", "chonluten", "cortagen", "pancregen"]) {
      const product = bySlug(slug)
      expect(product).toBeDefined()
      expect(screen.getByText(product!.name)).toBeInTheDocument()
    }
  })
})
