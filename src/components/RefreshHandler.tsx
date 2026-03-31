"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type RefreshHandlerProps = {
  interval?: number;
  enabled?: boolean;
  refreshOnFocus?: boolean;
};

export function RefreshHandler({
  interval = 0,
  enabled = true,
  refreshOnFocus = true,
}: RefreshHandlerProps) {
  const router = useRouter();
  const lastRefreshRef = useRef(0);
  const autoRefreshDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTO_REFRESH === "true";

  useEffect(() => {
    if (!enabled || autoRefreshDisabled) return;

    const canRefresh = () => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") {
        return false;
      }

      if (typeof navigator !== "undefined" && !navigator.onLine) {
        return false;
      }

      return true;
    };

    const refresh = () => {
      if (!canRefresh()) return;

      const now = Date.now();
      if (interval > 0 && now - lastRefreshRef.current < interval) {
        return;
      }

      lastRefreshRef.current = now;
      router.refresh();
    };

    let timer: ReturnType<typeof setInterval> | undefined;

    if (interval > 0) {
      timer = setInterval(refresh, interval);
    }

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    const handleFocus = () => refresh();

    if (refreshOnFocus && typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibility);
      window.addEventListener("focus", handleFocus);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (refreshOnFocus && typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibility);
        window.removeEventListener("focus", handleFocus);
      }
    };
  }, [autoRefreshDisabled, enabled, interval, refreshOnFocus, router]);

  return null;
}
