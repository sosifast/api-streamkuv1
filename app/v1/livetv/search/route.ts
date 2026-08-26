import { prisma } from "@/lib/prisma";
import { checkAuth, apiResponse } from "@/lib/api-auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  if (!query) {
    return apiResponse(null, "Query parameter 'q' is required", 400);
  }

  try {
    const streams = await prisma.iptv.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive", // Case-insensitive search
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        name: true,
        slug: true,
        coverUrl: true,
        country: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    return apiResponse(streams, `Search results for '${query}'`);
  } catch (error) {
    console.error("Error searching IPTV streams:", error);
    return apiResponse(null, "Internal Server Error", 500);
  }
}
