// Premium vial render — consistent product imagery across the catalogue.
// Replace with real photography by dropping images into /public/products/<slug>.png
// (the ProductCard/product page will prefer a real image if present later).

export default function Vial({ code, name, size = 150 }: { code?: string; name: string; size?: number }) {
  const label = code || name.split(/[\s(]/)[0].toUpperCase().slice(0, 7)
  const w = size
  const h = size * 1.55
  return (
    <svg className="vial" width={w} height={h} viewBox="0 0 100 155" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label={`${name} vial`}>
      <defs>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#dfe8f2" />
          <stop offset="0.18" stopColor="#f8fbff" />
          <stop offset="0.5" stopColor="#e9f0f8" />
          <stop offset="0.82" stopColor="#f8fbff" />
          <stop offset="1" stopColor="#d7e2ee" />
        </linearGradient>
        <linearGradient id="cap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#12315c" />
          <stop offset="0.5" stopColor="#0b1f3a" />
          <stop offset="1" stopColor="#0a1a30" />
        </linearGradient>
        <linearGradient id="band" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b9c7d9" />
          <stop offset="0.5" stopColor="#eef3f9" />
          <stop offset="1" stopColor="#a9b9cd" />
        </linearGradient>
      </defs>
      {/* cap */}
      <rect x="30" y="4" width="40" height="18" rx="4" fill="url(#cap)" />
      <rect x="28" y="20" width="44" height="8" rx="2" fill="url(#band)" />
      {/* neck + body */}
      <path d="M33 28 h34 v10 c4 3 6 6 6 11 v92 c0 6-4 10-10 10 H37 c-6 0-10-4-10-10 V49 c0-5 2-8 6-11 z" fill="url(#glass)" stroke="#c3d0e0" strokeWidth="1" />
      {/* liquid hint */}
      <path d="M30 118 h40 v23 c0 4-3 7-7 7 H37 c-4 0-7-3-7-7 z" fill="#dbe7f5" opacity="0.85" />
      {/* label */}
      <rect x="27" y="58" width="46" height="52" rx="3" fill="#0b1f3a" />
      <text x="50" y="72" textAnchor="middle" fontSize="6.2" fill="#ffffff" fontWeight="600" fontFamily="Inter, sans-serif" opacity="0.85">Biotech</text>
      <text x="50" y="79" textAnchor="middle" fontSize="4.6" fill="#ffffff" fontFamily="Inter, sans-serif" opacity="0.6">Life Sciences</text>
      <text x="50" y="94" textAnchor="middle" fontSize={label.length > 5 ? 9 : 12} fill="#ffffff" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="0.5">{label}</text>
      <line x1="34" y1="99" x2="66" y2="99" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
      <text x="50" y="105.5" textAnchor="middle" fontSize="4.2" fill="#ffffff" fontFamily="Inter, sans-serif" opacity="0.6">{name.length > 24 ? name.slice(0, 24) + "…" : name}</text>
      {/* reflections */}
      <rect x="31" y="42" width="4" height="100" rx="2" fill="#ffffff" opacity="0.55" />
      <rect x="63" y="46" width="2.5" height="94" rx="1.2" fill="#ffffff" opacity="0.35" />
    </svg>
  )
}
