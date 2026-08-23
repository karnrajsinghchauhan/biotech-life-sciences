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

// ============================================================
// One muted, desaturated accent per category — pharma-premium,
// not candy-bright. Used as small accents (dots, thin borders,
// eyebrow text) on an otherwise monochrome surface, never as a
// full background wash.
// ============================================================
export const shopCategoryColor: Record<CategorySlug, string> = {
  "tissue-repair": "#d99a72", // terracotta — healing/regenerative
  dermal: "#d9a3b0", // dusty rose — skin
  cellular: "#a596d9", // violet — cellular signaling
  metabolic: "#e0b25c", // amber — energy/metabolism
  cognitive: "#8f9ce0", // indigo — neuro/cognitive
  "gh-performance": "#6fa0d1", // steel blue — GH axis
  immune: "#8fb08a", // sage — immune
  longevity: "#a8768f", // plum — aging biology
  sleep: "#6f77b0", // midnight indigo — circadian
  reproductive: "#c98fa0", // dusty rose-mauve — reproductive
  mitochondrial: "#c4795a", // copper — mitochondrial/energy
  gastrointestinal: "#97a065", // moss — GI
  connective: "#7b8699", // slate — connective tissue
  other: "#9aa2b0", // neutral silver — specialist
}
