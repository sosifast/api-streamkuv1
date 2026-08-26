"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export interface PlanFormState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function validatePlanForm(formData: FormData): {
  valid: boolean;
  data: {
    name: string;
    priceIdr: number;
    priceUsd: number;
    expired: number;
    requestLimit: number;
    bandwithLimitPerDay: number;
  };
  fieldErrors: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  const name = (formData.get("name") as string)?.trim();
  const priceIdr = Number(formData.get("priceIdr"));
  const priceUsd = Number(formData.get("priceUsd"));
  const expired = Number(formData.get("expired"));
  const requestLimit = Number(formData.get("requestLimit"));
  const bandwithLimitPerDay = Number(formData.get("bandwithLimitPerDay"));

  if (!name) fieldErrors.name = "Name is required";
  if (isNaN(priceIdr) || priceIdr < 0) fieldErrors.priceIdr = "Price IDR must be a valid positive number";
  if (isNaN(priceUsd) || priceUsd < 0) fieldErrors.priceUsd = "Price USD must be a valid positive number";
  if (isNaN(expired) || expired < 1) fieldErrors.expired = "Duration must be at least 1 day";
  if (isNaN(requestLimit) || requestLimit < 1) fieldErrors.requestLimit = "Request limit must be at least 1";
  if (isNaN(bandwithLimitPerDay) || bandwithLimitPerDay < 1) fieldErrors.bandwithLimitPerDay = "Bandwidth limit must be at least 1";

  return {
    valid: Object.keys(fieldErrors).length === 0,
    data: { name, priceIdr, priceUsd, expired, requestLimit, bandwithLimitPerDay },
    fieldErrors,
  };
}

export async function createPlan(
  _prevState: PlanFormState,
  formData: FormData
): Promise<PlanFormState> {
  const { valid, data, fieldErrors } = validatePlanForm(formData);

  if (!valid) {
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  try {
    await prisma.membershipPlan.create({
      data: {
        name: data.name,
        priceIdr: data.priceIdr,
        priceUsd: data.priceUsd,
        expired: data.expired,
        requestLimit: data.requestLimit,
        bandwithLimitPerDay: data.bandwithLimitPerDay,
      },
    });
  } catch (err) {
    console.error("Create plan error:", err);
    return { success: false, error: "Failed to create plan. Please try again." };
  }

  redirect("/admin/plan");
}

export async function updatePlan(
  _prevState: PlanFormState,
  formData: FormData
): Promise<PlanFormState> {
  const id = formData.get("id") as string;
  if (!id) {
    return { success: false, error: "Plan ID is missing." };
  }

  const { valid, data, fieldErrors } = validatePlanForm(formData);

  if (!valid) {
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  try {
    await prisma.membershipPlan.update({
      where: { id },
      data: {
        name: data.name,
        priceIdr: data.priceIdr,
        priceUsd: data.priceUsd,
        expired: data.expired,
        requestLimit: data.requestLimit,
        bandwithLimitPerDay: data.bandwithLimitPerDay,
      },
    });
  } catch (err) {
    console.error("Update plan error:", err);
    return { success: false, error: "Failed to update plan. Please try again." };
  }

  redirect("/admin/plan");
}
