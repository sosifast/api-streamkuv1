import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import MovieUrlForm from "../movie-url-form";
import { createMovieUrl } from "../actions";

export const metadata = {
  title: "Add Movie Data — DB Movie Admin",
};

export default async function AdminCreateMovieDataPage({
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
  });

  if (!movie || movie.type !== "Movie") {
    notFound();
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <Link href={`/admin/movie/data?id=${movieId}`} className="text-xs font-semibold text-blue-400 hover:text-blue-300">
          &larr; Back to {movie.movieName}
        </Link>
        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-red-400">Content</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">Add URL Source</h1>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111318] p-6 sm:p-8">
        <MovieUrlForm
          movieId={movieId}
          action={createMovieUrl}
          submitLabel="Add URL"
        />
      </div>
    </div>
  );
}
