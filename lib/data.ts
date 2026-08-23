// ============================================================
// PRODUCT DATABASE — Biotech Life Sciences
//
// Source of truth: "Biotechlife sciences peptides" brand catalogue
// (flagship products, specs, sizes, vial codes) plus the extended
// research compound directory.
//
// !! ALL PRICES ARE PLACEHOLDERS (INR) — set real prices before launch.
// !! COA entries are intentionally empty — upload real batch documents
//    via lib/coa.ts before enabling "COA Available" badges.
// ============================================================

export type CompoundType =
  | "Peptide"
  | "Peptide Blend"
  | "Protein"
  | "Protein Fragment"
  | "Small Molecule"
  | "Coenzyme"
  | "Vitamin"
  | "Research Compound"

export type CategorySlug =
  | "tissue-repair"
  | "dermal"
  | "cellular"
  | "metabolic"
  | "cognitive"
  | "gh-performance"
  | "immune"
  | "longevity"
  | "sleep"
  | "reproductive"
  | "mitochondrial"
  | "gastrointestinal"
  | "connective"
  | "other"

export type Category = {
  slug: CategorySlug
  name: string
  short: string
  text: string
}

export const categories: Category[] = [
  { slug: "tissue-repair", name: "Tissue Repair", short: "Repair & regeneration", text: "Compounds investigated in preclinical models of cellular repair, tissue remodeling, wound biology and related pathways." },
  { slug: "dermal", name: "Dermal Research", short: "Skin & collagen biology", text: "Compounds studied in collagen synthesis, skin remodeling, pigmentation biology and related cellular processes." },
  { slug: "cellular", name: "Cellular Research", short: "Signaling & metabolism", text: "Compounds associated with research into cellular signaling, redox biology, mitochondrial function and metabolic pathways." },
  { slug: "metabolic", name: "Metabolic Research", short: "Energy & incretin biology", text: "Incretin-class analogues and metabolic fragments studied in glucose regulation, lipid metabolism and energy-balance research." },
  { slug: "cognitive", name: "Cognitive & Neuro Research", short: "Neurobiology", text: "Compounds studied in neurotrophin expression, neuroprotection, cognition and stress-response research models." },
  { slug: "gh-performance", name: "Growth Hormone & Performance", short: "GH-axis research", text: "GHRH analogues, secretagogues and growth factors used in growth-hormone-axis signaling and muscle-biology research." },
  { slug: "immune", name: "Immune Research", short: "Immunomodulation", text: "Thymic peptides and host-defense compounds studied in immune-signaling and immunomodulation research." },
  { slug: "longevity", name: "Longevity & Cellular Aging", short: "Aging biology", text: "Compounds studied in telomerase activity, cellular senescence and aging-biology research models." },
  { slug: "sleep", name: "Sleep & Circadian Research", short: "Sleep architecture", text: "Compounds studied in sleep-architecture, circadian-rhythm and stress-response research." },
  { slug: "reproductive", name: "Reproductive & Sexual Biology", short: "Reproductive signaling", text: "Compounds studied in melanocortin, kisspeptin and oxytocin signaling within reproductive-biology research." },
  { slug: "mitochondrial", name: "Mitochondrial Research", short: "Mitochondrial biology", text: "Mitochondrial-derived peptides and compounds studied in mitochondrial function and cellular-energy research." },
  { slug: "gastrointestinal", name: "Gastrointestinal Research", short: "GI biology", text: "Compounds studied in gastrointestinal mucosal biology and gut-related research models." },
  { slug: "connective", name: "Connective Tissue Research", short: "Matrix biology", text: "Compounds studied in extracellular-matrix biology, cartilage and fibrosis-related research." },
  { slug: "other", name: "Other Research Compounds", short: "Specialist compounds", text: "Specialist research compounds spanning additional areas of laboratory investigation." },
]

export type Size = { label: string; price: number } // price in INR — PLACEHOLDER

export type Product = {
  slug: string
  sku: string
  code?: string // vial code from brand catalogue, e.g. RT10
  /** Real product photograph extracted from the company catalogue PDF. */
  image?: string
  name: string
  altName?: string
  compoundType: CompoundType
  category: CategorySlug // primary
  categories: CategorySlug[] // all (includes primary)
  sizes: Size[]
  purity?: string
  form: string
  storage: string
  stability?: string
  solubility?: string
  overview: string
  research: string[]
  featured?: boolean
  isNew?: boolean
  bestSeller?: boolean
  coa?: boolean // true only when a real COA document exists in lib/coa.ts
  related?: string[]
  /** "pen" renders via the Pen SVG fallback instead of Vial when no photo exists. */
  deviceType?: "vial" | "pen"
}

const SPEC = {
  purity: "≥ 98% (RP-HPLC)",
  form: "Lyophilized powder",
  storage: "Store at −20 °C, protect from light",
  stability: "24 months",
  solubility: "Bacteriostatic water (for research use only)",
}

