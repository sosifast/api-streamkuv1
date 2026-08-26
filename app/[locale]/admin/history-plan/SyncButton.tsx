"use client";

import { useState, useTransition } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { syncCryptomusPayment } from "./actions";

interface SyncButtonProps {
  id: string;
}

export default function SyncButton({ id }: SyncButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleSync = () => {
    startTransition(async () => {
      const res = await syncCryptomusPayment(id);
      alert(res.message || res.error);
    });
  };

  return (
    <button
      type="button"
      onClick={handleSync}
      disabled={isPending}
      title="Sync Payment with Cryptomus"
      className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-zinc-400 transition hover:border-emerald-500/40 hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ArrowPathIcon className={`h-3 w-3 ${isPending ? "animate-spin" : ""}`} />
      {isPending ? "Syncing..." : "Sync"}
    </button>
  );
}
