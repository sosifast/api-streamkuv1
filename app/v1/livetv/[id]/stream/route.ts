import { prisma } from "@/lib/prisma";
import { checkAuth, apiResponse } from "@/lib/api-auth";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  const { id } = await params;

  if (!id) {
    return apiResponse(null, "Stream ID is required", 400);
  }

  const actualId = id.startsWith("id=") ? id.replace("id=", "") : id;

  try {
    const stream = await prisma.iptv.findUnique({
      where: { id: actualId },
      select: {
        streamUrl1: true,
        streamUrl2: true,
        streamUrl3: true,
        streamUrl4: true,
        streamUrl5: true,
      },
    });

    if (!stream) {
      return apiResponse(null, "Stream not found", 404);
    }

    // Filter out null or empty URLs
    const urls = [
      stream.streamUrl1,
      stream.streamUrl2,
      stream.streamUrl3,
      stream.streamUrl4,
      stream.streamUrl5,
    ].filter(Boolean);

    return apiResponse({ streamUrls: urls }, "Stream URLs retrieved successfully");
  } catch (error) {
    console.error("Error fetching stream URLs:", error);
    return apiResponse(null, "Internal Server Error", 500);
  }
}
