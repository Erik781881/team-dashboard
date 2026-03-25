"use server";

import { revalidatePath } from "next/cache";
import { syncFromGoogleSheet } from "@/lib/sync";

export async function triggerManualSync() {
  try {
    await syncFromGoogleSheet();
    revalidatePath("/");
    revalidatePath("/leaderboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Sync failed" };
  }
}
