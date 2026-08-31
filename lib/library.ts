import type { DiagramKey } from "@/components/diagrams"

export type Article = {
  slug: string
  title: string
  category: string
  minutes: number
  summary: string
  body: string[] // paragraphs
  diagram?: DiagramKey
}

export const articles: Article[] = [
  {
    slug: "what-are-research-peptides",
    title: "What Are Research Peptides?",
    category: "Peptide Fundamentals", minutes: 6,
    summary: "Short chains of amino acids, and why they matter as laboratory research tools.",
    diagram: "peptide-chain",
    body: [
      "Peptides are short chains of amino acids linked by peptide bonds — typically between 2 and 50 residues. They sit between single amino acids and full proteins in size, and they act as some of biology's most important signaling molecules: hormones, neurotransmitter modulators, host-defense molecules and growth-factor fragments are all peptides.",
      "Research peptides are synthetic versions of these molecules, manufactured by solid-phase peptide synthesis (SPPS) for use in laboratory research. They serve as reference materials in receptor-pharmacology studies, tools in cell-culture experiments, standards in analytical method development, and probes in preclinical models.",
      "The critical distinction is between research materials and medicines. A research peptide is characterized for identity and purity, but it has not gone through the pharmaceutical development, formulation, sterility validation and regulatory review that a medicine requires. That is why research peptides are supplied strictly for laboratory use, never for human or veterinary administration.",
      "Quality in this field is expressed through documentation: an RP-HPLC purity figure, mass-spectrometry identity confirmation, and a batch-specific Certificate of Analysis. If a supplier cannot produce these documents, the material's identity is effectively unknown.",
    ],
  },
  {
    slug: "how-to-read-a-coa",
    title: "How to Read a Certificate of Analysis",
    category: "COA Guide", minutes: 8,
    summary: "A field guide to the document that separates characterized material from unknown powder.",
    diagram: "coa-anatomy",
    body: [
      "A Certificate of Analysis (COA) is a batch-specific document summarizing the analytical testing performed on a specific production lot. It is the single most important quality document in research-material supply, because it connects a physical vial — via its batch number — to measured data.",
      "Start with identity fields: product name, catalogue number and batch number. The batch number on the COA must match the batch number printed on your vial. A COA without a batch number, or one that doesn't match the product in hand, documents nothing.",
      "The purity section usually reports a chromatographic result — most often reversed-phase HPLC (RP-HPLC) expressed as area-percent at a stated wavelength. A figure like '98.6% (RP-HPLC, 220 nm)' means that 98.6% of the UV-absorbing material in the injection eluted as the main peak.",
      "The identity section reports how the laboratory confirmed the molecule is what the label claims — typically mass spectrometry (ESI-MS or MALDI-TOF), where the observed mass is compared with the theoretical mass of the sequence. Small deviations within instrument tolerance are normal; the COA should state both values.",
      "Finally, check the test date, the issuing laboratory and any signature or document control number. Reputable suppliers keep released COAs consistent with a public verification system, so a batch number can be checked independently of the paper that shipped in the box.",
    ],
  },
  {
    slug: "understanding-hplc",
    title: "Understanding HPLC Purity Testing",
    category: "Laboratory Testing", minutes: 7,
    summary: "How reversed-phase chromatography produces the purity number on every peptide COA.",
    diagram: "chromatogram",
    body: [
      "High-performance liquid chromatography (HPLC) separates the components of a mixture by pushing it, under pressure, through a column packed with fine particles. Components interact with the column material to different degrees and therefore emerge — elute — at different times.",
      "For peptides, the standard technique is reversed-phase HPLC: a hydrophobic column and a water/acetonitrile gradient. More hydrophobic species stick longer. A UV detector at the column outlet records absorbance over time, producing a chromatogram: a plot of peaks, each corresponding to a distinct component.",
      "Purity is calculated as area-percent: the area of the main peak divided by the total area of all peaks. A '≥ 98%' specification means impurities — deletion sequences, oxidation products, residual scavengers — together account for no more than 2% of detected material.",
      "Area-percent purity is a comparative measure at a specific wavelength; it is not an absolute mass measure and it cannot detect components that don't absorb UV, such as water, salts or counter-ions. That is why serious documentation pairs HPLC purity with mass-spectrometry identity, and sometimes with water-content or counter-ion analysis.",
    ],
  },
  {
    slug: "understanding-mass-spectrometry",
    title: "Understanding Mass Spectrometry",
    category: "Laboratory Testing", minutes: 6,
    summary: "Why an observed mass is the strongest routine identity check for a synthetic peptide.",
    diagram: "mass-spec",
    body: [
      "Mass spectrometry (MS) measures the mass-to-charge ratio of ionized molecules. For peptide identity work, the question it answers is simple: does the measured molecular mass match the theoretical mass calculated from the intended amino-acid sequence?",
      "Electrospray ionization (ESI-MS) is the most common approach for peptides. The sample is sprayed through a charged needle, producing multiply-charged ions whose spectrum can be deconvoluted into a single molecular mass, usually accurate to well under one dalton for research purposes.",
      "A matching mass is strong evidence of identity because most synthesis errors change the mass: a missing residue, an incomplete deprotection or an oxidation each shifts the total by a characteristic amount. MS therefore catches exactly the failure modes that peptide synthesis is prone to.",
      "MS complements, rather than replaces, HPLC: chromatography quantifies how much of the material is the main component, while MS confirms what the main component is. Together they form the minimum credible analytical package for a research peptide batch.",
    ],
  },
  {
    slug: "peptide-stability-and-storage",
    title: "Peptide Stability, Storage & Handling",
    category: "Peptide Fundamentals", minutes: 7,
    summary: "What degrades peptides, and the storage practices that protect research material.",
    body: [
      "Peptides are stable molecules when handled correctly, but several mechanisms degrade them over time: hydrolysis of the peptide backbone, oxidation of methionine, cysteine and tryptophan residues, deamidation of asparagine and glutamine, and aggregation.",
      "Lyophilized (freeze-dried) peptides are far more stable than solutions. In lyophilized form, stored at −20 °C, desiccated and protected from light, most peptides retain specification for 24 months or longer. Repeated warming to room temperature and re-cooling introduces condensation — a major driver of hydrolysis — so vials should be brought to temperature once, briefly, before opening.",
      "Reconstituted solutions are much less stable and are typically stored refrigerated for short periods only, with degradation strongly dependent on the sequence, the solvent system, pH and container. Research protocols generally minimize hold times for solutions.",
      "Light and oxygen exposure both accelerate oxidation. Amber storage, minimal headspace and inert-gas purging are standard mitigations in laboratory practice for sensitive sequences.",
    ],
  },
  {
    slug: "research-vs-therapeutic-use",
    title: "Research vs Therapeutic Use",
    category: "Research Use Only", minutes: 5,
    summary: "The regulatory and practical line between laboratory materials and medicines.",
    body: [
      "The same molecule can exist as a research material and, separately, as an approved medicine — but the two are not interchangeable, and the difference is not marketing language. It is the entire pharmaceutical development process.",
      "A medicine is manufactured under full GMP for human use, formulated for a route of administration, validated for sterility and endotoxin limits, stability-tested in its final container, and reviewed by a regulator on the basis of clinical trial evidence. A research material is characterized for identity and purity so that laboratory results are interpretable — a fundamentally different and narrower purpose.",
      "This is why research suppliers state that products are not for human or veterinary use, and why credible suppliers refuse orders that indicate otherwise. The research-use-only framework protects buyers, sellers and the integrity of the research itself.",
      "Researchers working with any compound class studied in clinical programmes should rely on the peer-reviewed literature and regulatory publications for clinical information, and treat supplier catalogues as what they are: descriptions of laboratory reference materials.",
    ],
  },
  {
    slug: "how-research-compounds-are-classified",
    title: "How Research Compounds Are Classified",
    category: "Compound Directory", minutes: 6,
    summary: "Peptides, blends, proteins, small molecules — how a serious catalogue is organized.",
    body: [
      "Not everything sold alongside peptides is a peptide. A well-organized research catalogue distinguishes compound types honestly, because the type determines how a material is characterized, stored and used in the laboratory.",
      "Peptides are single defined sequences up to roughly 50 residues, characterized by HPLC and MS. Peptide blends are fixed combinations of two or more peptides in one vial — each component needs its own identity confirmation. Proteins and protein fragments, such as growth factors, are larger molecules where folding and activity matter alongside sequence.",
      "Small molecules — such as NNMT inhibitors or redox dyes — are classical organic compounds characterized by different analytical techniques. Coenzymes and vitamins are biological cofactors that appear in cellular-metabolism research. Each type carries different stability profiles and different documentation expectations.",
      "When a catalogue labels everything 'peptide', it usually signals that the seller has never characterized anything. Type-accurate classification is a quiet but reliable quality signal.",
    ],
  },
  {
    slug: "research-terminology",
    title: "Research Terminology Glossary",
    category: "Research Terminology", minutes: 9,
    summary: "The vocabulary of peptide research — from agonist to lyophilization.",
    body: [
      "Agonist: a molecule that binds a receptor and activates it. A dual or triple agonist activates two or three receptor types — for example, GIP/GLP-1 dual agonists in incretin research.",
      "Analogue: a modified version of a natural molecule, altered to change stability, receptor selectivity or half-life while preserving core activity.",
      "Batch (lot): a quantity of material produced in one manufacturing run, sharing a batch number and one set of analytical results.",
      "Bacteriostatic water: water for laboratory use containing 0.9% benzyl alcohol to suppress bacterial growth. Referenced in research contexts as a reconstitution vehicle.",
      "COA: Certificate of Analysis — the batch-specific document reporting analytical results. See our full COA guide.",
      "GHRH / secretagogue: growth-hormone-releasing hormone and molecules that stimulate hormone secretion, central to growth-hormone-axis research.",
      "Lyophilization: freeze-drying — removing water from a frozen solution under vacuum, producing a stable powder cake.",
      "Receptor pharmacology: the study of how molecules bind and activate receptors — affinity, selectivity, signaling bias and kinetics.",
      "RP-HPLC: reversed-phase high-performance liquid chromatography, the standard purity assay for peptides.",
      "RUO: Research Use Only — the supply framework under which laboratory materials are sold.",
    ],
  },
  {
    slug: "reconstitution-math-for-research-use",
    title: "Reconstitution Math for Research Use",
    category: "Peptide Fundamentals", minutes: 5,
    diagram: "dilution",
    summary: "The arithmetic behind turning a lyophilized vial into a working solution — laboratory math, not a dosing guide.",
    body: [
      "Reconstitution is arithmetic, not judgment: a known mass of lyophilized peptide, dissolved in a known volume of diluent, produces a known concentration. Everything downstream in a research protocol depends on getting this one calculation right.",
      "The core relationship is concentration = mass ÷ volume. A 10 mg vial reconstituted with 2 mL of diluent produces a 5 mg/mL solution — 10 divided by 2. Add more diluent and the concentration drops; add less and it rises, in strict inverse proportion.",
      "The reverse calculation is just as common: given a vial's mass and a target concentration, the required diluent volume is mass ÷ target concentration. A 10 mg vial targeting 5 mg/mL needs 2 mL of diluent — the same relationship, solved for the other variable.",
      "This is laboratory arithmetic for research use only. It does not recommend, calculate, or imply any dose, protocol, or administration route for humans or animals — see our Reconstitution Calculator for a working version of this same math.",
    ],
  },
  {
    slug: "understanding-evidence-levels",
    title: "Understanding Evidence Levels in Peptide Research",
    category: "Research Terminology", minutes: 6,
    diagram: "evidence-level",
    summary: "How to read the evidence-strength badge shown against every research application on this site.",
    body: [
      "Not all published research carries the same weight, and a serious catalogue says so plainly rather than treating every citation as equally strong. This site uses one consistent five-level scale, applied to a specific compound-application pair — never to a compound in general.",
      "Established means the effect is well-replicated across independent studies for that specific application. Clinical means human trial data exists, even if limited in scale or not yet leading to approval. Investigational means early-phase human data exists but the picture is incomplete.",
      "Preclinical means the evidence comes from animal or cell-culture models — informative for research design, but not yet tested in humans for that application. Limited means the available evidence is thin, mixed, or drawn from a narrow set of sources, and is labeled that way rather than dressed up.",
      "A compound can sit at different levels for different applications simultaneously — strong evidence for one mechanism and thin evidence for another is normal, not a contradiction. Reading the level next to the specific application, not just the compound name, is the whole point of the system.",
    ],
  },
  {
    slug: "peptide-bioregulators",
    title: "Peptide Bioregulators: Origins and Evidence Context",
    category: "Compound Directory", minutes: 6,
    diagram: "bioregulator-class",
    summary: "A distinct research lineage — six catalogue compounds, and an honest account of where the literature comes from.",
    body: [
      "Peptide bioregulators are a class of short synthetic peptides originally developed through a specific line of Russian gerontology research, studied for tissue-specific regulatory effects in preclinical models. Epitalon, Pinealon, Cartalax, Chonluten, Cortagen and Pancregen all belong to this class.",
      "Each compound in the class is associated with a particular tissue or organ system in the originating research program — the naming generally reflects that focus rather than a mechanism confirmed by independent replication.",
      "The evidence base for this class is concentrated in a comparatively small number of research groups and publications, most originating from the same laboratories that developed the compounds. Independent, Western-language replication is limited relative to better-studied compound classes on this site.",
      "That concentration of sourcing doesn't mean the research doesn't exist — it means readers should weight it accordingly. Treat this class the way the evidence-level system treats anything labeled preclinical or limited: as a starting point for further reading, not as a settled result.",
    ],
  },
]

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug)
