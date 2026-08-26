"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export interface StreamFormState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function validateStreamForm(formData: FormData): {
  valid: boolean;
  data: {
    name: string;
    slug: string;
    coverUrl: string | null;
    streamUrl1: string;
    streamUrl2: string | null;
    streamUrl3: string | null;
    streamUrl4: string | null;
    streamUrl5: string | null;
    countryIptvId: string;
    categoryIptvId: string;
  };
  fieldErrors: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const coverUrl = (formData.get("coverUrl") as string)?.trim() || null;
  const streamUrl1 = (formData.get("streamUrl1") as string)?.trim();
  const streamUrl2 = (formData.get("streamUrl2") as string)?.trim() || null;
  const streamUrl3 = (formData.get("streamUrl3") as string)?.trim() || null;
  const streamUrl4 = (formData.get("streamUrl4") as string)?.trim() || null;
  const streamUrl5 = (formData.get("streamUrl5") as string)?.trim() || null;
  const countryIptvId = (formData.get("countryIptvId") as string)?.trim();
  const categoryIptvId = (formData.get("categoryIptvId") as string)?.trim();

  if (!name) fieldErrors.name = "Name is required";
  if (!slug) fieldErrors.slug = "Slug is required";
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fieldErrors.slug = "Slug must contain only lowercase letters, numbers, and hyphens";
  }
  if (!streamUrl1) fieldErrors.streamUrl1 = "At least one Stream URL is required";
  if (!countryIptvId) fieldErrors.countryIptvId = "Country is required";
  if (!categoryIptvId) fieldErrors.categoryIptvId = "Category is required";

  return {
    valid: Object.keys(fieldErrors).length === 0,
    data: { name, slug, coverUrl, streamUrl1, streamUrl2, streamUrl3, streamUrl4, streamUrl5, countryIptvId, categoryIptvId },
    fieldErrors,
  };
}

export async function createStream(
  _prevState: StreamFormState,
  formData: FormData
): Promise<StreamFormState> {
  const { valid, data, fieldErrors } = validateStreamForm(formData);

  if (!valid) {
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  try {
    await prisma.iptv.create({
      data: {
        name: data.name,
        slug: data.slug,
        coverUrl: data.coverUrl,
        streamUrl1: data.streamUrl1,
        streamUrl2: data.streamUrl2,
        streamUrl3: data.streamUrl3,
        streamUrl4: data.streamUrl4,
        streamUrl5: data.streamUrl5,
        countryIptvId: data.countryIptvId,
        categoryIptvId: data.categoryIptvId,
      },
    });
  } catch (err: any) {
    console.error("Create stream error:", err);
    if (err.code === "P2002") {
      return { success: false, error: "Slug already exists. Please choose another." };
    }
    return { success: false, error: "Failed to create stream. Please try again." };
  }

  redirect("/admin/iptv/stream");
}

export async function updateStream(
  _prevState: StreamFormState,
  formData: FormData
): Promise<StreamFormState> {
  const id = formData.get("id") as string;
  if (!id) {
    return { success: false, error: "Stream ID is missing." };
  }

  const { valid, data, fieldErrors } = validateStreamForm(formData);

  if (!valid) {
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  try {
    await prisma.iptv.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        coverUrl: data.coverUrl,
        streamUrl1: data.streamUrl1,
        streamUrl2: data.streamUrl2,
        streamUrl3: data.streamUrl3,
        streamUrl4: data.streamUrl4,
        streamUrl5: data.streamUrl5,
        countryIptvId: data.countryIptvId,
        categoryIptvId: data.categoryIptvId,
      },
    });
  } catch (err: any) {
    console.error("Update stream error:", err);
    if (err.code === "P2002") {
      return { success: false, error: "Slug already exists. Please choose another." };
    }
    return { success: false, error: "Failed to update stream. Please try again." };
  }

  redirect("/admin/iptv/stream");
}

export async function deleteStream(id: string) {
  try {
    await prisma.iptv.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete stream:", error);
    throw new Error("Failed to delete stream");
  }
}
