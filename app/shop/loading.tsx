export default function ShopLoading() {
  return (
    <>
      <section className="section tight alt">
        <div className="container">
          <span className="eyebrow">Storefront</span>
          <h1 className="h-section">Shop</h1>
          <p className="lede">
            Products, stock and pricing are managed in Shopify. Checkout and payments are handled
            securely by Shopify Checkout.
          </p>
        </div>
      </section>
      <section className="section tight">
        <div className="container">
          <div className="grid-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skel-card">
                <div className="skel skel-media" />
                <div style={{ padding: 18 }}>
                  <div className="skel" style={{ height: 16, width: "70%", marginBottom: 10 }} />
                  <div className="skel" style={{ height: 12, width: "95%", marginBottom: 6 }} />
                  <div className="skel" style={{ height: 12, width: "60%", marginBottom: 16 }} />
                  <div className="skel" style={{ height: 36, width: "100%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
