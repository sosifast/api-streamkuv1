"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LiveRefresh({ intervalMs = 5000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh(); // Tells Next.js to re-fetch the current server component data
    }, intervalMs);

    return () => clearInterval(interval);
  }, [router, intervalMs]);

  return null; // This component doesn't render any UI
}
