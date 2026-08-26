"use client";

import { useActionState } from "react";
import { createStream, updateStream } from "./actions";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type StreamFormProps = {
  stream?: {
    id: string;
    name: string;
    slug: string;
    coverUrl: string | null;
    streamUrl1: string;
    streamUrl2: string | null;
    streamUrl3: string | null;
    streamUrl4: string | null;
    streamUrl5: string | null;
    countryIptvId: string;
    categoryIptvId: string;
  } | null;
  countries: { id: string; name: string }[];
  categories: { id: string; name: string }[];
};

export default function StreamForm({ stream, countries, categories }: StreamFormProps) {
  const isEditing = !!stream;
  const action = isEditing ? updateStream : createStream;
  
  const [state, formAction, isPending] = useActionState(action, {
    success: false,
    error: "",
  });

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
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <Link
          href="/admin/iptv/stream"
          className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Streams
        </Link>
        <h1 className="font-display text-3xl font-bold text-white">
          {isEditing ? "Edit Stream" : "Add New Stream"}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {isEditing
            ? "Update the details of the IPTV stream."
            : "Fill in the details to add a new IPTV stream."}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111318] p-6 shadow-xl">
        <form action={formAction} className="space-y-8">
          {isEditing && <input type="hidden" name="id" value={stream.id} />}

          {state?.error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-6">
              {/* Basic Details */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-white">Basic Details</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-zinc-300">
                      Stream Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      defaultValue={stream?.name || ""}
                      onChange={handleNameChange}
                      placeholder="e.g. CNN Indonesia"
                      className={`w-full rounded-xl border bg-black/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500 ${
                        state?.fieldErrors?.name ? "border-red-500/50" : "border-white/10"
                      }`}
                    />
                    {state?.fieldErrors?.name && <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-zinc-300">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      defaultValue={stream?.slug || ""}
                      onChange={handleSlugChange}
                      placeholder="e.g. cnn-indonesia"
                      className={`w-full rounded-xl border bg-black/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500 ${
                        state?.fieldErrors?.slug ? "border-red-500/50" : "border-white/10"
                      }`}
                    />
                    {state?.fieldErrors?.slug && <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.slug}</p>}
                  </div>

                  <div>
                    <label htmlFor="coverUrl" className="mb-1.5 block text-sm font-medium text-zinc-300">
                      Cover URL
                    </label>
                    <input
                      type="url"
                      id="coverUrl"
                      name="coverUrl"
                      defaultValue={stream?.coverUrl || ""}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Classification */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-white">Classification</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="countryIptvId" className="mb-1.5 block text-sm font-medium text-zinc-300">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="countryIptvId"
                      name="countryIptvId"
                      defaultValue={stream?.countryIptvId || ""}
                      className={`w-full rounded-xl border bg-black/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500 ${
                        state?.fieldErrors?.countryIptvId ? "border-red-500/50" : "border-white/10"
                      }`}
                    >
                      <option value="" disabled>Select a country</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {state?.fieldErrors?.countryIptvId && <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.countryIptvId}</p>}
                  </div>

                  <div>
                    <label htmlFor="categoryIptvId" className="mb-1.5 block text-sm font-medium text-zinc-300">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="categoryIptvId"
                      name="categoryIptvId"
                      defaultValue={stream?.categoryIptvId || ""}
                      className={`w-full rounded-xl border bg-black/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500 ${
                        state?.fieldErrors?.categoryIptvId ? "border-red-500/50" : "border-white/10"
                      }`}
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {state?.fieldErrors?.categoryIptvId && <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.categoryIptvId}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Stream URLs */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-white">Stream URLs</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="streamUrl1" className="mb-1.5 block text-sm font-medium text-zinc-300">
                    Stream URL 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="streamUrl1"
                    name="streamUrl1"
                    defaultValue={stream?.streamUrl1 || ""}
                    placeholder="https://.../stream.m3u8"
                    className={`w-full rounded-xl border bg-black/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500 ${
                      state?.fieldErrors?.streamUrl1 ? "border-red-500/50" : "border-white/10"
                    }`}
                  />
                  {state?.fieldErrors?.streamUrl1 && <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.streamUrl1}</p>}
                </div>
                
                {[2, 3, 4, 5].map((num) => {
                  const key = `streamUrl${num}` as keyof typeof stream;
                  return (
                    <div key={num}>
                      <label htmlFor={key as string} className="mb-1.5 block text-sm font-medium text-zinc-400">
                        Stream URL {num} (Optional)
                      </label>
                      <input
                        type="url"
                        id={key as string}
                        name={key as string}
                        defaultValue={(stream && stream[key]) || ""}
                        placeholder="https://.../stream.m3u8"
                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500 disabled:opacity-50 md:w-auto md:min-w-[200px]"
            >
              {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Stream"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
