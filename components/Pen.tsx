// Studio-style pre-filled pen render, matching Vial.tsx's lighting, glass/
// metal tone and label system (dark body, brushed steel cap, black label)
// so pen SKUs read as part of the same photographed catalogue rather than
// a mismatched asset.

export default function Pen({ code, name, size = 150 }: { code?: string; name: string; size?: number }) {
  const label = code || name.split(/[\s(]/)[0].toUpperCase().slice(0, 7)
  const w = size
  const h = size * 1.9
  const uid = `pen-${(code || name).replace(/[^a-zA-Z0-9]/g, "")}`

  return (
    <svg className="vial" width={w} height={h} viewBox="0 0 100 190" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label={`${name} pen`}>
      <defs>
        <radialGradient id={`key-${uid}`} cx="38%" cy="10%" r="75%">
          <stop offset="0" stopColor="#e9edf3" />
          <stop offset="0.4" stopColor="#7d879a" />
          <stop offset="1" stopColor="#12151a" />
        </radialGradient>
        <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0a0b0d" />
          <stop offset="0.16" stopColor="#3a3d42" />
          <stop offset="0.34" stopColor="#101113" />
          <stop offset="0.5" stopColor="#26282d" />
          <stop offset="0.68" stopColor="#0d0e10" />
          <stop offset="0.86" stopColor="#4a4d52" />
          <stop offset="1" stopColor="#050506" />
        </linearGradient>
        <linearGradient id={`cap-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#dfe3ea" />
          <stop offset="0.5" stopColor="#f5f7fa" />
          <stop offset="1" stopColor="#9aa2b0" />
        </linearGradient>
      </defs>

      {/* soft ambient key light behind the pen */}
      <ellipse cx="50" cy="26" rx="44" ry="36" fill={`url(#key-${uid})`} opacity="0.32" />

      {/* dial / injector cap */}
      <rect x="38" y="4" width="24" height="16" rx="3" fill={`url(#cap-${uid})`} />
      <rect x="35" y="18" width="30" height="8" rx="2" fill={`url(#cap-${uid})`} opacity="0.85" />
      <line x1="42" y1="8" x2="58" y2="8" stroke="#7d879a" strokeWidth="0.6" opacity="0.6" />
      <line x1="42" y1="12" x2="58" y2="12" stroke="#7d879a" strokeWidth="0.6" opacity="0.6" />

      {/* pen body — straight cylinder, no vial shoulders */}
      <rect x="30" y="26" width="40" height="152" rx="12" fill={`url(#body-${uid})`} stroke="#4a5064" strokeWidth="0.6" />

      {/* dose window near the cap */}
      <rect x="40" y="34" width="20" height="10" rx="2" fill="#050506" stroke="#4a5064" strokeWidth="0.4" />
      <text x="50" y="41.5" textAnchor="middle" fontSize="5" fill="#9fe8d5" fontFamily="monospace" opacity="0.85">READY</text>

      {/* label */}
      <rect x="32" y="58" width="36" height="80" rx="2.5" fill="#0a0b0d" stroke="#2a2d33" strokeWidth="0.5" />
      <text x="50" y="72" textAnchor="middle" fontSize="5.6" fill="#ffffff" fontWeight="600" fontFamily="Inter, sans-serif" opacity="0.9">Biotech</text>
      <text x="50" y="78.5" textAnchor="middle" fontSize="4.1" fill="#ffffff" fontFamily="Inter, sans-serif" opacity="0.55">Life Sciences</text>
      <line x1="37" y1="86" x2="63" y2="86" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
      <text x="50" y="102" textAnchor="middle" fontSize={label.length > 6 ? 7.5 : 10} fill="#ffffff" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="0.3">{label}</text>
      <line x1="37" y1="108" x2="63" y2="108" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
      <text x="50" y="115" textAnchor="middle" fontSize="3.6" fill="#ffffff" fontFamily="Inter, sans-serif" opacity="0.5">{name.length > 22 ? name.slice(0, 22) + "…" : name}</text>
      <text x="50" y="128" textAnchor="middle" fontSize="3.4" fill="#9fe8d5" fontFamily="monospace" opacity="0.6" letterSpacing="0.08em">PRE-FILLED PEN</text>

      {/* specular highlights */}
      <rect x="37" y="30" width="3" height="146" rx="1.5" fill="#ffffff" opacity="0.45" />
      <rect x="62" y="34" width="1.8" height="138" rx="0.9" fill="#ffffff" opacity="0.2" />
      <ellipse cx="50" cy="10" rx="9" ry="3" fill="#ffffff" opacity="0.4" />
    </svg>
  )
}
