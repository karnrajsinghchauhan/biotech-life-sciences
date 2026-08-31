import type { ReactNode } from "react"

export default function DiagramFrame({
  title,
  caption,
  children,
}: {
  title: string
  caption: string
  children: ReactNode
}) {
  return (
    <figure className="diagram-frame">
      <span className="diagram-frame-label">{title}</span>
      <div className="diagram-frame-body">{children}</div>
      <figcaption className="diagram-frame-caption">{caption}</figcaption>
    </figure>
  )
}
