import { getState } from "@/lib/actions";
import { NextResponse } from "next/server";

// Disable caching so polls always get fresh data
export const dynamic = "force-dynamic";

export async function GET() {
  const state = await getState();
  return NextResponse.json(state);
}
