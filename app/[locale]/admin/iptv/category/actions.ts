"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export interface CategoryFormState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function validateCategoryForm(formData: FormData): {
  valid: boolean;
  data: {
    name: string;
    slug: string;
  };
  fieldErrors: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();

  if (!name) fieldErrors.name = "Name is required";
  if (!slug) fieldErrors.slug = "Slug is required";
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fieldErrors.slug = "Slug must contain only lowercase letters, numbers, and hyphens";
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    data: { name, slug },
    fieldErrors,
  };
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const { valid, data, fieldErrors } = validateCategoryForm(formData);

  if (!valid) {
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  try {
    await prisma.categoryIptv.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
  } catch (err: any) {
    console.error("Create category error:", err);
    if (err.code === "P2002") {
      return { success: false, error: "Slug already exists. Please choose another." };
    }
    return { success: false, error: "Failed to create category. Please try again." };
  }

  redirect("/admin/iptv/category");
}

export async function updateCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const id = formData.get("id") as string;
  if (!id) {
    return { success: false, error: "Category ID is missing." };
  }

  const { valid, data, fieldErrors } = validateCategoryForm(formData);

  if (!valid) {
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  try {
    await prisma.categoryIptv.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
  } catch (err: any) {
    console.error("Update category error:", err);
    if (err.code === "P2002") {
      return { success: false, error: "Slug already exists. Please choose another." };
    }
    return { success: false, error: "Failed to update category. Please try again." };
  }

  redirect("/admin/iptv/category");
}

export async function deleteCategory(id: string) {
  try {
    await prisma.categoryIptv.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete category:", error);
    throw new Error("Failed to delete category");
  }
}
