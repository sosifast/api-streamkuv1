"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { MovieFormState } from "./actions";

interface MovieFormProps {
  action: (state: MovieFormState, formData: FormData) => Promise<MovieFormState>;
  initialData?: {
    id: string;
    movieName: string;
    type?: string | null;
    desc?: string | null;
    coverImageUrl?: string | null;
    bannerImageUrl?: string | null;
    trailerUrl?: string | null;
    year?: number | null;
    genre?: string[] | null;
    castDetail?: string[] | null;
  };
  submitLabel: string;
}

export default function MovieForm({ action, initialData, submitLabel }: MovieFormProps) {
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

      {/* Movie Name & Year & Type */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="type" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={initialData?.type ?? "Movie"}
            className="w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 border-white/10 focus:border-red-500/50 focus:ring-red-500/20"
          >
            <option value="Movie" className="bg-[#111318]">Movie</option>
            <option value="Drama" className="bg-[#111318]">Drama</option>
          </select>
        </div>
        <div>
          <label htmlFor="movieName" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Movie Name
          </label>
          <input
            id="movieName"
            name="movieName"
            type="text"
            defaultValue={initialData?.movieName ?? ""}
            placeholder="e.g. Inception"
            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 ${
              state.fieldErrors?.movieName
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-white/10 focus:border-red-500/50 focus:ring-red-500/20"
            }`}
          />
          {state.fieldErrors?.movieName && (
            <p className="mt-1 text-xs text-red-400">{state.fieldErrors.movieName}</p>
          )}
        </div>
        <div>
          <label htmlFor="year" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Release Year
          </label>
          <input
            id="year"
            name="year"
            type="number"
            min="1800"
            defaultValue={initialData?.year ?? ""}
            placeholder="2024"
            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 ${
              state.fieldErrors?.year
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-white/10 focus:border-red-500/50 focus:ring-red-500/20"
            }`}
          />
          {state.fieldErrors?.year && (
            <p className="mt-1 text-xs text-red-400">{state.fieldErrors.year}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="desc" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
          Description
        </label>
        <textarea
          id="desc"
          name="desc"
          rows={4}
          defaultValue={initialData?.desc ?? ""}
          placeholder="Enter movie description..."
          className="w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 border-white/10 focus:border-red-500/50 focus:ring-red-500/20"
        />
      </div>

      {/* URLs */}
      <div className="space-y-5">
        <div>
          <label htmlFor="coverImageUrl" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Cover Image URL
          </label>
          <input
            id="coverImageUrl"
            name="coverImageUrl"
            type="url"
            defaultValue={initialData?.coverImageUrl ?? ""}
            placeholder="https://..."
            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 border-white/10 focus:border-red-500/50 focus:ring-red-500/20`}
          />
        </div>
        <div>
          <label htmlFor="bannerImageUrl" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Banner Image URL
          </label>
          <input
            id="bannerImageUrl"
            name="bannerImageUrl"
            type="url"
            defaultValue={initialData?.bannerImageUrl ?? ""}
            placeholder="https://..."
            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 border-white/10 focus:border-red-500/50 focus:ring-red-500/20`}
          />
        </div>
        <div>
          <label htmlFor="trailerUrl" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Trailer URL
          </label>
          <input
            id="trailerUrl"
            name="trailerUrl"
            type="url"
            defaultValue={initialData?.trailerUrl ?? ""}
            placeholder="https://..."
            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 border-white/10 focus:border-red-500/50 focus:ring-red-500/20`}
          />
        </div>
      </div>

      {/* Meta */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="genre" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Genres (comma separated)
          </label>
          <input
            id="genre"
            name="genre"
            type="text"
            defaultValue={initialData?.genre?.join(", ") ?? ""}
            placeholder="Action, Sci-Fi, Thriller"
            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 border-white/10 focus:border-red-500/50 focus:ring-red-500/20`}
          />
        </div>
        <div>
          <label htmlFor="castDetail" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            Cast (comma separated)
          </label>
          <input
            id="castDetail"
            name="castDetail"
            type="text"
            defaultValue={initialData?.castDetail?.join(", ") ?? ""}
            placeholder="Leonardo DiCaprio, Joseph Gordon-Levitt"
            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 border-white/10 focus:border-red-500/50 focus:ring-red-500/20`}
          />
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
          href="/admin/movie"
          className="rounded-xl border border-white/10 px-6 py-3 text-sm text-zinc-400 transition hover:border-white/20 hover:text-zinc-200"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
