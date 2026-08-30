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
})
