import { prisma } from "@/lib/prisma";
import Pagination from "../../components/Pagination";
import Link from "next/link";
import { PencilSquareIcon, PlusIcon, TvIcon } from "@heroicons/react/24/outline";
import DeleteButton from "../../components/DeleteButton";
import { deleteStream } from "./actions";

export const metadata = {
  title: "IPTV Streams — DB Movie Admin",
};

export default async function AdminStreamPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = parseInt((params.page as string) || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  const [streams, totalStreams] = await Promise.all([
    prisma.iptv.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        country: true,
        category: true,
      },
      skip,
      take: limit,
    }),
    prisma.iptv.count(),
  ]);

  const totalPages = Math.ceil(totalStreams / limit);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-red-400">
            IPTV Management
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">
            Streams
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {totalStreams} stream{totalStreams !== 1 ? "s" : ""} in database
          </p>
        </div>
        <Link
          href="/admin/iptv/stream/create"
          className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500"
        >
          <PlusIcon className="h-4 w-4" />
          Add Stream
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#111318]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.15em] text-zinc-500">
                <th className="px-5 py-4 text-left font-medium">Stream Name</th>
                <th className="px-4 py-4 text-left font-medium">Country</th>
                <th className="px-4 py-4 text-left font-medium">Category</th>
                <th className="px-4 py-4 text-left font-medium">Added</th>
                <th className="px-5 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {streams.map((stream) => (
                <tr
                  key={stream.id}
                  className="text-zinc-300 transition hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {stream.coverUrl ? (
                        <img
                          src={stream.coverUrl}
                          alt={stream.name}
                          className="h-10 w-10 flex-shrink-0 rounded-lg object-cover shadow-md bg-white/5"
                        />
                      ) : (
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                          <TvIcon className="h-5 w-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {stream.name}
                        </p>
                        <p className="truncate font-mono text-[10px] text-zinc-600">
                          {stream.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                      {stream.country.name}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-400">
                      {stream.category.name}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-500">
                    {new Date(stream.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/iptv/stream/${stream.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
                      >
                        <PencilSquareIcon className="h-3 w-3" />
                        Edit
                      </Link>
                      <DeleteButton
                        id={stream.id}
                        action={deleteStream}
                        entityName="Stream"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {streams.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    No streams found. Add some to get started!
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
