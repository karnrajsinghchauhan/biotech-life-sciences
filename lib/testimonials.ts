// ============================================================
// CUSTOMER TESTIMONIALS
//
// THIS FILE SHIPS EMPTY ON PURPOSE. DO NOT POPULATE IT WITH
// INVENTED PEOPLE, STOCK PHOTOGRAPHS, OR QUOTES GATHERED FROM
// FORUMS, REDDIT OR SOCIAL MEDIA.
//
// A testimonial may only be added here when Biotech Life Sciences
// holds the customer's own words and their permission to publish.
// While this array is empty the site renders clearly-labelled
// placeholder cards saying testimonials are pending verification —
// which is honest, and costs far less trust than a fake quote does.
//
// HOW TO ADD A REAL ONE
//  1. Obtain the quote in writing from the customer, plus explicit
//     permission to publish it.
//  2. Set `verified: true` ONLY when you have matched the person to a
//     real order. The "Verified Customer" badge renders off this flag.
//  3. `name` may be withheld — set it to null and the card displays
//     "Verified Customer — Name withheld". Never substitute an invented
//     name to fill the space.
//  4. `avatar` is optional and must be a photograph the customer
//     supplied. Never use a stock headshot to represent a real person.
// ============================================================

export type Testimonial = {
  /** The customer's own words, verbatim. Never paraphrased into marketing copy. */
  quote: string
  /** Null renders as "Name withheld" — the correct choice when the
   *  customer wants anonymity. Never fill this with an invented name. */
  name: string | null
  /** Optional, e.g. "Research laboratory, Manchester". Omit if unverified. */
  location?: string
  /** Optional, e.g. "Analytical reference standards". Omit if unverified. */
  useCase?: string
  /** True ONLY when matched to a real order by Biotech Life Sciences. */
  verified: boolean
  /** Optional customer-supplied photograph. Never a stock image. */
  avatar?: string
  /** ISO date the testimonial was given. */
  date?: string
}

export const testimonials: Testimonial[] = [
  // Intentionally empty — see the header of this file before adding anything.
]

/** How many placeholder cards to render while `testimonials` is empty. */
export const PLACEHOLDER_COUNT = 3
