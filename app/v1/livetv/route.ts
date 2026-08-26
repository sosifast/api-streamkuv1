import { prisma } from "@/lib/prisma";
import { checkAuth, apiResponse } from "@/lib/api-auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  const searchParams = request.nextUrl.searchParams;
  const countrySlug = searchParams.get("country");
  const categorySlug = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const skip = (page - 1) * limit;

  try {
    const whereClause: any = {};
    if (countrySlug) {
      whereClause.country = { slug: countrySlug };
    }
    if (categorySlug) {
      whereClause.category = { slug: categorySlug };
    }

    const streams = await prisma.iptv.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        coverUrl: true,
        country: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    const total = await prisma.iptv.count({ where: whereClause });

    return apiResponse(
      {
        data: streams,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      "List of Live TV streams"
    );
  } catch (error) {
    console.error("Error fetching IPTV streams:", error);
    return apiResponse(null, "Internal Server Error", 500);
  }
}
