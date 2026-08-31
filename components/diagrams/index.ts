import type { ComponentType } from "react"
import PeptideChainDiagram from "./PeptideChainDiagram"
import ChromatogramDiagram from "./ChromatogramDiagram"
import MassSpecDiagram from "./MassSpecDiagram"
import CoaAnatomyDiagram from "./CoaAnatomyDiagram"
import DilutionDiagram from "./DilutionDiagram"
import EvidenceLevelDiagram from "./EvidenceLevelDiagram"
import BioregulatorClassDiagram from "./BioregulatorClassDiagram"

export const DIAGRAM_COMPONENTS: Record<string, ComponentType> = {
  "peptide-chain": PeptideChainDiagram,
  "chromatogram": ChromatogramDiagram,
  "mass-spec": MassSpecDiagram,
  "coa-anatomy": CoaAnatomyDiagram,
  "dilution": DilutionDiagram,
  "evidence-level": EvidenceLevelDiagram,
  "bioregulator-class": BioregulatorClassDiagram,
}
