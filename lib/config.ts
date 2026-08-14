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

// ---- Shipping ----------------------------------------------
// All values are configurable placeholders — confirm before launch.
export const shipping = {
  freeAbove: 15000, // INR
  flatRate: 450, // INR
  dispatchNote: "Orders are dispatched after payment confirmation. Dispatch and delivery estimates are confirmed with your order confirmation.",
  international: true,
}
