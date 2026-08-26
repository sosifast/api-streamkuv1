import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import { deleteMovieUrl } from "./actions";
import DeleteButton from "../../components/DeleteButton";

export const metadata = {
  title: "Movie Data — DB Movie Admin",
};

export default async function AdminMovieDataPage({
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
    include: { movieUrls: true },
  });

  if (!movie || movie.type !== "Movie") {
    notFound();
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <Link href="/admin/movie" className="text-xs font-semibold text-blue-400 hover:text-blue-300">
            &larr; Back to Movies
          </Link>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-blue-400">Movie Data</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">{movie.movieName}</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage streaming URLs for this movie.</p>
        </div>
        <Link
          href={`/admin/movie/data/create?id=${movieId}`}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
        >
          <PlusIcon className="h-4 w-4" />
          Add URL Source
        </Link>
      </div>
      
      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#111318]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.15em] text-zinc-500">
                <th className="px-5 py-4 text-left font-medium">ID</th>
                <th className="px-4 py-4 text-left font-medium">Server 1</th>
                <th className="px-4 py-4 text-left font-medium">Other Servers</th>
                <th className="px-5 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {movie.movieUrls.map((url) => {
                const otherServers = [url.streamUrl2, url.streamUrl3, url.streamUrl4, url.streamUrl5].filter(Boolean).length;
                return (
                  <tr key={url.id} className="text-zinc-300 transition hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-mono text-[10px] text-zinc-500">
                      {url.id}
                    </td>
                    <td className="px-4 py-4 max-w-[200px] truncate text-xs">
                      <a href={url.streamUrl1} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                        {url.streamUrl1}
                      </a>
                    </td>
                    <td className="px-4 py-4 text-xs text-zinc-400">
                      {otherServers} additional server(s)
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/movie/data/${url.id}/edit?movieId=${movieId}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-zinc-400 transition hover:border-blue-500/40 hover:text-blue-400"
                        >
                          <PencilSquareIcon className="h-3 w-3" />
                          Edit
                        </Link>
                        <DeleteButton 
                          id={url.id} 
                          action={deleteMovieUrl.bind(null, movieId)} 
                          entityName="Movie URL" 
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {movie.movieUrls.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-zinc-500">
                    No URLs found for this movie.
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
