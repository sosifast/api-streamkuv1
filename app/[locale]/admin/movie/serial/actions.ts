"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export interface DramaUrlFormState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function validateDramaUrlForm(formData: FormData): {
  valid: boolean;
  data: {
    movieId: string;
    episode: number;
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
  const episodeStr = (formData.get("episode") as string)?.trim();
  const streamUrl1 = (formData.get("streamUrl1") as string)?.trim();
  const streamUrl2 = (formData.get("streamUrl2") as string)?.trim() || null;
  const streamUrl3 = (formData.get("streamUrl3") as string)?.trim() || null;
  const streamUrl4 = (formData.get("streamUrl4") as string)?.trim() || null;
  const streamUrl5 = (formData.get("streamUrl5") as string)?.trim() || null;

  const episode = parseInt(episodeStr, 10);

  if (!movieId) fieldErrors.movieId = "Movie ID is missing";
  if (!episodeStr || isNaN(episode) || episode < 1) {
    fieldErrors.episode = "Please enter a valid episode number";
  }
  if (!streamUrl1) fieldErrors.streamUrl1 = "Stream URL 1 is required";

  return {
    valid: Object.keys(fieldErrors).length === 0,
    data: { movieId, episode, streamUrl1, streamUrl2, streamUrl3, streamUrl4, streamUrl5 },
    fieldErrors,
  };
}

export async function createDramaUrl(
  _prevState: DramaUrlFormState,
  formData: FormData
): Promise<DramaUrlFormState> {
  const { valid, data, fieldErrors } = validateDramaUrlForm(formData);

  if (!valid) {
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  try {
    await prisma.dramaUrl.create({
      data: {
        movieId: data.movieId,
        episode: data.episode,
        streamUrl1: data.streamUrl1,
        streamUrl2: data.streamUrl2,
        streamUrl3: data.streamUrl3,
        streamUrl4: data.streamUrl4,
        streamUrl5: data.streamUrl5,
      },
    });
  } catch (err) {
    console.error("Create DramaUrl error:", err);
    return { success: false, error: "Failed to create episode. Please try again." };
  }

  redirect(`/admin/movie/serial?id=${data.movieId}`);
}

export async function updateDramaUrl(
  _prevState: DramaUrlFormState,
  formData: FormData
): Promise<DramaUrlFormState> {
  const id = formData.get("id") as string;
  if (!id) {
    return { success: false, error: "Episode ID is missing." };
  }

  const { valid, data, fieldErrors } = validateDramaUrlForm(formData);

  if (!valid) {
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  try {
    await prisma.dramaUrl.update({
      where: { id },
      data: {
        episode: data.episode,
        streamUrl1: data.streamUrl1,
        streamUrl2: data.streamUrl2,
        streamUrl3: data.streamUrl3,
        streamUrl4: data.streamUrl4,
        streamUrl5: data.streamUrl5,
      },
    });
  } catch (err) {
    console.error("Update DramaUrl error:", err);
    return { success: false, error: "Failed to update episode. Please try again." };
  }

  redirect(`/admin/movie/serial?id=${data.movieId}`);
}

export async function deleteDramaUrl(movieId: string, id: string) {
  if (!id || !movieId) {
    throw new Error("Missing ID");
  }

  try {
    await prisma.dramaUrl.delete({
      where: { id },
    });
  } catch (err) {
    console.error("Delete DramaUrl error:", err);
    throw new Error("Failed to delete episode");
  }

  redirect(`/admin/movie/serial?id=${movieId}`);
}
