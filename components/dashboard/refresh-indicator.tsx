"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const REFRESH_MS = 180000;

export function RefreshIndicator() {
  const [nextRunIn, setNextRunIn] = useState(REFRESH_MS);
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setNextRunIn((value) => (value <= 1000 ? REFRESH_MS : value - 1000));
    }, 1000);

    const poller = setInterval(async () => {
      setIsSyncing(true);
      try {
        const response = await fetch("/api/sync", { method: "POST" });
        if (!response.ok) throw new Error("Sync request failed");
        router.refresh();
      } catch {
        toast.error("Automatic sync failed. Please retry.");
      } finally {
        setIsSyncing(false);
      }
    }, REFRESH_MS);

    return () => {
      clearInterval(timer);
      clearInterval(poller);
    };
  }, [router]);

  const mins = Math.floor(nextRunIn / 60000);
  const secs = Math.floor((nextRunIn % 60000) / 1000);

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {isSyncing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      <span>{isSyncing ? "Syncing now..." : `Next sync in ${mins}:${secs.toString().padStart(2, "0")}`}</span>
    </div>
  );
}
