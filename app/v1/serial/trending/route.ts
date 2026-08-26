import { prisma } from "@/lib/prisma";
import { checkAuth, apiResponse } from "@/lib/api-auth";

export async function GET(request: Request) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  try {
    const serials = await prisma.movie.findMany({
      where: { type: "Drama" },
      orderBy: { createdAt: "desc" },
      take: 20, // Limit to 20 trending serials
      select: {
        id: true,
        movieName: true,
        desc: true,
        coverImageUrl: true,
        bannerImageUrl: true,
        genre: true,
        year: true,
        createdAt: true,
      },
    });

    return apiResponse(serials, "Trending serials retrieved successfully");
  } catch (error) {
    console.error("Error fetching trending serials:", error);
    return apiResponse(null, "Internal Server Error", 500);
  }
}
