"use client";

import { useActionState, useEffect } from "react";
import { createCountry, updateCountry } from "./actions";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type CountryFormProps = {
  country?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export default function CountryForm({ country }: CountryFormProps) {
  const isEditing = !!country;
  const action = isEditing ? updateCountry : createCountry;
  
  const [state, formAction, isPending] = useActionState(action, {
    success: false,
    error: "",
  });

  // Auto-generate slug from name if creating
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) {
      const name = e.target.value;
      const slugInput = document.getElementById("slug") as HTMLInputElement;
      if (slugInput && !slugInput.dataset.manual) {
        slugInput.value = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.dataset.manual = "true";
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <Link
          href="/admin/iptv/country"
          className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Countries
        </Link>
        <h1 className="font-display text-3xl font-bold text-white">
          {isEditing ? "Edit Country" : "Add New Country"}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {isEditing
            ? "Update the details of the country."
            : "Fill in the details to add a new country for IPTV streams."}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111318] p-6 shadow-xl">
        <form action={formAction} className="space-y-6">
          {isEditing && <input type="hidden" name="id" value={country.id} />}

          {/* Form Error */}
          {state?.error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {state.error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-zinc-300">
                Country Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={country?.name || ""}
                onChange={handleNameChange}
                placeholder="e.g. Indonesia"
                className={`w-full rounded-xl border bg-black/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500 ${
                  state?.fieldErrors?.name ? "border-red-500/50" : "border-white/10"
                }`}
              />
              {state?.fieldErrors?.name && (
                <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-zinc-300">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                defaultValue={country?.slug || ""}
                onChange={handleSlugChange}
                placeholder="e.g. indonesia"
                className={`w-full rounded-xl border bg-black/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500 ${
                  state?.fieldErrors?.slug ? "border-red-500/50" : "border-white/10"
                }`}
              />
              {state?.fieldErrors?.slug && (
                <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.slug}</p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500 disabled:opacity-50"
            >
              {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Country"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
