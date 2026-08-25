export default function ShopProductLoading() {
  return (
    <>
      <div className="container breadcrumb">
        <span className="skel" style={{ display: "inline-block", height: 14, width: 220 }} />
      </div>

      <section className="section tight">
        <div className="container split">
          <div
            className="skel vial-stage"
            style={{
              minHeight: 520, borderRadius: 20,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="skel" style={{ height: 40, width: "80%" }} />
            <div className="skel" style={{ height: 16, width: "100%" }} />
            <div className="skel" style={{ height: 16, width: "70%" }} />
            <div className="card" style={{ padding: 22 }}>
              <div className="skel" style={{ height: 44, width: "100%", marginBottom: 14 }} />
              <div className="skel" style={{ height: 48, width: "100%" }} />
            </div>
            <div className="skel" style={{ height: 48, width: "100%" }} />
          </div>
        </div>
      </section>
    </>
  )
}
