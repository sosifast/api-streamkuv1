import { prisma } from "@/lib/prisma";
import { checkAuth, apiResponse } from "@/lib/api-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  const { id } = await params;
  const actualId = id.startsWith("id=") ? id.replace("id=", "") : id;

  try {
    const movie = await prisma.movie.findUnique({
      where: {
        id: actualId,
        type: "Movie",
      },
      select: {
        id: true,
        movieName: true,
        desc: true,
        coverImageUrl: true,
        bannerImageUrl: true,
        trailerUrl: true,
        castDetail: true,
        genre: true,
        year: true,
        createdAt: true,
      },
    });

    if (!movie) {
      return apiResponse(null, "Movie not found", 404);
    }

    return apiResponse(movie, "Movie details retrieved successfully");
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return apiResponse(null, "Internal Server Error", 500);
  }
}
