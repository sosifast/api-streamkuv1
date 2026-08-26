"use client";

import { useActionState } from "react";
import Link from "next/link";
import { MovieUrlFormState } from "./actions";

interface MovieUrlFormProps {
  movieId: string;
  action: (prevState: MovieUrlFormState, formData: FormData) => Promise<MovieUrlFormState>;
  initialData?: {
    id: string;
    streamUrl1: string;
    streamUrl2?: string | null;
    streamUrl3?: string | null;
    streamUrl4?: string | null;
    streamUrl5?: string | null;
  };
  submitLabel: string;
}

const initialState: MovieUrlFormState = {
  success: false,
};

export default function MovieUrlForm({ movieId, action, initialData, submitLabel }: MovieUrlFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {state.error}
        </div>
      )}

      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="movieId" value={movieId} />

      <div className="space-y-5">
        <div>
          <label htmlFor="streamUrl1" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Stream URL 1 (Required)
          </label>
          <input
            id="streamUrl1"
            name="streamUrl1"
            type="url"
            defaultValue={initialData?.streamUrl1 ?? ""}
            placeholder="https://..."
            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 ${
              state.fieldErrors?.streamUrl1
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-white/10 focus:border-blue-500/50 focus:ring-blue-500/20"
            }`}
          />
          {state.fieldErrors?.streamUrl1 && (
            <p className="mt-1 text-xs text-red-400">{state.fieldErrors.streamUrl1}</p>
          )}
        </div>

        <div>
          <label htmlFor="streamUrl2" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Stream URL 2 (Optional)
          </label>
          <input
            id="streamUrl2"
            name="streamUrl2"
            type="url"
            defaultValue={initialData?.streamUrl2 ?? ""}
            placeholder="https://..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label htmlFor="streamUrl3" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Stream URL 3 (Optional)
          </label>
          <input
            id="streamUrl3"
            name="streamUrl3"
            type="url"
            defaultValue={initialData?.streamUrl3 ?? ""}
            placeholder="https://..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label htmlFor="streamUrl4" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Stream URL 4 (Optional)
          </label>
          <input
            id="streamUrl4"
            name="streamUrl4"
            type="url"
            defaultValue={initialData?.streamUrl4 ?? ""}
            placeholder="https://..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label htmlFor="streamUrl5" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Stream URL 5 (Optional)
          </label>
          <input
            id="streamUrl5"
            name="streamUrl5"
            type="url"
            defaultValue={initialData?.streamUrl5 ?? ""}
            placeholder="https://..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 disabled:opacity-50"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
        <Link
          href={`/admin/movie/data?id=${movieId}`}
          className="rounded-xl px-6 py-3 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
