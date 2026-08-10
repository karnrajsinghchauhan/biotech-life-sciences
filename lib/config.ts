// ============================================================
// SITE CONFIGURATION — edit this file to update company info,
// payment settings, currencies and shipping without touching code.
// ============================================================

export const site = {
  name: "Biotech Life Sciences",
  tagline: "Premium Research Peptides",
  domain: "biotechlifesciences.uk",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://biotechlifesciences.uk",
  email: "info@biotechlifesciences.uk",
  phone: "+44 7529 563762",
  location: "Oxford, United Kingdom",
  founded: 2000,
  hours: "Monday – Friday, 9:00 AM – 6:00 PM (GMT)",
  // Statement used across the site. Keep consistent with printed materials.
  disclaimer:
    "For laboratory research use only. Products are not intended for human or veterinary consumption, diagnosis, treatment, or prevention of disease.",
}

// ---- Regions & currency ------------------------------------
// Rates are DISPLAY-ONLY placeholders — set your own before launch.
export type Region = "IN" | "UK" | "US" | "INTL"

export const regions: { code: Region; label: string; currency: string; symbol: string; rate: number }[] = [
  { code: "IN", label: "India", currency: "INR", symbol: "₹", rate: 1 },
  { code: "UK", label: "United Kingdom", currency: "GBP", symbol: "£", rate: 0.0095 },
  { code: "US", label: "United States", currency: "USD", symbol: "$", rate: 0.012 },
  { code: "INTL", label: "International", currency: "USD", symbol: "$", rate: 0.012 },
]

// ---- Payments ----------------------------------------------
// Only methods with enabled:true are shown at checkout.
// UPI: replace `vpa` and `payee` with your real UPI ID before launch.
// Cards/NetBanking: connect a gateway (e.g. Razorpay) and set enabled:true.
export const payments = {
  upi: {
    enabled: true,
    vpa: "CONFIGURE-YOUR-VPA@upi", // <-- REPLACE with your UPI ID
    payee: "Biotech Life Sciences",
    note: "Order payment",
  },
  bankTransfer: {
    enabled: true,
    details: "Bank transfer details are shared with your order confirmation email.",
  },
  cards: { enabled: false, gateway: "razorpay", keyId: "" }, // set keyId + enabled when gateway is live
  netBanking: { enabled: false },
  internationalCards: { enabled: false },
}

// ---- Shipping ----------------------------------------------
// All values are configurable placeholders — confirm before launch.
export const shipping = {
  freeAbove: 15000, // INR
  flatRate: 450, // INR
  dispatchNote: "Orders are dispatched after payment confirmation. Dispatch and delivery estimates are confirmed with your order confirmation.",
  international: true,
}
