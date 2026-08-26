import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import MovieUrlForm from "../../movie-url-form";
import { updateMovieUrl } from "../../actions";

export const metadata = {
  title: "Edit Movie Data — DB Movie Admin",
};

export default async function AdminEditMovieDataPage({
  params,
  searchParams,
}: {
  params: Promise<{ urlId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { urlId } = await params;
  const search = await searchParams;
  const movieId = search.movieId as string;

  if (!urlId || !movieId) {
    notFound();
  }

  const [movie, url] = await Promise.all([
    prisma.movie.findUnique({ where: { id: movieId } }),
    prisma.movieUrl.findUnique({ where: { id: urlId } }),
  ]);

  if (!movie || movie.type !== "Movie" || !url || url.movieId !== movieId) {
    notFound();
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <Link href={`/admin/movie/data?id=${movieId}`} className="text-xs font-semibold text-blue-400 hover:text-blue-300">
          &larr; Back to {movie.movieName}
        </Link>
        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-red-400">Content</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">Edit URL Source</h1>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111318] p-6 sm:p-8">
        <MovieUrlForm
          movieId={movieId}
          action={updateMovieUrl}
          initialData={{
            id: url.id,
            streamUrl1: url.streamUrl1,
            streamUrl2: url.streamUrl2,
            streamUrl3: url.streamUrl3,
            streamUrl4: url.streamUrl4,
            streamUrl5: url.streamUrl5,
          }}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
