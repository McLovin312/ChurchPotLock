/**
 * lib/kv.ts - Persistent key-value storage
 *
 * Production  : Vercel KV (Redis). Needs KV_REST_API_URL + KV_REST_API_TOKEN env vars.
 *               Create a KV store in your Vercel dashboard → Storage tab, then
 *               run `vercel env pull .env.local` to get the vars locally.
 *
 * Development : Falls back to a local `.dev-db.json` file (data survives hot reloads,
 *               resets on clean `rm .dev-db.json`). File is git-ignored.
 */

const LOCAL_DB = ".dev-db.json";

/* ── Local-file helpers (dev only) ──────────────────────────────────── */

function readLocal(): Record<string, unknown> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs   = require("fs")   as typeof import("fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path") as typeof import("path");
    const p = path.join(process.cwd(), LOCAL_DB);
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch { /* ignore */ }
  return {};
}

function writeLocal(data: Record<string, unknown>): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs   = require("fs")   as typeof import("fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path") as typeof import("path");
    fs.writeFileSync(path.join(process.cwd(), LOCAL_DB), JSON.stringify(data, null, 2), "utf-8");
  } catch { /* ignore */ }
}

/* ── Public API ──────────────────────────────────────────────────────── */

export async function dbGet<T>(key: string): Promise<T | null> {
  if (process.env.KV_REST_API_URL) {
    const { kv } = await import("@vercel/kv");
    const val = await kv.get<unknown>(key);
    if (val === null || val === undefined) return null;
    // @vercel/kv v3 may return a raw JSON string rather than a parsed object.
    // Parse it if so; otherwise the value was already deserialized by the client.
    if (typeof val === "string") {
      try { return JSON.parse(val) as T; } catch { return null; }
    }
    return val as T;
  }
  return (readLocal()[key] as T) ?? null;
}

export async function dbSet(key: string, value: unknown): Promise<void> {
  if (process.env.KV_REST_API_URL) {
    const { kv } = await import("@vercel/kv");
    // Always stringify explicitly so complex nested objects survive any
    // version of @vercel/kv without relying on automatic serialization.
    await kv.set(key, JSON.stringify(value));
    return;
  }
  const db = readLocal();
  db[key] = value;
  writeLocal(db);
}

export async function dbDel(key: string): Promise<void> {
  if (process.env.KV_REST_API_URL) {
    const { kv } = await import("@vercel/kv");
    await kv.del(key);
    return;
  }
  const db = readLocal();
  delete db[key];
  writeLocal(db);
}
