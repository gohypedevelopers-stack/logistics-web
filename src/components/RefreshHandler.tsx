"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RefreshHandler({ interval = 30000 }: { interval?: number }) {
  const router = useRouter();

  useEffect(() => {
    // Background refresh to keep panels in sync without full reload
    const timer = setInterval(() => {
      router.refresh();
      console.log("[SYNC] Background data refresh triggered.");
    }, interval);

    return () => clearInterval(timer);
  }, [router, interval]);

  return null;
}