export const products: Product[] = [
  // ================= FLAGSHIP — from brand catalogue =================
  {
    slug: "retatrutide", sku: "BTLS-601", code: "RT10", image: "/images/products/retatrutide.webp", name: "Retatrutide",
    compoundType: "Peptide", category: "metabolic", categories: ["metabolic"],
    sizes: [{ label: "5 mg", price: 7999 }, { label: "10 mg", price: 10000 }, { label: "20 mg", price: 15000 }],
    ...SPEC, featured: true, isNew: true, bestSeller: true,
    overview: "Retatrutide is a next-generation investigational peptide and triple agonist of the GIP, GLP-1 and glucagon receptors. It is used as a reference material in multi-receptor metabolic-signaling research, including studies on metabolism, energy balance and fat regulation.",
    research: ["Triple-agonist receptor pharmacology", "Metabolic regulation studies", "Energy-balance research", "Appetite-signaling research"],
    related: ["tirzepatide", "semaglutide", "aod-9604"],
  },
  {
    slug: "tirzepatide", sku: "BTLS-602", code: "TR10", image: "/images/products/tirzepatide.webp", name: "Tirzepatide",
    compoundType: "Peptide", category: "metabolic", categories: ["metabolic"],
    sizes: [{ label: "5 mg", price: 6500 }, { label: "10 mg", price: 7500 }, { label: "20 mg", price: 8500 }],
    ...SPEC, featured: true, bestSeller: true,
    overview: "Tirzepatide is a 39-amino-acid dual agonist of the GIP and GLP-1 receptors developed for advanced research applications. It supports investigations into metabolic regulation, glucose homeostasis and body composition in laboratory models.",
    research: ["Dual GIP/GLP-1 receptor pharmacology", "Glucose-metabolism studies", "Insulin-sensitivity research", "Weight-regulation models"],
    related: ["retatrutide", "semaglutide"],
  },
  {
    slug: "bpc-157-tb-500", sku: "BTLS-101", code: "BPCTB10", image: "/images/products/bpc-157-tb-500.webp", name: "BPC-157 + TB-500", altName: "Repair Blend",
    compoundType: "Peptide Blend", category: "tissue-repair", categories: ["tissue-repair", "connective"],
    sizes: [{ label: "5 mg", price: 3499 }, { label: "10 mg", price: 5999 }, { label: "20 mg", price: 11999 }],
    ...SPEC, featured: true, bestSeller: true,
    overview: "A research combination of two well-studied peptides — BPC-157 and TB-500 — widely used in laboratory research to explore healing processes, cellular regeneration and angiogenesis in preclinical models.",
    research: ["Tissue repair and regeneration models", "Wound-healing studies", "Angiogenesis research", "Cell-migration assays"],
    related: ["bpc-157", "tb-500", "ghk-cu"],
  },
  {
    slug: "ghk-cu", sku: "BTLS-201", code: "CU50", image: "/images/products/ghk-cu.webp", name: "GHK-Cu", altName: "Copper Peptide",
    compoundType: "Peptide", category: "dermal", categories: ["dermal", "tissue-repair", "longevity"],
    sizes: [{ label: "25 mg", price: 2499 }, { label: "50 mg", price: 6999 }, { label: "100 mg", price: 11999 }],
    ...SPEC, featured: true,
    overview: "GHK-Cu is a naturally occurring copper-binding tripeptide (glycyl-L-histidyl-L-lysine) studied for its regenerative properties in dermal-science literature — including collagen synthesis, skin remodeling, hair-follicle biology and tissue-repair research.",
    research: ["Collagen-synthesis studies", "Skin-remodeling research", "Hair-follicle biology", "Wound-repair models", "Gene-expression research"],
    related: ["bpc-157-tb-500", "collagen-peptides", "epitalon"],
  },
  {
    slug: "hgh", sku: "BTLS-301", code: "HGH10", image: "/images/products/hgh.webp", name: "HGH", altName: "Human Growth Hormone (Somatropin)",
    compoundType: "Protein", category: "gh-performance", categories: ["gh-performance", "metabolic"],
    sizes: [{ label: "5 IU", price: 2999 }, { label: "10 IU", price: 4999 }, { label: "20 IU", price: 8999 }],
    ...SPEC, featured: true,
    overview: "Human Growth Hormone is a naturally occurring 191-amino-acid protein central to growth, cell regeneration and metabolic function. It is widely used in laboratory research to study growth processes, protein synthesis, fat metabolism and tissue repair.",
    research: ["Growth & development research", "Protein-synthesis studies", "Fat-metabolism and body-composition research", "GH-receptor signaling"],
    related: ["cjc-1295-no-dac", "ipamorelin", "igf-1-lr3"],
  },
  {
    slug: "cjc-1295-no-dac", sku: "BTLS-302", code: "CND5", image: "/images/products/cjc-1295-no-dac.webp", name: "CJC-1295 No DAC", altName: "Mod GRF (1-29)",
    compoundType: "Peptide", category: "gh-performance", categories: ["gh-performance"],
    sizes: [{ label: "5 mg", price: 4499 }, { label: "10 mg", price: 6599 }],
    ...SPEC, featured: true,
    overview: "CJC-1295 No DAC is a synthetic Growth Hormone Releasing Hormone (GHRH) analogue widely utilized in laboratory research to investigate pulsatile growth hormone release, endocrine signaling and metabolic function. Its short-acting profile makes it a valuable tool for controlled scientific studies.",
    research: ["Pulsatile GH-release research", "GHRH-receptor signaling", "Endocrine and metabolic studies"],
    related: ["cjc-1295-dac", "ipamorelin", "sermorelin"],
  },
  {
    slug: "cjc-1295-dac", sku: "BTLS-303", code: "CD5", image: "/images/products/cjc-1295-with-dac.webp", name: "CJC-1295 With DAC",
    compoundType: "Peptide", category: "gh-performance", categories: ["gh-performance"],
    sizes: [{ label: "5 mg", price: 4999 }, { label: "10 mg", price: 7099 }],
    ...SPEC, featured: true,
    overview: "CJC-1295 With DAC is a long-acting GHRH analogue carrying a Drug Affinity Complex that extends its half-life, allowing prolonged stimulation of growth-hormone release in scientific research. It is widely used in laboratory studies focused on growth, recovery and body composition.",
    research: ["Long-acting GHRH pharmacology", "GH-secretion research", "Body-composition and metabolic studies"],
    related: ["cjc-1295-no-dac", "ipamorelin", "hgh"],
  },
  {
    slug: "ipamorelin", sku: "BTLS-304", code: "IP5", image: "/images/products/ipamorelin.webp", name: "Ipamorelin",
    compoundType: "Peptide", category: "gh-performance", categories: ["gh-performance"],
    sizes: [{ label: "5 mg", price: 3999 }, { label: "10 mg", price: 5999 }],
    ...SPEC, featured: true,
    overview: "Ipamorelin is a selective growth hormone secretagogue that stimulates GH release by mimicking ghrelin at the GHS-R1a receptor. It is widely used in laboratory research on growth-hormone release and is noted in the literature for its selectivity and minimal impact on cortisol and prolactin.",
    research: ["GHS-R1a receptor pharmacology", "GH-release research", "Secretagogue-selectivity studies"],
    related: ["cjc-1295-no-dac", "cjc-1295-dac", "ghrp-2"],
  },

  // ================= TISSUE REPAIR =================
  {
    slug: "bpc-157", sku: "BTLS-102", name: "BPC-157", altName: "Pentadecapeptide BPC",
    compoundType: "Peptide", category: "tissue-repair", categories: ["tissue-repair", "gastrointestinal"],
    sizes: [{ label: "5 mg", price: 2199 }, { label: "10 mg", price: 3799 }],
    ...SPEC, bestSeller: true,
    overview: "A synthetic pentadecapeptide derived from a protective protein identified in gastric juice. It is studied in preclinical models of tendon, ligament, muscle and gastrointestinal mucosal repair, and in research on angiogenesis-related signaling pathways.",
    research: ["Tissue-repair models", "Angiogenesis signaling", "GI mucosal research"],
    related: ["tb-500", "bpc-157-tb-500", "kpv"],
  },
  {
    slug: "tb-500", sku: "BTLS-103", name: "TB-500", altName: "Thymosin β4 fragment",
    compoundType: "Peptide", category: "tissue-repair", categories: ["tissue-repair"],
    sizes: [{ label: "5 mg", price: 2399 }, { label: "10 mg", price: 3999 }],
    ...SPEC,
    overview: "A synthetic peptide corresponding to the actin-binding region of thymosin beta-4. It is used in cell-migration assays and in preclinical wound-model and tissue-repair research.",
    research: ["Cell migration", "Actin dynamics", "Wound models"],
    related: ["bpc-157", "bpc-157-tb-500"],
  },
  {
    slug: "kpv", sku: "BTLS-104", name: "KPV", altName: "α-MSH (11-13)",
    compoundType: "Peptide", category: "tissue-repair", categories: ["tissue-repair", "immune", "gastrointestinal"],
    sizes: [{ label: "10 mg", price: 2499 }],
    ...SPEC,
    overview: "A tripeptide fragment of alpha-melanocyte-stimulating hormone studied in anti-inflammatory-signaling, gut-barrier and dermal research models.",
    research: ["Inflammation-signaling research", "Gut-barrier models", "Dermal research"],
    related: ["bpc-157", "ll-37", "melanotan-ii"],
  },
  {
    slug: "ara-290", sku: "BTLS-105", name: "ARA-290", altName: "Cibinetide",
    compoundType: "Peptide", category: "tissue-repair", categories: ["tissue-repair", "cognitive"],
    sizes: [{ label: "10 mg", price: 3299 }],
    ...SPEC,
    overview: "An 11-amino-acid peptide derived from the helix-B domain of erythropoietin. It is studied in innate-repair-receptor signaling and small-fiber-neuropathy research models.",
    research: ["Innate repair receptor signaling", "Neuropathy research models"],
    related: ["bpc-157", "ll-37"],
  },
  {
    slug: "ll-37", sku: "BTLS-106", name: "LL-37", altName: "Cathelicidin",
    compoundType: "Peptide", category: "immune", categories: ["immune", "tissue-repair"],
    sizes: [{ label: "5 mg", price: 3499 }],
    ...SPEC,
    overview: "The only human cathelicidin-family host-defense peptide. It is studied in antimicrobial-peptide research, innate-immune signaling and wound-biology models.",
    research: ["Host-defense peptide research", "Innate-immune signaling", "Wound biology"],
    related: ["thymosin-alpha-1", "kpv"],
  },
  {
    slug: "b7-33", sku: "BTLS-107", name: "B7-33", altName: "Relaxin analogue",
    compoundType: "Peptide", category: "connective", categories: ["connective", "tissue-repair"],
    sizes: [{ label: "10 mg", price: 3299 }],
    ...SPEC,
    overview: "A single-chain analogue of the B-chain of human relaxin-2. It is studied in anti-fibrotic signaling and RXFP1-receptor research models.",
    research: ["Anti-fibrotic signaling research", "RXFP1 receptor pharmacology"],
    related: ["cartalax", "bpc-157"],
  },
  {
    slug: "cartalax", sku: "BTLS-108", name: "Cartalax",
    compoundType: "Peptide", category: "connective", categories: ["connective"],
    sizes: [{ label: "20 mg", price: 2899 }],
    ...SPEC,
    overview: "A short bioregulator peptide studied in cartilage and connective-tissue research models within the peptide-bioregulator literature.",
    research: ["Cartilage research models", "Connective-tissue biology"],
    related: ["b7-33", "collagen-peptides"],
  },
  {
    slug: "chonluten", sku: "BTLS-109", name: "Chonluten",
    compoundType: "Peptide", category: "other", categories: ["other"],
    sizes: [{ label: "20 mg", price: 2899 }],
    ...SPEC,
    overview: "A tripeptide bioregulator studied in bronchial-epithelium and respiratory-mucosa research models.",
    research: ["Respiratory-mucosa research", "Peptide-bioregulator studies"],
    related: ["cartalax", "cortagen"],
  },

  // ================= GH & PERFORMANCE =================
  {
    slug: "sermorelin", sku: "BTLS-305", name: "Sermorelin", altName: "GHRH (1-29)",
    compoundType: "Peptide", category: "gh-performance", categories: ["gh-performance"],
    sizes: [{ label: "5 mg", price: 2199 }, { label: "10 mg", price: 3799 }],
    ...SPEC,
    overview: "An analogue of the first 29 amino acids of growth-hormone-releasing hormone, widely used as a reference standard in GH-axis and pituitary-signaling research.",
    research: ["Pituitary signaling", "GH-axis reference studies"],
    related: ["cjc-1295-no-dac", "tesamorelin"],
  },
  {
    slug: "tesamorelin", sku: "BTLS-306", name: "Tesamorelin",
    compoundType: "Peptide", category: "gh-performance", categories: ["gh-performance", "metabolic"],
    sizes: [{ label: "5 mg", price: 2999 }, { label: "10 mg", price: 4999 }],
    ...SPEC,
    overview: "A stabilized GHRH analogue with an N-terminal modification that increases resistance to enzymatic degradation. It is studied in adipose-tissue biology and visceral-fat metabolic research contexts.",
    research: ["Adipose-tissue biology", "Visceral-fat research", "Peptide-stability studies"],
    related: ["sermorelin", "aod-9604"],
  },
  {
    slug: "ghrp-2", sku: "BTLS-307", name: "GHRP-2", altName: "Pralmorelin",
    compoundType: "Peptide", category: "gh-performance", categories: ["gh-performance"],
    sizes: [{ label: "5 mg", price: 1999 }, { label: "10 mg", price: 3499 }],
    ...SPEC,
    overview: "A synthetic hexapeptide growth-hormone secretagogue studied in ghrelin-receptor pharmacology and GH-release research models.",
    research: ["Ghrelin-receptor pharmacology", "GH-release studies"],
    related: ["ghrp-6", "ipamorelin", "hexarelin"],
  },
  {
    slug: "ghrp-6", sku: "BTLS-308", name: "GHRP-6",
    compoundType: "Peptide", category: "gh-performance", categories: ["gh-performance"],
    sizes: [{ label: "5 mg", price: 1999 }, { label: "10 mg", price: 3499 }],
    ...SPEC,
    overview: "A first-generation hexapeptide growth-hormone secretagogue used in GH-release and appetite-signaling research models.",
    research: ["GH-secretagogue research", "Appetite-signaling models"],
    related: ["ghrp-2", "hexarelin"],
  },
  {
    slug: "hexarelin", sku: "BTLS-309", name: "Hexarelin",
    compoundType: "Peptide", category: "gh-performance", categories: ["gh-performance"],
    sizes: [{ label: "5 mg", price: 2299 }],
    ...SPEC,
    overview: "A potent hexapeptide GH secretagogue additionally studied in cardiac-tissue and CD36-receptor research models.",
    research: ["GH-secretagogue pharmacology", "Cardiac-receptor research"],
    related: ["ghrp-2", "ghrp-6"],
  },
  {
    slug: "igf-1-lr3", sku: "BTLS-310", name: "IGF-1 LR3",
    compoundType: "Protein", category: "gh-performance", categories: ["gh-performance", "cellular"],
    sizes: [{ label: "1 mg", price: 3999 }],
    ...SPEC,
    overview: "A long-arginine-3 analogue of insulin-like growth factor 1 with reduced binding-protein affinity. It is used in cell-culture, hypertrophy-signaling and growth-factor research.",
    research: ["IGF-receptor signaling", "Cell-culture growth studies", "Hypertrophy models"],
    related: ["hgh", "peg-mgf"],
  },
  {
    slug: "peg-mgf", sku: "BTLS-311", name: "PEG-MGF", altName: "Pegylated Mechano Growth Factor",
    compoundType: "Peptide", category: "gh-performance", categories: ["gh-performance", "tissue-repair"],
    sizes: [{ label: "5 mg", price: 3299 }],
    ...SPEC,
    overview: "A pegylated splice-variant fragment of IGF-1 studied in muscle-tissue repair and satellite-cell activation research models.",
    research: ["Muscle-repair models", "Satellite-cell research"],
    related: ["igf-1-lr3", "follistatin-344"],
  },
  {
    slug: "follistatin-344", sku: "BTLS-312", name: "Follistatin 344",
    compoundType: "Protein", category: "gh-performance", categories: ["gh-performance", "other"],
    sizes: [{ label: "1 mg", price: 6999 }],
    ...SPEC,
    overview: "A follistatin isoform studied in myostatin-binding and muscle-biology research models.",
    research: ["Myostatin-pathway research", "Muscle-biology models"],
    related: ["peg-mgf", "igf-1-lr3"],
  },

  // ================= METABOLIC =================
  {
    slug: "semaglutide", sku: "BTLS-603", name: "Semaglutide",
    compoundType: "Peptide", category: "metabolic", categories: ["metabolic"],
    sizes: [{ label: "5 mg", price: 3999 }, { label: "10 mg", price: 6999 }],
    ...SPEC, bestSeller: true,
    overview: "A long-acting GLP-1 receptor agonist analogue with a fatty-diacid side chain enabling albumin binding. It serves as a reference material in incretin-signaling and receptor-pharmacology research.",
    research: ["GLP-1 receptor pharmacology", "Incretin signaling", "Glucose-regulation research"],
    related: ["tirzepatide", "retatrutide"],
  },
  {
    slug: "aod-9604", sku: "BTLS-604", name: "AOD-9604", altName: "hGH fragment 176-191 analogue",
    compoundType: "Peptide", category: "metabolic", categories: ["metabolic"],
    sizes: [{ label: "5 mg", price: 2499 }, { label: "10 mg", price: 4299 }],
    ...SPEC,
    overview: "A modified C-terminal fragment of human growth hormone (residues 176-191). It is studied in lipid-metabolism and adipose-tissue research without the growth-promoting activity of the parent molecule.",
    research: ["Lipid metabolism", "Adipose-tissue research"],
    related: ["hgh-frag-176-191", "tesamorelin"],
  },
  {
    slug: "hgh-frag-176-191", sku: "BTLS-605", name: "HGH Fragment 176-191",
    compoundType: "Protein Fragment", category: "metabolic", categories: ["metabolic"],
    sizes: [{ label: "5 mg", price: 2299 }],
    ...SPEC,
    overview: "The C-terminal fragment of human growth hormone studied in lipolysis and fat-metabolism research models.",
    research: ["Lipolysis studies", "Fat-metabolism research"],
    related: ["aod-9604", "hgh"],
  },
  {
    slug: "5-amino-1mq", sku: "BTLS-606", name: "5-Amino-1MQ",
    compoundType: "Small Molecule", category: "metabolic", categories: ["metabolic", "cellular"],
    sizes: [{ label: "50 mg", price: 3499 }],
    ...SPEC, purity: "≥ 98% (HPLC)",
    overview: "A small-molecule inhibitor of nicotinamide N-methyltransferase (NNMT) studied in cellular-metabolism and NAD⁺-pathway research.",
    research: ["NNMT-pathway research", "Cellular-metabolism studies"],
    related: ["nad-plus", "mots-c"],
  },
  {
    slug: "pancregen", sku: "BTLS-607", name: "Pancregen",
    compoundType: "Peptide", category: "metabolic", categories: ["metabolic", "gastrointestinal"],
    sizes: [{ label: "20 mg", price: 2899 }],
    ...SPEC,
    overview: "A short bioregulator peptide studied in pancreatic-tissue research models within the peptide-bioregulator literature.",
    research: ["Pancreatic research models", "Peptide-bioregulator studies"],
    related: ["chonluten", "cartalax"],
  },

  // ================= MITOCHONDRIAL / CELLULAR =================
  {
    slug: "mots-c", sku: "BTLS-501", name: "MOTS-c",
    compoundType: "Peptide", category: "mitochondrial", categories: ["mitochondrial", "metabolic", "cellular"],
    sizes: [{ label: "5 mg", price: 2999 }, { label: "10 mg", price: 4999 }],
    ...SPEC,
    overview: "A 16-amino-acid mitochondrial-derived peptide encoded within the 12S rRNA region of mitochondrial DNA. It is studied in metabolic-homeostasis, AMPK-signaling and exercise-physiology research.",
    research: ["AMPK signaling", "Metabolic homeostasis", "Exercise physiology"],
    related: ["ss-31", "humanin", "5-amino-1mq"],
  },
  {
    slug: "ss-31", sku: "BTLS-502", name: "SS-31", altName: "Elamipretide",
    compoundType: "Peptide", category: "mitochondrial", categories: ["mitochondrial", "cellular"],
    sizes: [{ label: "10 mg", price: 4499 }],
    ...SPEC,
    overview: "A cardiolipin-targeting tetrapeptide studied in mitochondrial-membrane and cellular-bioenergetics research models.",
    research: ["Cardiolipin-binding research", "Mitochondrial bioenergetics"],
    related: ["mots-c", "humanin", "methylene-blue"],
  },
  {
    slug: "humanin", sku: "BTLS-503", name: "Humanin",
    compoundType: "Peptide", category: "mitochondrial", categories: ["mitochondrial", "longevity", "cognitive"],
    sizes: [{ label: "10 mg", price: 3999 }],
    ...SPEC,
    overview: "A mitochondrial-derived peptide studied in cytoprotection, cellular-stress-response and aging-biology research.",
    research: ["Cytoprotection models", "Cellular stress response", "Aging biology"],
    related: ["mots-c", "ss-31", "epitalon"],
  },
  {
    slug: "nad-plus", sku: "BTLS-504", name: "NAD+", altName: "Nicotinamide adenine dinucleotide",
    compoundType: "Coenzyme", category: "cellular", categories: ["cellular", "longevity", "mitochondrial"],
    sizes: [{ label: "100 mg", price: 2999 }, { label: "500 mg", price: 8999 }],
    ...SPEC, purity: "≥ 98% (HPLC)",
    overview: "A central redox coenzyme found in all living cells. It is used in cellular-energy, sirtuin-pathway and aging-biology research.",
    research: ["Redox biology", "Sirtuin-pathway research", "Cellular-energy studies"],
    related: ["5-amino-1mq", "glutathione", "mots-c"],
  },
  {
    slug: "glutathione", sku: "BTLS-505", name: "Glutathione",
    compoundType: "Peptide", category: "cellular", categories: ["cellular", "dermal", "immune"],
    sizes: [{ label: "600 mg", price: 1999 }, { label: "1200 mg", price: 3499 }],
    ...SPEC, purity: "≥ 98% (HPLC)",
    overview: "A tripeptide antioxidant central to cellular redox regulation. It is used in oxidative-stress, detoxification-pathway and cellular-protection research.",
    research: ["Oxidative-stress research", "Redox regulation", "Cellular-protection models"],
    related: ["nad-plus", "methylene-blue"],
  },
  {
    slug: "methylene-blue", sku: "BTLS-506", name: "Methylene Blue",
    compoundType: "Small Molecule", category: "cellular", categories: ["cellular", "mitochondrial", "cognitive"],
    sizes: [{ label: "10 g (USP grade)", price: 2499 }],
    ...SPEC, purity: "≥ 98% (HPLC)", form: "Crystalline powder", storage: "Room temperature, protect from light",
    overview: "A redox-active small molecule with a long history in laboratory science. It is studied in mitochondrial-electron-transport, redox-cycling and neurobiology research models.",
    research: ["Mitochondrial electron transport", "Redox cycling", "Neurobiology models"],
    related: ["ss-31", "nad-plus"],
  },

  // ================= COGNITIVE & NEURO =================
  {
    slug: "semax", sku: "BTLS-401", name: "Semax",
    compoundType: "Peptide", category: "cognitive", categories: ["cognitive"],
    sizes: [{ label: "10 mg", price: 2799 }, { label: "30 mg", price: 5999 }],
    ...SPEC,
    overview: "A synthetic heptapeptide analogue of ACTH(4-10) with a C-terminal Pro-Gly-Pro extension. It is studied in neurotrophin (BDNF) expression, neuroprotection and cognition research models.",
    research: ["BDNF expression", "Neuroprotection models", "Cognition research"],
    related: ["n-acetyl-semax", "selank", "dihexa"],
  },
  {
    slug: "n-acetyl-semax", sku: "BTLS-402", name: "N-Acetyl Semax",
    compoundType: "Peptide", category: "cognitive", categories: ["cognitive"],
    sizes: [{ label: "30 mg", price: 6499 }],
    ...SPEC,
    overview: "An N-acetylated variant of Semax studied for altered stability characteristics in neurotrophin and cognition research models.",
    research: ["Peptide-stability research", "Neurotrophin studies"],
    related: ["semax", "n-acetyl-selank"],
  },
  {
    slug: "selank", sku: "BTLS-403", name: "Selank",
    compoundType: "Peptide", category: "cognitive", categories: ["cognitive", "immune"],
    sizes: [{ label: "10 mg", price: 2799 }, { label: "30 mg", price: 5999 }],
    ...SPEC,
    overview: "A synthetic analogue of the endogenous tetrapeptide tuftsin. It is studied in anxiolytic-pathway, GABAergic-signaling and immune-modulation research models.",
    research: ["GABAergic signaling", "Anxiolytic-pathway research", "Immune modulation"],
    related: ["n-acetyl-selank", "semax"],
  },
  {
    slug: "n-acetyl-selank", sku: "BTLS-404", name: "N-Acetyl Selank",
    compoundType: "Peptide", category: "cognitive", categories: ["cognitive"],
    sizes: [{ label: "30 mg", price: 6499 }],
    ...SPEC,
    overview: "An N-acetylated variant of Selank studied for altered stability characteristics in stress-response and GABAergic research models.",
    research: ["Peptide-stability research", "Stress-response models"],
    related: ["selank", "n-acetyl-semax"],
  },
  {
    slug: "pinealon", sku: "BTLS-405", name: "Pinealon",
    compoundType: "Peptide", category: "cognitive", categories: ["cognitive", "longevity"],
    sizes: [{ label: "20 mg", price: 2899 }],
    ...SPEC,
    overview: "A tripeptide bioregulator (Glu-Asp-Arg) studied in neuronal-cell and memory-related research models within the peptide-bioregulator literature.",
    research: ["Neuronal-cell research", "Memory-related models"],
    related: ["epitalon", "cortagen"],
  },
  {
    slug: "dihexa", sku: "BTLS-406", name: "Dihexa",
    compoundType: "Small Molecule", category: "cognitive", categories: ["cognitive"],
    sizes: [{ label: "10 mg", price: 3499 }],
    ...SPEC, purity: "≥ 98% (HPLC)",
    overview: "An angiotensin IV-derived molecule studied in HGF/c-Met-pathway and synaptogenesis research models.",
    research: ["HGF/c-Met pathway research", "Synaptogenesis models"],
    related: ["semax", "p21"],
  },
  {
    slug: "p21", sku: "BTLS-407", name: "P21",
    compoundType: "Peptide", category: "cognitive", categories: ["cognitive"],
    sizes: [{ label: "5 mg", price: 3999 }],
    ...SPEC,
    overview: "A CNTF-derived peptidergic compound studied in neurogenesis and cellular-repair research models.",
    research: ["Neurogenesis research", "Cellular-repair models"],
    related: ["dihexa", "semax"],
  },
  {
    slug: "pe-22-28", sku: "BTLS-408", name: "PE-22-28",
    compoundType: "Peptide", category: "cognitive", categories: ["cognitive"],
    sizes: [{ label: "10 mg", price: 3499 }],
    ...SPEC,
    overview: "A spadin-derived heptapeptide studied in TREK-1-channel and mood-related research models.",
    research: ["TREK-1 channel research", "Preclinical mood models"],
    related: ["selank", "semax"],
  },
  {
    slug: "cortagen", sku: "BTLS-409", name: "Cortagen",
    compoundType: "Peptide", category: "cognitive", categories: ["cognitive", "immune"],
    sizes: [{ label: "20 mg", price: 2899 }],
    ...SPEC,
    overview: "A tetrapeptide bioregulator studied in neuro-immune and cortical-tissue research models.",
    research: ["Neuro-immune research", "Peptide-bioregulator studies"],
    related: ["pinealon", "chonluten"],
  },

  // ================= SLEEP / LONGEVITY =================
  {
    slug: "dsip", sku: "BTLS-410", name: "DSIP", altName: "Delta sleep-inducing peptide",
    compoundType: "Peptide", category: "sleep", categories: ["sleep", "cognitive"],
    sizes: [{ label: "5 mg", price: 2299 }, { label: "10 mg", price: 3999 }],
    ...SPEC,
    overview: "A nonapeptide first isolated in sleep research. It is studied in sleep-architecture, circadian-rhythm and stress-response research models.",
    research: ["Sleep architecture", "Circadian research", "Stress response"],
    related: ["epitalon", "selank"],
  },
  {
    slug: "epitalon", sku: "BTLS-411", name: "Epitalon", altName: "Epithalon / AEDG",
    compoundType: "Peptide", category: "longevity", categories: ["longevity", "sleep"],
    sizes: [{ label: "10 mg", price: 2699 }, { label: "50 mg", price: 7999 }],
    ...SPEC,
    overview: "A synthetic tetrapeptide (Ala-Glu-Asp-Gly) studied in telomerase-activity, pineal-function and aging-biology research.",
    research: ["Telomerase-activity research", "Pineal-function studies", "Aging biology"],
    related: ["pinealon", "humanin", "nad-plus"],
  },

  // ================= IMMUNE =================
  {
    slug: "thymosin-alpha-1", sku: "BTLS-701", name: "Thymosin Alpha-1", altName: "Tα1",
    compoundType: "Peptide", category: "immune", categories: ["immune"],
    sizes: [{ label: "5 mg", price: 3499 }, { label: "10 mg", price: 5999 }],
    ...SPEC,
    overview: "A 28-amino-acid thymic peptide extensively studied in immune-signaling, T-cell-biology and immunomodulation research.",
    research: ["T-cell biology", "Immune-signaling research", "Immunomodulation models"],
    related: ["thymulin", "ll-37"],
  },
  {
    slug: "thymulin", sku: "BTLS-702", name: "Thymulin",
    compoundType: "Peptide", category: "immune", categories: ["immune"],
    sizes: [{ label: "10 mg", price: 3299 }],
    ...SPEC,
    overview: "A zinc-dependent nonapeptide of thymic origin studied in immune-regulation and neuro-immune research models.",
    research: ["Immune regulation", "Neuro-immune research"],
    related: ["thymosin-alpha-1", "ll-37"],
  },
  {
    slug: "vip", sku: "BTLS-703", name: "VIP", altName: "Vasoactive Intestinal Peptide",
    compoundType: "Peptide", category: "immune", categories: ["immune", "gastrointestinal"],
    sizes: [{ label: "5 mg", price: 3999 }],
    ...SPEC,
    overview: "A 28-amino-acid neuropeptide studied in smooth-muscle, immune-modulation and gut-signaling research models.",
    research: ["Neuropeptide signaling", "Immune modulation", "GI research models"],
    related: ["thymosin-alpha-1", "kpv"],
  },

  // ================= REPRODUCTIVE / SEXUAL BIOLOGY =================
  {
    slug: "pt-141", sku: "BTLS-801", name: "PT-141", altName: "Bremelanotide",
    compoundType: "Peptide", category: "reproductive", categories: ["reproductive"],
    sizes: [{ label: "10 mg", price: 2999 }],
    ...SPEC,
    overview: "A cyclic melanocortin-receptor agonist studied in MC4R-pathway and sexual-function research models.",
    research: ["Melanocortin-receptor pharmacology", "MC4R-pathway research"],
    related: ["melanotan-ii", "kisspeptin-10"],
  },
  {
    slug: "melanotan-ii", sku: "BTLS-802", name: "Melanotan II",
    compoundType: "Peptide", category: "reproductive", categories: ["reproductive", "dermal"],
    sizes: [{ label: "10 mg", price: 2499 }],
    ...SPEC,
    overview: "A cyclic analogue of alpha-MSH studied in melanocortin-receptor and pigmentation-biology research models.",
    research: ["Pigmentation biology", "Melanocortin-receptor research"],
    related: ["pt-141", "kpv"],
  },
  {
    slug: "kisspeptin-10", sku: "BTLS-803", name: "Kisspeptin-10",
    compoundType: "Peptide", category: "reproductive", categories: ["reproductive"],
    sizes: [{ label: "5 mg", price: 2999 }],
    ...SPEC,
    overview: "A decapeptide fragment of kisspeptin studied in GnRH-axis and reproductive-endocrinology research models.",
    research: ["GnRH-axis research", "Reproductive endocrinology"],
    related: ["pt-141", "oxytocin"],
  },
  {
    slug: "oxytocin", sku: "BTLS-804", name: "Oxytocin",
    compoundType: "Peptide", category: "reproductive", categories: ["reproductive", "cognitive"],
    sizes: [{ label: "10 mg", price: 2499 }],
    ...SPEC,
    overview: "A cyclic nonapeptide hormone studied in social-behavior, bonding and receptor-signaling research models.",
    research: ["Oxytocin-receptor signaling", "Behavioral neuroscience models"],
    related: ["kisspeptin-10", "pt-141"],
  },

  // ================= DERMAL / STRUCTURAL =================
  {
    slug: "collagen-peptides", sku: "BTLS-901", name: "Collagen Peptides", altName: "Hydrolyzed collagen",
    compoundType: "Protein Fragment", category: "connective", categories: ["connective", "dermal"],
    sizes: [{ label: "250 g", price: 1499 }, { label: "500 g", price: 2499 }],
    ...SPEC, purity: undefined, form: "Hydrolyzed powder", storage: "Cool, dry place",
    overview: "Enzymatically hydrolyzed collagen fragments used in matrix-biology, skin-research and connective-tissue studies.",
    research: ["Matrix biology", "Skin-research models", "Connective-tissue studies"],
    related: ["ghk-cu", "cartalax"],
  },
  {
    slug: "vitamin-b12", sku: "BTLS-902", name: "Vitamin B12", altName: "Methylcobalamin",
    compoundType: "Vitamin", category: "cellular", categories: ["cellular", "other"],
    sizes: [{ label: "10 mg", price: 1499 }],
    ...SPEC, purity: "≥ 98% (HPLC)",
    overview: "The methylated, biologically active form of cobalamin used in methylation-pathway, neuronal and cellular-metabolism research.",
    research: ["Methylation-pathway research", "Cellular-metabolism studies"],
    related: ["nad-plus", "glutathione"],
  },

  // ================= PRE-FILLED RESEARCH PENS =================
  // Same compounds as their vial counterparts, supplied in a pre-filled,
  // multi-dose pen format for laboratory dosing-precision and delivery-
  // device research. Same RUO framing and disclaimer as every other
  // product — no dosing or self-administration guidance is provided.
  {
    slug: "ghk-cu-pen", sku: "BTLS-201P", code: "CU50P", deviceType: "pen",
    name: "GHK-Cu Pen", altName: "Copper Peptide — Pre-Filled Pen",
    compoundType: "Peptide", category: "dermal", categories: ["dermal", "tissue-repair", "longevity"],
    sizes: [{ label: "50 mg pen", price: 8999 }, { label: "100 mg pen", price: 14999 }],
    purity: "≥ 98% (RP-HPLC)", form: "Pre-filled, multi-dose research pen", storage: "Refrigerate 2–8 °C after reconstitution, protect from light",
    stability: "21 days refrigerated once reconstituted", solubility: "Pre-reconstituted, bacteriostatic water carrier (for research use only)",
    overview: "GHK-Cu supplied in a pre-filled, multi-dose pen device rather than a lyophilized vial, for laboratory research into delivery-device consistency and dosing precision alongside its established use in collagen-synthesis and skin-remodeling research.",
    research: ["Delivery-device and dosing-precision studies", "Collagen-synthesis studies", "Skin-remodeling research", "Wound-repair models"],
    featured: true, isNew: true,
    related: ["ghk-cu", "bpc-157-tb-500"],
  },
  {
    slug: "retatrutide-pen", sku: "BTLS-601P", code: "RT10P", deviceType: "pen",
    name: "Retatrutide Pen", altName: "Triple Agonist — Pre-Filled Pen",
    compoundType: "Peptide", category: "metabolic", categories: ["metabolic"],
    sizes: [{ label: "10 mg pen", price: 12999 }, { label: "20 mg pen", price: 18999 }],
    purity: "≥ 98% (RP-HPLC)", form: "Pre-filled, multi-dose research pen", storage: "Refrigerate 2–8 °C after reconstitution, protect from light",
    stability: "21 days refrigerated once reconstituted", solubility: "Pre-reconstituted, bacteriostatic water carrier (for research use only)",
    overview: "Retatrutide supplied in a pre-filled, multi-dose pen device rather than a lyophilized vial, for laboratory research into delivery-device consistency and dosing precision alongside its established use as a reference material in multi-receptor metabolic-signaling research.",
    research: ["Delivery-device and dosing-precision studies", "Triple-agonist receptor pharmacology", "Metabolic regulation studies", "Energy-balance research"],
    featured: true, isNew: true,
    related: ["retatrutide", "tirzepatide"],
  },
  {
    slug: "bpc-157-pen", sku: "BTLS-102P", code: "BPC10P", deviceType: "pen",
    name: "BPC-157 Pen", altName: "Pentadecapeptide BPC — Pre-Filled Pen",
    compoundType: "Peptide", category: "tissue-repair", categories: ["tissue-repair", "gastrointestinal"],
    sizes: [{ label: "10 mg pen", price: 6999 }],
    purity: "≥ 98% (RP-HPLC)", form: "Pre-filled, multi-dose research pen", storage: "Refrigerate 2–8 °C after reconstitution, protect from light",
    stability: "21 days refrigerated once reconstituted", solubility: "Pre-reconstituted, bacteriostatic water carrier (for research use only)",
    overview: "BPC-157 supplied in a pre-filled, multi-dose pen device rather than a lyophilized vial, for laboratory research into delivery-device consistency and dosing precision alongside its established use in tissue-repair and gastrointestinal mucosal research models.",
    research: ["Delivery-device and dosing-precision studies", "Tissue-repair models", "Angiogenesis signaling", "GI mucosal research"],
    featured: true, isNew: true,
    related: ["bpc-157", "tb-500-pen"],
  },
  {
    slug: "tb-500-pen", sku: "BTLS-103P", code: "TB10P", deviceType: "pen",
    name: "TB-500 Pen", altName: "Thymosin β4 fragment — Pre-Filled Pen",
    compoundType: "Peptide", category: "tissue-repair", categories: ["tissue-repair"],
    sizes: [{ label: "10 mg pen", price: 7499 }],
    purity: "≥ 98% (RP-HPLC)", form: "Pre-filled, multi-dose research pen", storage: "Refrigerate 2–8 °C after reconstitution, protect from light",
    stability: "21 days refrigerated once reconstituted", solubility: "Pre-reconstituted, bacteriostatic water carrier (for research use only)",
    overview: "TB-500 supplied in a pre-filled, multi-dose pen device rather than a lyophilized vial, for laboratory research into delivery-device consistency and dosing precision alongside its established use in cell-migration assays and wound-model research.",
    research: ["Delivery-device and dosing-precision studies", "Cell migration", "Actin dynamics", "Wound models"],
    featured: true, isNew: true,
    related: ["bpc-157-pen", "tb-500"],
  },
]

// ---- helpers ------------------------------------------------
export const bySlug = (slug: string) => products.find((p) => p.slug === slug)
export const inCategory = (slug: CategorySlug) => products.filter((p) => p.categories.includes(slug))
export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug)
export const featured = products.filter((p) => p.featured)
export const compoundTypes: CompoundType[] = Array.from(new Set(products.map((p) => p.compoundType))) as CompoundType[]

export const primaryCategories: CategorySlug[] = ["tissue-repair", "dermal", "cellular"]
