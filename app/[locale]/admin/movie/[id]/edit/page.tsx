import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MovieForm from "../../movie-form";
import { updateMovie } from "../../actions";

export const metadata = {
  title: "Edit Movie — DB Movie Admin",
};

export default async function AdminEditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await prisma.movie.findUnique({
    where: { id },
  });

  if (!movie) {
    notFound();
  }

  // Need to parse genre and castDetail as string[] if they are stored as JSON arrays
  const genre = Array.isArray(movie.genre) ? (movie.genre as string[]) : null;
  const castDetail = Array.isArray(movie.castDetail) ? (movie.castDetail as string[]) : null;

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-red-400">Content</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">Edit Movie</h1>
        <p className="mt-1 font-mono text-xs text-zinc-500">ID: {movie.id}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111318] p-6 sm:p-8">
        <MovieForm
          action={updateMovie}
          initialData={{
            ...movie,
            genre,
            castDetail,
          }}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
