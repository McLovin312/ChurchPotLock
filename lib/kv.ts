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
    return kv.get<T>(key);
  }
  return (readLocal()[key] as T) ?? null;
}

export async function dbSet(key: string, value: unknown): Promise<void> {
  if (process.env.KV_REST_API_URL) {
    const { kv } = await import("@vercel/kv");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await kv.set(key, value as any);
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
