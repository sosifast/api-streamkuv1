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
    const serial = await prisma.movie.findUnique({
      where: {
        id: actualId,
        type: "Drama",
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
        dramaUrls: {
          select: {
            id: true,
            episode: true,
          },
          orderBy: { episode: "asc" },
        },
      },
    });

    if (!serial) {
      return apiResponse(null, "Serial not found", 404);
    }

    // Rename dramaUrls to episodes for better API semantics
    const { dramaUrls, ...rest } = serial;
    const responseData = { ...rest, episodes: dramaUrls };

    return apiResponse(responseData, "Serial details retrieved successfully");
  } catch (error) {
    console.error("Error fetching serial details:", error);
    return apiResponse(null, "Internal Server Error", 500);
  }
}
