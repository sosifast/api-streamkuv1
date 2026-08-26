"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { PlanFormState } from "./actions";

interface PlanFormProps {
  action: (state: PlanFormState, formData: FormData) => Promise<PlanFormState>;
  initialData?: {
    id: string;
    name: string;
    priceIdr: number;
    priceUsd: number;
    expired: number;
    requestLimit: number;
    bandwithLimitPerDay: number;
  };
  submitLabel: string;
}

export default function PlanForm({ action, initialData, submitLabel }: PlanFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    success: false,
  });

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden ID for edit */}
      {initialData && <input type="hidden" name="id" value={initialData.id} />}

      {/* Error banner */}
      {state.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
          Plan Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={initialData?.name ?? ""}
          placeholder="e.g. Premium Plan"
          className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 ${
            state.fieldErrors?.name
              ? "border-red-500/50 focus:ring-red-500/30"
              : "border-white/10 focus:border-red-500/50 focus:ring-red-500/20"
          }`}
        />
        {state.fieldErrors?.name && (
          <p className="mt-1 text-xs text-red-400">{state.fieldErrors.name}</p>
        )}
      </div>

      {/* Prices */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="priceIdr" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Price IDR
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500">Rp</span>
            <input
              id="priceIdr"
              name="priceIdr"
              type="number"
              step="0.01"
              min="0"
              defaultValue={initialData?.priceIdr ?? ""}
              placeholder="0"
              className={`w-full rounded-xl border bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 ${
                state.fieldErrors?.priceIdr
                  ? "border-red-500/50 focus:ring-red-500/30"
                  : "border-white/10 focus:border-red-500/50 focus:ring-red-500/20"
              }`}
            />
          </div>
          {state.fieldErrors?.priceIdr && (
            <p className="mt-1 text-xs text-red-400">{state.fieldErrors.priceIdr}</p>
          )}
        </div>

        <div>
          <label htmlFor="priceUsd" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Price USD
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500">$</span>
            <input
              id="priceUsd"
              name="priceUsd"
              type="number"
              step="0.01"
              min="0"
              defaultValue={initialData?.priceUsd ?? ""}
              placeholder="0.00"
              className={`w-full rounded-xl border bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 ${
                state.fieldErrors?.priceUsd
                  ? "border-red-500/50 focus:ring-red-500/30"
                  : "border-white/10 focus:border-red-500/50 focus:ring-red-500/20"
              }`}
            />
          </div>
          {state.fieldErrors?.priceUsd && (
            <p className="mt-1 text-xs text-red-400">{state.fieldErrors.priceUsd}</p>
          )}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label htmlFor="expired" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
          Duration (days)
        </label>
        <input
          id="expired"
          name="expired"
          type="number"
          min="1"
          defaultValue={initialData?.expired ?? ""}
          placeholder="30"
          className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 ${
            state.fieldErrors?.expired
              ? "border-red-500/50 focus:ring-red-500/30"
              : "border-white/10 focus:border-red-500/50 focus:ring-red-500/20"
          }`}
        />
        {state.fieldErrors?.expired && (
          <p className="mt-1 text-xs text-red-400">{state.fieldErrors.expired}</p>
        )}
      </div>

      {/* Limits */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="requestLimit" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Request Limit
          </label>
          <input
            id="requestLimit"
            name="requestLimit"
            type="number"
            min="1"
            defaultValue={initialData?.requestLimit ?? ""}
            placeholder="1000"
            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 ${
              state.fieldErrors?.requestLimit
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-white/10 focus:border-red-500/50 focus:ring-red-500/20"
            }`}
          />
          {state.fieldErrors?.requestLimit && (
            <p className="mt-1 text-xs text-red-400">{state.fieldErrors.requestLimit}</p>
          )}
        </div>

        <div>
          <label htmlFor="bandwithLimitPerDay" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Bandwidth Limit / Day (MB)
          </label>
          <input
            id="bandwithLimitPerDay"
            name="bandwithLimitPerDay"
            type="number"
            min="1"
            defaultValue={initialData?.bandwithLimitPerDay ?? ""}
            placeholder="5000"
            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 ${
              state.fieldErrors?.bandwithLimitPerDay
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-white/10 focus:border-red-500/50 focus:ring-red-500/20"
            }`}
          />
          {state.fieldErrors?.bandwithLimitPerDay && (
            <p className="mt-1 text-xs text-red-400">{state.fieldErrors.bandwithLimitPerDay}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </span>
          ) : (
            submitLabel
          )}
        </button>
        <Link
          href="/admin/plan"
          className="rounded-xl border border-white/10 px-6 py-3 text-sm text-zinc-400 transition hover:border-white/20 hover:text-zinc-200"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
