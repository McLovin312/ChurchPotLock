/**
 * lib/kv.ts - Persistent key-value storage
 *
 * Production  : Upstash Redis via @upstash/redis.
 *               Requires KV_REST_API_URL + KV_REST_API_TOKEN env vars.
 *               In Vercel: Storage tab -> connect your KV store -> vars are auto-injected.
 *               Locally: run `vercel env pull .env.local` to pull them down.
 *
 * Development : Falls back to a local `.dev-db.json` file when the env vars are absent.
 *               File is git-ignored and survives hot reloads.
 */

import { Redis } from "@upstash/redis";

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

/* ── Redis client (production only) ─────────────────────────────────── */

function isKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function getRedis(): Redis {
  return new Redis({
    url:   process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

/* ── Public API ──────────────────────────────────────────────────────── */

export async function dbGet<T>(key: string): Promise<T | null> {
  if (isKvConfigured()) {
    const redis = getRedis();
    const val = await redis.get<unknown>(key);
    if (val === null || val === undefined) return null;
    // Upstash returns already-parsed objects; handle raw strings defensively
    if (typeof val === "string") {
      try { return JSON.parse(val) as T; } catch { return null; }
    }
    return val as T;
  }
  return (readLocal()[key] as T) ?? null;
}

export async function dbSet(key: string, value: unknown): Promise<void> {
  if (isKvConfigured()) {
    const redis = getRedis();
    await redis.set(key, JSON.stringify(value));
    return;
  }
  const db = readLocal();
  db[key] = value;
  writeLocal(db);
}

export async function dbDel(key: string): Promise<void> {
  if (isKvConfigured()) {
    const redis = getRedis();
    await redis.del(key);
    return;
  }
  const db = readLocal();
  delete db[key];
  writeLocal(db);
}
