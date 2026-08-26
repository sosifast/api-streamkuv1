import { prisma } from "@/lib/prisma";
import Pagination from "../components/Pagination";
import Link from "next/link";
import { PencilSquareIcon, PlusIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import DeleteButton from "../components/DeleteButton";
import { deleteMovie } from "./actions";

export const metadata = {
  title: "Movies — DB Movie Admin",
};

export default async function AdminMoviePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = parseInt((params.page as string) || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  const [movies, totalMovies] = await Promise.all([
    prisma.movie.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { movieUrls: true, dramaUrls: true } },
      },
      skip,
      take: limit,
    }),
    prisma.movie.count(),
  ]);

  const totalPages = Math.ceil(totalMovies / limit);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-red-400">
            Content
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">
            Movies
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {totalMovies} movie{totalMovies !== 1 ? "s" : ""} in database
          </p>
        </div>
        <Link
          href="/admin/movie/create"
          className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500"
        >
          <PlusIcon className="h-4 w-4" />
          Add Movie
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#111318]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.15em] text-zinc-500">
                <th className="px-5 py-4 text-left font-medium">Movie</th>
                <th className="px-4 py-4 text-left font-medium">Type</th>
                <th className="px-4 py-4 text-left font-medium">Genre</th>
                <th className="px-4 py-4 text-left font-medium">Year</th>
                <th className="px-4 py-4 text-left font-medium">
                  Movie URLs
                </th>
                <th className="px-4 py-4 text-left font-medium">
                  Drama URLs
                </th>
                <th className="px-4 py-4 text-left font-medium">Trailer</th>
                <th className="px-5 py-4 text-left font-medium">Added</th>
                <th className="px-5 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {movies.map((movie) => {
                const genres: string[] = Array.isArray(movie.genre)
                  ? (movie.genre as string[])
                  : [];

                return (
                  <tr
                    key={movie.id}
                    className="text-zinc-300 transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {movie.coverImageUrl ? (
                          <img
                            src={movie.coverImageUrl}
                            alt={movie.movieName}
                            className="h-12 w-9 flex-shrink-0 rounded-lg object-cover shadow-md"
                          />
                        ) : (
                          <div className="flex h-12 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 text-sm text-zinc-600">
                            🎬
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">
                            {movie.movieName}
                          </p>
                          <p className="truncate font-mono text-[10px] text-zinc-600">
                            {movie.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        movie.type === "Movie" ? "bg-blue-500/15 text-blue-400" : "bg-purple-500/15 text-purple-400"
                      }`}>
                        {movie.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {genres.length > 0 ? (
                          genres.slice(0, 3).map((genre) => (
                            <span
                              key={genre}
                              className="rounded-md bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-400"
                            >
                              {genre}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-zinc-600">—</span>
                        )}
                        {genres.length > 3 && (
                          <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-500">
                            +{genres.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-zinc-400">
                      {movie.year ?? "—"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                          movie._count.movieUrls > 0
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-white/5 text-zinc-600"
                        }`}
                      >
                        {movie._count.movieUrls}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                          movie._count.dramaUrls > 0
                            ? "bg-purple-500/10 text-purple-400"
                            : "bg-white/5 text-zinc-600"
                        }`}
                      >
                        {movie._count.dramaUrls}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {movie.trailerUrl ? (
                        <a
                          href={movie.trailerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 transition hover:bg-emerald-500/20"
                        >
                          ▶ Watch
                        </a>
                      ) : (
                        <span className="text-xs text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-500">
                      {new Date(movie.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={
                            movie.type === "Movie"
                              ? `/admin/movie/data?id=${movie.id}`
                              : `/admin/movie/serial?id=${movie.id}`
                          }
                          className={`inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium transition ${
                            movie.type === "Movie" 
                              ? "hover:border-blue-500/40 hover:text-blue-400 text-zinc-400" 
                              : "hover:border-purple-500/40 hover:text-purple-400 text-zinc-400"
                          }`}
                        >
                          <PlusCircleIcon className="h-3 w-3" />
                          Data
                        </Link>
                        <Link
                          href={`/admin/movie/${movie.id}/edit`}
                          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
                        >
                          <PencilSquareIcon className="h-3 w-3" />
                          Edit
                        </Link>
                        <DeleteButton 
                          id={movie.id} 
                          action={deleteMovie} 
                          entityName="Movie" 
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {movies.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-500">
                    No movies found
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
