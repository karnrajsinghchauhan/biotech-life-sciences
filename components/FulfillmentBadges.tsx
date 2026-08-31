import { site } from "@/lib/config"

export default function FulfillmentBadges() {
  return (
    <div className="fulfillment-badges" role="list" aria-label="Fulfillment details">
      <span role="listitem" className="fulfillment-badge">
        <span className="fulfillment-badge-dot" aria-hidden="true" />
        Free bacteriostatic water vial included
      </span>
      <span role="listitem" className="fulfillment-badge">
        <span className="fulfillment-badge-dot" aria-hidden="true" />
        48-hour dispatch guarantee
      </span>
      <span role="listitem" className="fulfillment-badge-item">
        <a className="fulfillment-badge fulfillment-badge-link" href={`${site.url}/account/orders`}>
          <span className="fulfillment-badge-dot" aria-hidden="true" />
          Track your order
        </a>
      </span>
    </div>
  )
}
