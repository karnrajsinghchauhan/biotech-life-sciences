// ============================================================
// SUPABASE ACCESS
//
// The site is designed to run WITHOUT Supabase configured — every
// call degrades gracefully so the front end never breaks while the
// backend is being provisioned. `isSupabaseConfigured()` is the
// single switch the API routes check.
//
// SECURITY
//  · NEXT_PUBLIC_SUPABASE_ANON_KEY is safe in the browser. It is
//    only ever as powerful as your Row Level Security policies.
//  · SUPABASE_SERVICE_ROLE_KEY bypasses RLS entirely. It must never
//    be imported into a client component. It is read here only in
//    functions that run on the server.
// ============================================================

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY

export const isSupabaseConfigured = () => Boolean(URL && ANON)
export const isServiceConfigured = () => Boolean(URL && SERVICE)

type InsertResult = { ok: true; id?: string } | { ok: false; error: string }

/**
 * Server-side insert using the service role. Never call from the browser.
 * Uses Supabase's PostgREST endpoint directly — no SDK dependency, which
 * keeps the bundle small and avoids a package for two HTTP calls.
 */
export async function insertServer(table: string, row: Record<string, unknown>): Promise<InsertResult> {
  if (!isServiceConfigured()) {
    return { ok: false, error: "supabase-not-configured" }
  }
  try {
    const res = await fetch(`${URL}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE as string,
        Authorization: `Bearer ${SERVICE}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(row),
      cache: "no-store",
    })
    if (!res.ok) {
      const text = await res.text()
      return { ok: false, error: `supabase-${res.status}: ${text.slice(0, 200)}` }
    }
    const data = await res.json()
    return { ok: true, id: Array.isArray(data) ? data[0]?.id : undefined }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

/** Read helper for public tables (batches, COAs) via the anon key + RLS. */
export async function selectPublic<T = unknown>(
  table: string,
  query = ""
): Promise<T[] | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const res = await fetch(`${URL}/rest/v1/${table}?${query}`, {
      headers: { apikey: ANON as string, Authorization: `Bearer ${ANON}` },
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return (await res.json()) as T[]
  } catch {
    return null
  }
}
