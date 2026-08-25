"use client"

import { useMemo, useState } from "react"
import { site } from "@/lib/config"

type Mode = "concentration" | "volume"

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "14px 16px", borderRadius: 12,
  border: "1px solid var(--line-strong)", background: "var(--surface)",
  color: "var(--ink)", outline: "none", fontSize: 15,
}

function parsePositive(v: string): number | null {
  const n = Number(v)
  return v.trim() !== "" && Number.isFinite(n) && n > 0 ? n : null
}

export default function ReconstitutionCalculator() {
  const [mode, setMode] = useState<Mode>("concentration")

  // mode: concentration
  const [mgA, setMgA] = useState("")
  const [mlA, setMlA] = useState("")

  // mode: volume
  const [mgB, setMgB] = useState("")
  const [targetB, setTargetB] = useState("")

  const concentration = useMemo(() => {
    const mg = parsePositive(mgA)
    const ml = parsePositive(mlA)
    if (!mg || !ml) return null
    return { mgPerMl: mg / ml, mcgPerMl: (mg / ml) * 1000 }
  }, [mgA, mlA])

  const volume = useMemo(() => {
    const mg = parsePositive(mgB)
    const target = parsePositive(targetB)
    if (!mg || !target) return null
    return { ml: mg / target }
  }, [mgB, targetB])

  return (
    <div>
      <div className="calc-tabs" role="tablist" aria-label="Calculator mode">
        <button
          type="button" role="tab" aria-selected={mode === "concentration"}
          className={`calc-tab ${mode === "concentration" ? "active" : ""}`}
          onClick={() => setMode("concentration")}
        >
          Find concentration
        </button>
        <button
          type="button" role="tab" aria-selected={mode === "volume"}
          className={`calc-tab ${mode === "volume" ? "active" : ""}`}
          onClick={() => setMode("volume")}
        >
          Find diluent volume
        </button>
      </div>

      <div className="card" style={{ padding: 28, marginTop: 18 }}>
        {mode === "concentration" ? (
          <>
            <p className="small" style={{ marginBottom: 18 }}>
              Enter the peptide mass in the vial and the diluent volume added, to calculate the
              resulting solution concentration.
            </p>
            <div className="calc-grid">
              <label className="calc-field">
                <span>Peptide in vial (mg)</span>
                <input inputMode="decimal" style={inputStyle} value={mgA} onChange={(e) => setMgA(e.target.value)} placeholder="e.g. 10" />
              </label>
              <label className="calc-field">
                <span>Diluent added (mL)</span>
                <input inputMode="decimal" style={inputStyle} value={mlA} onChange={(e) => setMlA(e.target.value)} placeholder="e.g. 2" />
              </label>
            </div>
            <div className="calc-result">
              {concentration ? (
                <>
                  <div><b>{concentration.mgPerMl.toFixed(3)}</b><span>mg / mL</span></div>
                  <div><b>{concentration.mcgPerMl.toFixed(1)}</b><span>mcg / mL</span></div>
                </>
              ) : (
                <p className="small" style={{ margin: 0 }}>Enter both values to see the resulting concentration.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="small" style={{ marginBottom: 18 }}>
              Enter the peptide mass in the vial and a target concentration, to calculate the diluent
              volume that produces it.
            </p>
            <div className="calc-grid">
              <label className="calc-field">
                <span>Peptide in vial (mg)</span>
                <input inputMode="decimal" style={inputStyle} value={mgB} onChange={(e) => setMgB(e.target.value)} placeholder="e.g. 10" />
              </label>
              <label className="calc-field">
                <span>Target concentration (mg/mL)</span>
                <input inputMode="decimal" style={inputStyle} value={targetB} onChange={(e) => setTargetB(e.target.value)} placeholder="e.g. 5" />
              </label>
            </div>
            <div className="calc-result">
              {volume ? (
                <div><b>{volume.ml.toFixed(3)}</b><span>mL of diluent</span></div>
              ) : (
                <p className="small" style={{ margin: 0 }}>Enter both values to see the diluent volume.</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="notice" style={{ marginTop: 20 }}>
        This tool performs basic dilution arithmetic for laboratory research use only. It does not
        recommend, calculate, or imply any dose, protocol, or administration route for humans or
        animals. {site.disclaimer}
      </div>
    </div>
  )
}
