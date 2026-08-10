// ============================================================
// GOOGLE SHEETS SYNC  (server-only)
//
// Flow:  form → Supabase (source of truth) → this module → Sheets
//
// The sync is entirely OPTIONAL and fails soft: if the credentials
// are absent or Google errors, the enquiry is already safely stored
// in Supabase and the visitor still sees success. Turning the
// integration off is just removing the env vars.
//
// Credentials are read from the server environment only. The service
// account JSON must NEVER be exposed to the browser — note there is
// no NEXT_PUBLIC_ prefix on any variable in this file.
// ============================================================

import "server-only"
import crypto from "crypto"

const SHEET_ID = process.env.GOOGLE_SHEET_ID
const RAW_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_JSON

export const isSheetsConfigured = () => Boolean(SHEET_ID && RAW_KEY)

type ServiceAccount = { client_email: string; private_key: string }

function loadAccount(): ServiceAccount | null {
  if (!RAW_KEY) return null
  try {
    // Accept either raw JSON or base64-encoded JSON (easier to paste into
    // Vercel without newline mangling).
    const text = RAW_KEY.trim().startsWith("{")
      ? RAW_KEY
      : Buffer.from(RAW_KEY, "base64").toString("utf8")
    const parsed = JSON.parse(text)
    if (!parsed.client_email || !parsed.private_key) return null
    return { client_email: parsed.client_email, private_key: parsed.private_key.replace(/\\n/g, "\n") }
  } catch {
    return null
  }
}

const b64url = (input: Buffer | string) =>
  Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")

/** Mint a short-lived access token via the JWT bearer flow (no SDK needed). */
async function getAccessToken(acct: ServiceAccount): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000)
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const claims = b64url(
    JSON.stringify({
      iss: acct.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  )
  const signingInput = `${header}.${claims}`
  let signature: string
  try {
    signature = b64url(crypto.createSign("RSA-SHA256").update(signingInput).sign(acct.private_key))
  } catch {
    return null
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${signingInput}.${signature}`,
    }),
    cache: "no-store",
  })
  if (!res.ok) return null
  const json = await res.json()
  return json.access_token ?? null
}

export type SheetRow = {
  timestamp: string
  type: string
  name: string
  email: string
  company?: string
  country?: string
  product?: string
  message?: string
}

/**
 * Append one enquiry row. Returns false (never throws) when the integration
 * is off or Google is unreachable, so the caller can carry on regardless.
 */
export async function appendInquiry(row: SheetRow, tab = "Inquiries"): Promise<boolean> {
  const acct = loadAccount()
  if (!SHEET_ID || !acct) return false

  const token = await getAccessToken(acct)
  if (!token) return false

  const values = [[
    row.timestamp, row.type, row.name, row.email,
    row.company ?? "", row.country ?? "", row.product ?? "", row.message ?? "",
  ]]

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}` +
    `/values/${encodeURIComponent(tab)}!A:H:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values }),
      cache: "no-store",
    })
    return res.ok
  } catch {
    return false
  }
}
