import { DIAGRAM_COMPONENTS, type DiagramKey } from "./index"

export default function ArticleDiagram({ diagram }: { diagram?: DiagramKey }) {
  if (!diagram) return null
  const Diagram = DIAGRAM_COMPONENTS[diagram]
  return Diagram ? <Diagram /> : null
}
