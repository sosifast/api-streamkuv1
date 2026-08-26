import { prisma } from "@/lib/prisma";
import { checkAuth, apiResponse } from "@/lib/api-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; ep: string }> }
) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  const { id, ep } = await params;
  const actualId = id.startsWith("id=") ? id.replace("id=", "") : id;
  const episodeNumber = parseInt(ep, 10);

  if (isNaN(episodeNumber)) {
    return apiResponse(null, "Invalid episode number", 400);
  }

  try {
    const episodeData = await prisma.dramaUrl.findFirst({
      where: {
        movieId: actualId,
        episode: episodeNumber,
        movie: {
          type: "Drama",
        },
      },
      select: {
        id: true,
        episode: true,
        streamUrl1: true,
        streamUrl2: true,
        streamUrl3: true,
        streamUrl4: true,
        streamUrl5: true,
      },
    });

    if (!episodeData) {
      return apiResponse(null, "Episode or stream URLs not found", 404);
    }

    const cleanedData = Object.fromEntries(Object.entries(episodeData).filter(([_, v]) => v !== null));

    return apiResponse(cleanedData, `Stream URLs for episode ${episodeNumber} retrieved successfully`);
  } catch (error) {
    console.error("Error fetching serial stream URLs:", error);
    return apiResponse(null, "Internal Server Error", 500);
  }
}
