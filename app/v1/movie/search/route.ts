import { prisma } from "@/lib/prisma";
import { checkAuth, apiResponse } from "@/lib/api-auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  try {
    const movies = await prisma.movie.findMany({
      where: {
        type: "Movie",
        movieName: {
          contains: query,
          mode: "insensitive", // Case-insensitive search
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        movieName: true,
        desc: true,
        coverImageUrl: true,
        year: true,
      },
    });

    return apiResponse(movies, `Search results for '${query}'`);
  } catch (error) {
    console.error("Error searching movies:", error);
    return apiResponse(null, "Internal Server Error", 500);
  }
}
