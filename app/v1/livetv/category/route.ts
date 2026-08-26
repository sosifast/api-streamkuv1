import { prisma } from "@/lib/prisma";
import { checkAuth, apiResponse } from "@/lib/api-auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  try {
    const categories = await prisma.categoryIptv.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return apiResponse(categories, "List of all IPTV categories");
  } catch (error) {
    console.error("Error fetching IPTV categories:", error);
    return apiResponse(null, "Internal Server Error", 500);
  }
}
