import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import SpecTable from "./SpecTable"
import { bySlug } from "@/lib/data"

describe("SpecTable", () => {
  it("shows storage and stability details for a product that has them", () => {
    const product = bySlug("retatrutide")!
    render(<SpecTable product={product} />)
    expect(screen.getByText(product.storage)).toBeInTheDocument()
    expect(screen.getByText(product.sku)).toBeInTheDocument()
  })

  it("omits optional rows when a product has no purity or vial code", () => {
    // collagen-peptides is a real catalog product that lacks both code and purity (purity: undefined, code not specified)
    // but has stability and solubility from the SPEC defaults
    const product = bySlug("collagen-peptides")!
    render(<SpecTable product={product} />)
    expect(screen.queryByText("Vial code")).not.toBeInTheDocument()
    expect(screen.queryByText("Purity")).not.toBeInTheDocument()
  })
})
