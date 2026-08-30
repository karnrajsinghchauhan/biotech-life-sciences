import { describe, it, expect } from "vitest"
import { isAnyVariantAvailable } from "./availability"

describe("isAnyVariantAvailable", () => {
  it("is true when at least one variant is available", () => {
    expect(isAnyVariantAvailable([{ availableForSale: false }, { availableForSale: true }])).toBe(true)
  })
  it("is false when no variant is available", () => {
    expect(isAnyVariantAvailable([{ availableForSale: false }, { availableForSale: false }])).toBe(false)
  })
  it("is false for an empty variant list", () => {
    expect(isAnyVariantAvailable([])).toBe(false)
  })
})
