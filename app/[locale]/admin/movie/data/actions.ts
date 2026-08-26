"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export interface MovieUrlFormState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

import { MovieUrlSchema } from "@/lib/validations";

function validateMovieUrlForm(formData: FormData): {
  valid: boolean;
  data: any;
  fieldErrors: Record<string, string>;
} {
  const payload = {
    movieId: formData.get("movieId")?.toString().trim(),
    streamUrl1: formData.get("streamUrl1")?.toString().trim(),
    streamUrl2: formData.get("streamUrl2")?.toString().trim() || null,
    streamUrl3: formData.get("streamUrl3")?.toString().trim() || null,
    streamUrl4: formData.get("streamUrl4")?.toString().trim() || null,
    streamUrl5: formData.get("streamUrl5")?.toString().trim() || null,
  };

  const parsed = MovieUrlSchema.safeParse(payload);
  const fieldErrors: Record<string, string> = {};

  if (!parsed.success) {
    const rawErrors = parsed.error.flatten().fieldErrors;
    for (const key in rawErrors) {
      fieldErrors[key] = rawErrors[key as keyof typeof rawErrors]?.[0] || "Invalid field";
    }
    return { valid: false, data: null, fieldErrors };
  }

  return { valid: true, data: parsed.data, fieldErrors };
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
