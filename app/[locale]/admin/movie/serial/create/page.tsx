import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import DramaUrlForm from "../drama-url-form";
import { createDramaUrl } from "../actions";

export const metadata = {
  title: "Add Drama Episode — DB Movie Admin",
};

export default async function AdminCreateDramaEpisodePage({
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
      _count: { select: { dramaUrls: true } },
    },
  });

  if (!movie || movie.type !== "Drama") {
    notFound();
  }

  // Auto-suggest next episode number
  const nextEpisode = movie._count.dramaUrls + 1;

  return (
    <div className="w-full">
      <div className="mb-8">
        <Link href={`/admin/movie/serial?id=${movieId}`} className="text-xs font-semibold text-purple-400 hover:text-purple-300">
          &larr; Back to {movie.movieName}
        </Link>
        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-red-400">Content</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">Add Episode</h1>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111318] p-6 sm:p-8">
        <DramaUrlForm
          movieId={movieId}
          action={createDramaUrl}
          initialData={{ id: "", episode: nextEpisode, streamUrl1: "" }}
          submitLabel="Add Episode"
        />
      </div>
    </div>
  );
}
