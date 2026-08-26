import { prisma } from "@/lib/prisma";
import Pagination from "../../components/Pagination";
import Link from "next/link";
import { PencilSquareIcon, PlusIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import DeleteButton from "../../components/DeleteButton";
import { deleteCountry } from "./actions";

export const metadata = {
  title: "IPTV Countries — DB Movie Admin",
};

export default async function AdminCountryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = parseInt((params.page as string) || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  const [countries, totalCountries] = await Promise.all([
    prisma.countryIptv.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { iptvs: true } },
      },
      skip,
      take: limit,
    }),
    prisma.countryIptv.count(),
  ]);

  const totalPages = Math.ceil(totalCountries / limit);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-red-400">
            IPTV Management
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">
            Countries
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {totalCountries} countr{totalCountries !== 1 ? "ies" : "y"} in database
          </p>
        </div>
        <Link
          href="/admin/iptv/country/create"
          className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500"
        >
          <PlusIcon className="h-4 w-4" />
          Add Country
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#111318]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.15em] text-zinc-500">
                <th className="px-5 py-4 text-left font-medium">Country</th>
                <th className="px-4 py-4 text-left font-medium">Slug</th>
                <th className="px-4 py-4 text-left font-medium">Streams Count</th>
                <th className="px-5 py-4 text-left font-medium">Added</th>
                <th className="px-5 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {countries.map((country) => (
                <tr
                  key={country.id}
                  className="text-zinc-300 transition hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                        <GlobeAltIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {country.name}
                        </p>
                        <p className="truncate font-mono text-[10px] text-zinc-600">
                          {country.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-zinc-400 font-mono text-xs">
                    {country.slug}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                        country._count.iptvs > 0
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-white/5 text-zinc-600"
                      }`}
                    >
                      {country._count.iptvs}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-500">
                    {new Date(country.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/iptv/country/${country.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
                      >
                        <PencilSquareIcon className="h-3 w-3" />
                        Edit
                      </Link>
                      <DeleteButton
                        id={country.id}
                        action={deleteCountry}
                        entityName="Country"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {countries.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    No countries found. Add some to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination totalPages={totalPages} currentPage={page} />
      </div>
    </div>
  );
}
