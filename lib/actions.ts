"use server";

/**
 * lib/actions.ts - Server Actions
 *
 * All data mutations go through these functions. They run server-side and
 * write to Vercel KV (production) or a local .dev-db.json file (development).
 */

import { dbGet, dbSet } from "./kv";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { SITE_CONFIG } from "./config";

/* ── Keys ───────────────────────────────────────────────────────────── */

const K = {
  CLAIMS:     "potluck:claims",
  CUSTOM:     "potluck:custom-items",
  HIDDEN:     "potluck:hidden-items",
  IMAGES:     "potluck:item-images",
  QTY:        "potluck:quantity-overrides",
} as const;

const REVALIDATE_PATH = "/events/cinco-de-mayo";

/* ── Public types ────────────────────────────────────────────────────── */

export type Claim = {
  claimId:   string;
  itemId:    string;
  name:      string;
  initials:  string;
  quantity:  string;
  claimedAt: string;
};

export type CustomItem = {
  id:          string;
  sectionId:   string;
  name:        string;
  description: string;
  emoji:       string;
  quantity?:   string;
};

export type PotluckState = {
  claims:            Record<string, Claim[]>;
  customItems:       CustomItem[];
  hiddenItemIds:     string[];
  itemImages:        Record<string, string>;
  quantityOverrides: Record<string, string>;
};

/* ── Helpers ─────────────────────────────────────────────────────────── */

function initials(name: string): string {
  return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() ?? "").slice(0, 2).join("");
}

function checkAdmin(pw: string) {
  if (pw !== SITE_CONFIG.adminPassword) throw new Error("Unauthorized");
}

/** Server action: returns true if password is correct, false otherwise. */
export async function verifyAdmin(pw: string): Promise<boolean> {
  return pw === SITE_CONFIG.adminPassword;
}

function uniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/* ── Read ────────────────────────────────────────────────────────────── */

export async function getState(): Promise<PotluckState> {
  noStore(); // opt out of Next.js data cache so polls always get fresh KV data
  const [claims, customItems, hiddenItemIds, itemImages, quantityOverrides] = await Promise.all([
    dbGet<Record<string, Claim[]>>(K.CLAIMS),
    dbGet<CustomItem[]>(K.CUSTOM),
    dbGet<string[]>(K.HIDDEN),
    dbGet<Record<string, string>>(K.IMAGES),
    dbGet<Record<string, string>>(K.QTY),
  ]);
  return {
    claims:            claims            ?? {},
    customItems:       customItems       ?? [],
    hiddenItemIds:     hiddenItemIds     ?? [],
    itemImages:        itemImages        ?? {},
    quantityOverrides: quantityOverrides ?? {},
  };
}

/* ── Claims ──────────────────────────────────────────────────────────── */

export async function addClaim(itemId: string, name: string, quantity: string): Promise<void> {
  const claims = (await dbGet<Record<string, Claim[]>>(K.CLAIMS)) ?? {};
  claims[itemId] = [
    ...(claims[itemId] ?? []),
    { claimId: uniqueId(), itemId, name, initials: initials(name), quantity, claimedAt: new Date().toISOString() },
  ];
  await dbSet(K.CLAIMS, claims);
  revalidatePath(REVALIDATE_PATH);
}

export async function removeClaim(itemId: string, claimId: string, adminPw: string): Promise<void> {
  checkAdmin(adminPw);
  const claims = (await dbGet<Record<string, Claim[]>>(K.CLAIMS)) ?? {};
  const filtered = (claims[itemId] ?? []).filter(c => c.claimId !== claimId);
  if (filtered.length === 0) delete claims[itemId];
  else claims[itemId] = filtered;
  await dbSet(K.CLAIMS, claims);
  revalidatePath(REVALIDATE_PATH);
}

export async function resetAllClaims(adminPw: string): Promise<void> {
  checkAdmin(adminPw);
  await dbSet(K.CLAIMS, {});
  revalidatePath(REVALIDATE_PATH);
}

/* ── Items ───────────────────────────────────────────────────────────── */

export async function addCustomItem(
  item: Omit<CustomItem, "id">,
  imageDataUrl: string | undefined,
  adminPw: string,
): Promise<void> {
  checkAdmin(adminPw);
  const id = `custom-${uniqueId()}`;
  const items = (await dbGet<CustomItem[]>(K.CUSTOM)) ?? [];
  items.push({ ...item, id });
  await dbSet(K.CUSTOM, items);
  if (imageDataUrl) {
    const imgs = (await dbGet<Record<string, string>>(K.IMAGES)) ?? {};
    imgs[id] = imageDataUrl;
    await dbSet(K.IMAGES, imgs);
  }
  revalidatePath(REVALIDATE_PATH);
}

export async function editItem(
  itemId: string,
  updates: { name?: string; description?: string; emoji?: string; quantity?: string },
  adminPw: string,
): Promise<void> {
  checkAdmin(adminPw);
  if (itemId.startsWith("custom-")) {
    const items = (await dbGet<CustomItem[]>(K.CUSTOM)) ?? [];
    const i = items.findIndex(x => x.id === itemId);
    if (i !== -1) { items[i] = { ...items[i], ...updates }; await dbSet(K.CUSTOM, items); }
  } else if (updates.quantity !== undefined) {
    const ov = (await dbGet<Record<string, string>>(K.QTY)) ?? {};
    ov[itemId] = updates.quantity;
    await dbSet(K.QTY, ov);
  }
  revalidatePath(REVALIDATE_PATH);
}

export async function removeItem(itemId: string, adminPw: string): Promise<void> {
  checkAdmin(adminPw);
  if (itemId.startsWith("custom-")) {
    const items = (await dbGet<CustomItem[]>(K.CUSTOM)) ?? [];
    await dbSet(K.CUSTOM, items.filter(i => i.id !== itemId));
  } else {
    const hidden = new Set((await dbGet<string[]>(K.HIDDEN)) ?? []);
    hidden.add(itemId);
    await dbSet(K.HIDDEN, [...hidden]);
  }
  // Clean up claims & image
  const [claims, imgs] = await Promise.all([
    dbGet<Record<string, Claim[]>>(K.CLAIMS),
    dbGet<Record<string, string>>(K.IMAGES),
  ]);
  if (claims) { delete claims[itemId]; await dbSet(K.CLAIMS, claims); }
  if (imgs)   { delete imgs[itemId];   await dbSet(K.IMAGES, imgs);   }
  revalidatePath(REVALIDATE_PATH);
}

export async function unhideItem(itemId: string, adminPw: string): Promise<void> {
  checkAdmin(adminPw);
  const hidden = (await dbGet<string[]>(K.HIDDEN)) ?? [];
  await dbSet(K.HIDDEN, hidden.filter(id => id !== itemId));
  revalidatePath(REVALIDATE_PATH);
}

export async function setItemImage(itemId: string, dataUrl: string, adminPw: string): Promise<void> {
  checkAdmin(adminPw);
  const imgs = (await dbGet<Record<string, string>>(K.IMAGES)) ?? {};
  imgs[itemId] = dataUrl;
  await dbSet(K.IMAGES, imgs);
  revalidatePath(REVALIDATE_PATH);
}
