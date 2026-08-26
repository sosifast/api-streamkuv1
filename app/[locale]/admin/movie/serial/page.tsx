import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import { deleteDramaUrl } from "./actions";
import DeleteButton from "../../components/DeleteButton";

export const metadata = {
  title: "Drama Episodes — DB Movie Admin",
};

export default async function AdminMovieSerialPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const movieId = params.id as string;

  if (!movieId) {
    notFound();
  }

  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: {
      dramaUrls: {
        orderBy: { episode: "asc" },
      },
    },
  });

  if (!movie || movie.type !== "Drama") {
    notFound();
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <Link href="/admin/movie" className="text-xs font-semibold text-purple-400 hover:text-purple-300">
            &larr; Back to Movies
          </Link>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-purple-400">Drama Serial</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">{movie.movieName}</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage episodes and data for this drama.</p>
        </div>
        <Link
          href={`/admin/movie/serial/create?id=${movieId}`}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-600/25 transition hover:bg-purple-500"
        >
          <PlusIcon className="h-4 w-4" />
          Add Episode
        </Link>
      </div>
      
      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#111318]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.15em] text-zinc-500">
                <th className="px-5 py-4 text-left font-medium">Ep</th>
                <th className="px-4 py-4 text-left font-medium">Server 1</th>
                <th className="px-4 py-4 text-left font-medium">Other Servers</th>
                <th className="px-5 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {movie.dramaUrls.map((url) => {
                const otherServers = [url.streamUrl2, url.streamUrl3, url.streamUrl4, url.streamUrl5].filter(Boolean).length;
                return (
                  <tr key={url.id} className="text-zinc-300 transition hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-bold text-white">
                      {url.episode}
                    </td>
                    <td className="px-4 py-4 max-w-[200px] truncate text-xs">
                      <a href={url.streamUrl1} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">
                        {url.streamUrl1}
                      </a>
                    </td>
                    <td className="px-4 py-4 text-xs text-zinc-400">
                      {otherServers > 0 ? `${otherServers} additional server(s)` : "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/movie/serial/${url.id}/edit?movieId=${movieId}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-zinc-400 transition hover:border-purple-500/40 hover:text-purple-400"
                        >
                          <PencilSquareIcon className="h-3 w-3" />
                          Edit
                        </Link>
                        <DeleteButton 
                          id={url.id} 
                          action={deleteDramaUrl.bind(null, movieId)} 
                          entityName="Episode" 
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {movie.dramaUrls.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-zinc-500">
                    No episodes found for this drama.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
