"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MovieType } from "@/app/generated/prisma/client";

export interface MovieFormState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function validateMovieForm(formData: FormData): {
  valid: boolean;
  data: {
    movieName: string;
    type: MovieType;
    desc: string | null;
    coverImageUrl: string | null;
    bannerImageUrl: string | null;
    trailerUrl: string | null;
    year: number | null;
    genre: string[] | null;
    castDetail: string[] | null;
  };
  fieldErrors: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  const movieName = (formData.get("movieName") as string)?.trim();
  const typeStr = (formData.get("type") as string)?.trim();
  const type = typeStr === "Drama" ? "Drama" : "Movie";

  const desc = (formData.get("desc") as string)?.trim() || null;
  const coverImageUrl = (formData.get("coverImageUrl") as string)?.trim() || null;
  const bannerImageUrl = (formData.get("bannerImageUrl") as string)?.trim() || null;
  const trailerUrl = (formData.get("trailerUrl") as string)?.trim() || null;
  
  const yearStr = (formData.get("year") as string)?.trim();
  const year = yearStr ? Number(yearStr) : null;

  const genreStr = (formData.get("genre") as string)?.trim();
  const genre = genreStr ? genreStr.split(",").map((s) => s.trim()).filter(Boolean) : null;

  const castDetailStr = (formData.get("castDetail") as string)?.trim();
  const castDetail = castDetailStr ? castDetailStr.split(",").map((s) => s.trim()).filter(Boolean) : null;

  if (!movieName) fieldErrors.movieName = "Movie name is required";
  if (yearStr && (isNaN(year as number) || (year as number) < 1800)) {
    fieldErrors.year = "Please enter a valid year";
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    data: { movieName, type, desc, coverImageUrl, bannerImageUrl, trailerUrl, year, genre, castDetail },
    fieldErrors,
  };
}

export async function createMovie(
  _prevState: MovieFormState,
  formData: FormData
): Promise<MovieFormState> {
  const { valid, data, fieldErrors } = validateMovieForm(formData);

  if (!valid) {
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  try {
    await prisma.movie.create({
      data: {
        movieName: data.movieName,
        type: data.type,
        desc: data.desc,
        coverImageUrl: data.coverImageUrl,
        bannerImageUrl: data.bannerImageUrl,
        trailerUrl: data.trailerUrl,
        year: data.year,
        genre: data.genre ? data.genre : undefined,
        castDetail: data.castDetail ? data.castDetail : undefined,
      },
    });
  } catch (err) {
    console.error("Create movie error:", err);
    return { success: false, error: "Failed to create movie. Please try again." };
  }

  redirect("/admin/movie");
}

export async function updateMovie(
  _prevState: MovieFormState,
  formData: FormData
): Promise<MovieFormState> {
  const id = formData.get("id") as string;
  if (!id) {
    return { success: false, error: "Movie ID is missing." };
  }

  const { valid, data, fieldErrors } = validateMovieForm(formData);

  if (!valid) {
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  try {
    await prisma.movie.update({
      where: { id },
      data: {
        movieName: data.movieName,
        type: data.type,
        desc: data.desc,
        coverImageUrl: data.coverImageUrl,
        bannerImageUrl: data.bannerImageUrl,
        trailerUrl: data.trailerUrl,
        year: data.year,
        genre: data.genre ? data.genre : null,
        castDetail: data.castDetail ? data.castDetail : null,
      },
    });
  } catch (err) {
    console.error("Update movie error:", err);
    return { success: false, error: "Failed to update movie. Please try again." };
  }

  redirect("/admin/movie");
}
