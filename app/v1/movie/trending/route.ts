import { prisma } from "@/lib/prisma";
import { checkAuth, apiResponse } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  try {
    const movies = await prisma.movie.findMany({
      where: { type: "Movie" },
      orderBy: { createdAt: "desc" },
      take: 20, // Limit to 20 trending movies
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

    return apiResponse(movies, "Trending movies retrieved successfully");
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return apiResponse(null, "Internal Server Error", 500);
  }
}
