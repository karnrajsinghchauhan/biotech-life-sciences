// Studio-style vial render for the ~85% of the catalogue without real
// product photography. Matches the lighting, glass tone and label system of
// the 8 photographed vials (dark amber glass, brushed steel cap, black
// label) so the catalogue reads as one consistent shoot rather than a mix
// of photos and flat placeholder art.

export default function Vial({ code, name, size = 150 }: { code?: string; name: string; size?: number }) {
  const label = code || name.split(/[\s(]/)[0].toUpperCase().slice(0, 7)
  const w = size
  const h = size * 1.9
  const uid = (code || name).replace(/[^a-zA-Z0-9]/g, "")

  return (
    <svg className="vial" width={w} height={h} viewBox="0 0 100 190" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label={`${name} vial`}>
      <defs>
        <radialGradient id={`key-${uid}`} cx="38%" cy="12%" r="75%">
          <stop offset="0" stopColor="#e9edf3" />
          <stop offset="0.4" stopColor="#7d879a" />
          <stop offset="1" stopColor="#12151a" />
        </radialGradient>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#05060a" />
          <stop offset="0.14" stopColor="#3a4152" />
          <stop offset="0.32" stopColor="#0c0e13" />
          <stop offset="0.5" stopColor="#22262f" />
          <stop offset="0.68" stopColor="#0a0c10" />
          <stop offset="0.86" stopColor="#454c5e" />
          <stop offset="1" stopColor="#020304" />
        </linearGradient>
        <linearGradient id={`cap-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a3d42" />
          <stop offset="0.5" stopColor="#101113" />
          <stop offset="1" stopColor="#050506" />
        </linearGradient>
        <linearGradient id={`band-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#dfe3ea" />
          <stop offset="0.5" stopColor="#f5f7fa" />
          <stop offset="1" stopColor="#9aa2b0" />
        </linearGradient>
      </defs>

      {/* soft ambient key light behind the vial */}
      <ellipse cx="50" cy="30" rx="46" ry="40" fill={`url(#key-${uid})`} opacity="0.35" />

      {/* cap */}
      <rect x="34" y="4" width="32" height="20" rx="4" fill={`url(#cap-${uid})`} />
      <rect x="32" y="22" width="36" height="7" rx="2" fill={`url(#band-${uid})`} />

      {/* neck + body */}
      <path
        d="M37 29 h26 v9 c5 4 8 8 8 14 v112 c0 7-5 12-12 12 H41 c-7 0-12-5-12-12 V52 c0-6 3-10 8-14 z"
        fill={`url(#glass-${uid})`}
        stroke="#4a5064"
        strokeWidth="0.6"
      />

      {/* label */}
      <rect x="30" y="70" width="40" height="58" rx="2.5" fill="#0a0b0d" stroke="#2a2d33" strokeWidth="0.5" />
      <text x="50" y="85" textAnchor="middle" fontSize="6" fill="#ffffff" fontWeight="600" fontFamily="Inter, sans-serif" opacity="0.9">Biotech</text>
      <text x="50" y="92" textAnchor="middle" fontSize="4.4" fill="#ffffff" fontFamily="Inter, sans-serif" opacity="0.55">Life Sciences</text>
      <text x="50" y="108" textAnchor="middle" fontSize={label.length > 6 ? 8.5 : 11} fill="#ffffff" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="0.4">{label}</text>
      <line x1="35" y1="113" x2="65" y2="113" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
      <text x="50" y="121" textAnchor="middle" fontSize="4" fill="#ffffff" fontFamily="Inter, sans-serif" opacity="0.5">{name.length > 22 ? name.slice(0, 22) + "…" : name}</text>

      {/* specular highlights — the detail that reads as "glass" rather than flat vector */}
      <rect x="39" y="46" width="3.4" height="128" rx="1.7" fill="#ffffff" opacity="0.5" />
      <rect x="60" y="50" width="2" height="118" rx="1" fill="#ffffff" opacity="0.22" />
      <ellipse cx="50" cy="12" rx="10" ry="3.5" fill="#ffffff" opacity="0.35" />
    </svg>
  )
}
