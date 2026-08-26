"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export interface DramaUrlFormState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

import { DramaUrlSchema } from "@/lib/validations";

function validateDramaUrlForm(formData: FormData): {
  valid: boolean;
  data: any;
  fieldErrors: Record<string, string>;
} {
  const payload = {
    movieId: formData.get("movieId")?.toString().trim(),
    episode: formData.get("episode")?.toString().trim(),
    streamUrl1: formData.get("streamUrl1")?.toString().trim(),
    streamUrl2: formData.get("streamUrl2")?.toString().trim() || null,
    streamUrl3: formData.get("streamUrl3")?.toString().trim() || null,
    streamUrl4: formData.get("streamUrl4")?.toString().trim() || null,
    streamUrl5: formData.get("streamUrl5")?.toString().trim() || null,
  };

  const parsed = DramaUrlSchema.safeParse(payload);
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
