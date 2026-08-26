"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export interface CountryFormState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function validateCountryForm(formData: FormData): {
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
  // simple slug validation
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fieldErrors.slug = "Slug must contain only lowercase letters, numbers, and hyphens";
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    data: { name, slug },
    fieldErrors,
  };
}

export async function createCountry(
  _prevState: CountryFormState,
  formData: FormData
): Promise<CountryFormState> {
  const { valid, data, fieldErrors } = validateCountryForm(formData);

  if (!valid) {
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  try {
    await prisma.countryIptv.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
  } catch (err: any) {
    console.error("Create country error:", err);
    if (err.code === "P2002") {
      return { success: false, error: "Slug already exists. Please choose another." };
    }
    return { success: false, error: "Failed to create country. Please try again." };
  }

  redirect("/admin/iptv/country");
}

export async function updateCountry(
  _prevState: CountryFormState,
  formData: FormData
): Promise<CountryFormState> {
  const id = formData.get("id") as string;
  if (!id) {
    return { success: false, error: "Country ID is missing." };
  }

  const { valid, data, fieldErrors } = validateCountryForm(formData);

  if (!valid) {
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  try {
    await prisma.countryIptv.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
  } catch (err: any) {
    console.error("Update country error:", err);
    if (err.code === "P2002") {
      return { success: false, error: "Slug already exists. Please choose another." };
    }
    return { success: false, error: "Failed to update country. Please try again." };
  }

  redirect("/admin/iptv/country");
}

export async function deleteCountry(id: string) {
  try {
    await prisma.countryIptv.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete country:", error);
    throw new Error("Failed to delete country");
  }
}
