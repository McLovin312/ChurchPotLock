/**
 * lib/storage.ts - Client-side only helpers
 *
 * Admin auth lives in sessionStorage (cleared when the browser tab closes).
 * All data (claims, items, images) is now stored in Vercel KV via lib/actions.ts.
 */

/* ── Admin auth ─────────────────────────────────────────────────────── */

const ADMIN_KEY = "lakeside_admin_auth";
const ADMIN_PW_KEY = "lakeside_admin_pw";

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_KEY) === "true";
}

export function setAdminAuthed(val: boolean): void {
  if (val) sessionStorage.setItem(ADMIN_KEY, "true");
  else { sessionStorage.removeItem(ADMIN_KEY); sessionStorage.removeItem(ADMIN_PW_KEY); }
}

export function getStoredAdminPw(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(ADMIN_PW_KEY) ?? "";
}

export function storeAdminPw(pw: string): void {
  if (pw) sessionStorage.setItem(ADMIN_PW_KEY, pw);
  else sessionStorage.removeItem(ADMIN_PW_KEY);
}

/* ── Utilities ──────────────────────────────────────────────────────── */

export function getInitials(name: string): string {
  return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() ?? "").slice(0, 2).join("");
}
