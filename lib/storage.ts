/* ─────────────────────────────────────────────────────────────────────────
   storage.ts  —  all localStorage / sessionStorage helpers
   ───────────────────────────────────────────────────────────────────────── */

export type Claim = {
  itemId: string;
  name: string;
  initials: string;
  quantity: string;
  claimedAt: string;
};

export type CustomItem = {
  id: string;
  sectionId: string;
  name: string;
  description: string;
  emoji: string;
  quantity?: string;
};

/* ── Keys ── */
const CLAIMS_KEY       = "lakeside_potluck_claims";
const ADMIN_KEY        = "lakeside_admin_auth";
const ADMIN_PASSWORD   = "lakeside2025";
const CUSTOM_ITEMS_KEY = "lakeside_custom_items";
const HIDDEN_IDS_KEY   = "lakeside_hidden_items";
const ITEM_IMAGES_KEY  = "lakeside_item_images";

/* ─── Claims ─────────────────────────────────────────────────────────── */

export function getClaims(): Record<string, Claim> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(CLAIMS_KEY) ?? "{}"); }
  catch { return {}; }
}

export function saveClaim(claim: Claim): void {
  const c = getClaims();
  c[claim.itemId] = claim;
  localStorage.setItem(CLAIMS_KEY, JSON.stringify(c));
}

export function removeClaim(itemId: string): void {
  const c = getClaims();
  delete c[itemId];
  localStorage.setItem(CLAIMS_KEY, JSON.stringify(c));
}

export function clearAllClaims(): void {
  localStorage.removeItem(CLAIMS_KEY);
}

/* ─── Admin auth ─────────────────────────────────────────────────────── */

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_KEY) === "true";
}

export function setAdminAuthed(val: boolean): void {
  if (val) sessionStorage.setItem(ADMIN_KEY, "true");
  else sessionStorage.removeItem(ADMIN_KEY);
}

export function checkAdminPassword(pw: string): boolean {
  return pw === ADMIN_PASSWORD;
}

/* ─── Helpers ────────────────────────────────────────────────────────── */

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

/* ─── Custom items (admin-added) ─────────────────────────────────────── */

export function getCustomItems(): CustomItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CUSTOM_ITEMS_KEY) ?? "[]"); }
  catch { return []; }
}

export function saveCustomItem(item: CustomItem): void {
  const all = getCustomItems().filter((i) => i.id !== item.id);
  all.push(item);
  localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(all));
}

export function deleteCustomItem(id: string): void {
  const all = getCustomItems().filter((i) => i.id !== id);
  localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(all));
  removeClaim(id);
  removeItemImage(id);
}

/* ─── Hidden default items ───────────────────────────────────────────── */

export function getHiddenItemIds(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HIDDEN_IDS_KEY) ?? "[]"); }
  catch { return []; }
}

export function hideDefaultItem(id: string): void {
  const hidden = new Set(getHiddenItemIds());
  hidden.add(id);
  localStorage.setItem(HIDDEN_IDS_KEY, JSON.stringify([...hidden]));
  removeClaim(id);
}

/* ─── Per-item custom images (stored as base64 data-URLs) ────────────── */

export function getItemImages(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(ITEM_IMAGES_KEY) ?? "{}"); }
  catch { return {}; }
}

export function setItemImage(id: string, dataUrl: string): void {
  const imgs = getItemImages();
  imgs[id] = dataUrl;
  localStorage.setItem(ITEM_IMAGES_KEY, JSON.stringify(imgs));
}

export function removeItemImage(id: string): void {
  const imgs = getItemImages();
  delete imgs[id];
  localStorage.setItem(ITEM_IMAGES_KEY, JSON.stringify(imgs));
}
