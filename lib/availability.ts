export type VariantAvailability = { availableForSale: boolean }

/** True if at least one variant in the list can currently be sold. */
export function isAnyVariantAvailable(variants: VariantAvailability[]): boolean {
  return variants.some((v) => v.availableForSale)
}
