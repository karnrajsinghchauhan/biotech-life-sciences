import { describe, it, expect } from "vitest"
import { buildShopifyProductWhatsAppLink } from "./whatsapp"

describe("buildShopifyProductWhatsAppLink", () => {
  it("builds a wa.me link containing the given product title", () => {
    const href = buildShopifyProductWhatsAppLink("Test Compound 10mg")
    expect(href).toContain("wa.me")
    expect(decodeURIComponent(href)).toContain("Test Compound 10mg")
  })
})
