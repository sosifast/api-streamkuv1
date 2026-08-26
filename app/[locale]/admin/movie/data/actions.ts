"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export interface MovieUrlFormState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function validateMovieUrlForm(formData: FormData): {
  valid: boolean;
  data: {
    movieId: string;
    streamUrl1: string;
    streamUrl2: string | null;
    streamUrl3: string | null;
    streamUrl4: string | null;
    streamUrl5: string | null;
  };
  fieldErrors: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  const movieId = (formData.get("movieId") as string)?.trim();
  const streamUrl1 = (formData.get("streamUrl1") as string)?.trim();
  const streamUrl2 = (formData.get("streamUrl2") as string)?.trim() || null;
  const streamUrl3 = (formData.get("streamUrl3") as string)?.trim() || null;
  const streamUrl4 = (formData.get("streamUrl4") as string)?.trim() || null;
  const streamUrl5 = (formData.get("streamUrl5") as string)?.trim() || null;

  if (!movieId) fieldErrors.movieId = "Movie ID is missing";
  if (!streamUrl1) fieldErrors.streamUrl1 = "Stream URL 1 is required";

  return {
    valid: Object.keys(fieldErrors).length === 0,
    data: { movieId, streamUrl1, streamUrl2, streamUrl3, streamUrl4, streamUrl5 },
    fieldErrors,
  };
}

export async function createMovieUrl(
  _prevState: MovieUrlFormState,
  formData: FormData
): Promise<MovieUrlFormState> {
  const { valid, data, fieldErrors } = validateMovieUrlForm(formData);

  if (!valid) {
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  try {
    await prisma.movieUrl.create({
      data: {
        movieId: data.movieId,
        streamUrl1: data.streamUrl1,
        streamUrl2: data.streamUrl2,
        streamUrl3: data.streamUrl3,
        streamUrl4: data.streamUrl4,
        streamUrl5: data.streamUrl5,
      },
    });
  } catch (err) {
    console.error("Create MovieUrl error:", err);
    return { success: false, error: "Failed to create URL. Please try again." };
  }

  redirect(`/admin/movie/data?id=${data.movieId}`);
}

export async function updateMovieUrl(
  _prevState: MovieUrlFormState,
  formData: FormData
): Promise<MovieUrlFormState> {
  const id = formData.get("id") as string;
  if (!id) {
    return { success: false, error: "URL ID is missing." };
  }

  const { valid, data, fieldErrors } = validateMovieUrlForm(formData);

  if (!valid) {
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  try {
    await prisma.movieUrl.update({
      where: { id },
      data: {
        streamUrl1: data.streamUrl1,
        streamUrl2: data.streamUrl2,
        streamUrl3: data.streamUrl3,
        streamUrl4: data.streamUrl4,
        streamUrl5: data.streamUrl5,
      },
    });
  } catch (err) {
    console.error("Update MovieUrl error:", err);
    return { success: false, error: "Failed to update URL. Please try again." };
  }

  redirect(`/admin/movie/data?id=${data.movieId}`);
}

export async function deleteMovieUrl(movieId: string, id: string) {
  if (!id || !movieId) {
    throw new Error("Missing ID");
  }

  try {
    await prisma.movieUrl.delete({
      where: { id },
    });
  } catch (err) {
    console.error("Delete MovieUrl error:", err);
    throw new Error("Failed to delete URL");
  }

  redirect(`/admin/movie/data?id=${movieId}`);
}
