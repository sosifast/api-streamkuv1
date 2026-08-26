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
      where: { id: actualId, type: "Movie" },
      include: {
        movieUrls: {
          select: {
            id: true,
            streamUrl1: true,
            streamUrl2: true,
            streamUrl3: true,
            streamUrl4: true,
            streamUrl5: true,
          },
        },
      },
    });

    if (!movie) {
      return apiResponse(null, "Movie not found", 404);
    }

    const cleanedUrls = movie.movieUrls.map((urlObj: Record<string, unknown>) => 
      Object.fromEntries(Object.entries(urlObj).filter(([_, v]) => v !== null))
    );

    return apiResponse(cleanedUrls, "Movie streaming URLs retrieved successfully");
  } catch (error) {
    console.error("Error fetching movie stream URLs:", error);
    return apiResponse(null, "Internal Server Error", 500);
  }
}
