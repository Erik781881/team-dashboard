import { NextResponse } from "next/server";
import { syncFromGoogleSheet } from "@/lib/sync";

export const runtime = "nodejs";

export async function POST() {
  try {
    await syncFromGoogleSheet();
    return NextResponse.json({ ok: true, syncedAt: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unknown sync failure" },
      { status: 500 }
    );
  }
}
