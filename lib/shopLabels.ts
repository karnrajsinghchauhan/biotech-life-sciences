// ============================================================
// Consumer-facing display labels for shop categories.
// CategorySlug values (lib/data.ts) are unchanged — this is a
// presentation-only mapping for the shop-first homepage.
// ============================================================

import { CategorySlug } from "./data"

export const shopCategoryLabel: Record<CategorySlug, string> = {
  cognitive: "Nootropic",
  dermal: "Skin Health",
  "tissue-repair": "Tissue Repair",
  cellular: "Cellular Health",
  metabolic: "Metabolic",
  "gh-performance": "GH & Performance",
  sleep: "Sleep",
  longevity: "Longevity",
  immune: "Immune Support",
  reproductive: "Vitality",
  mitochondrial: "Cellular Energy",
  connective: "Joint & Connective",
  gastrointestinal: "Gut Health",
  other: "Specialist",
}
