import MovieForm from "../movie-form";
import { createMovie } from "../actions";

export const metadata = {
  title: "Create Movie — DB Movie Admin",
};

export default function AdminCreateMoviePage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-red-400">Content</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">Add New Movie</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Create a new movie entry in the database.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111318] p-6 sm:p-8">
        <MovieForm action={createMovie} submitLabel="Create Movie" />
      </div>
    </div>
  );
}
