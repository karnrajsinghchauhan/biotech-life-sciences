import type { Product } from "@/lib/data"

export default function SpecTable({ product }: { product: Product }) {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--line)", fontWeight: 650, fontSize: 14.5 }}>
        Specifications
      </div>
      <table className="spec-table">
        <tbody>
          <tr><td>Product</td><td>{product.name}</td></tr>
          <tr><td>SKU</td><td className="mono">{product.sku}</td></tr>
          {product.code && <tr><td>Vial code</td><td className="mono">{product.code}</td></tr>}
          <tr><td>Compound type</td><td>{product.compoundType}</td></tr>
          {product.purity && <tr><td>Purity</td><td>{product.purity}</td></tr>}
          <tr><td>Form</td><td>{product.form}</td></tr>
          <tr><td>Storage</td><td>{product.storage}</td></tr>
          {product.stability && <tr><td>Stability</td><td>{product.stability}</td></tr>}
          {product.solubility && <tr><td>Solubility</td><td>{product.solubility}</td></tr>}
          <tr><td>Sizes</td><td>{product.sizes.map((s) => s.label).join(" · ")}</td></tr>
          <tr><td>Grade</td><td>Research grade — RUO</td></tr>
        </tbody>
      </table>
    </div>
  )
}
