import type { ComponentType } from "react"
import PeptideChainDiagram from "./PeptideChainDiagram"
import ChromatogramDiagram from "./ChromatogramDiagram"
import MassSpecDiagram from "./MassSpecDiagram"
import CoaAnatomyDiagram from "./CoaAnatomyDiagram"
import DilutionDiagram from "./DilutionDiagram"
import EvidenceLevelDiagram from "./EvidenceLevelDiagram"
import BioregulatorClassDiagram from "./BioregulatorClassDiagram"

export type DiagramKey =
  | "peptide-chain" | "chromatogram" | "mass-spec" | "coa-anatomy"
  | "dilution" | "evidence-level" | "bioregulator-class"

export const DIAGRAM_COMPONENTS: Record<DiagramKey, ComponentType> = {
  "peptide-chain": PeptideChainDiagram,
  "chromatogram": ChromatogramDiagram,
  "mass-spec": MassSpecDiagram,
  "coa-anatomy": CoaAnatomyDiagram,
  "dilution": DilutionDiagram,
  "evidence-level": EvidenceLevelDiagram,
  "bioregulator-class": BioregulatorClassDiagram,
}
