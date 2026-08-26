import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function checkAuth(request: Request): Promise<NextResponse | null> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { status: "error", message: "Missing or invalid Authorization header", data: null },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { status: "error", message: "Missing API Key", data: null },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { apiKey: token },
    });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "Invalid API Key", data: null },
        { status: 403 }
      );
    }

    if (user.status !== "Active") {
      return NextResponse.json(
        { status: "error", message: "User account is not active", data: null },
        { status: 403 }
      );
    }

    // Increment usage for live counting
    // Assume average response size is 0.05 MB (50 KB)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        apiRequestsCount: { increment: 1 },
        bandwithUsage: { increment: 0.05 }
      }
    });

    return null; // Auth passed
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error during auth check", data: null },
      { status: 500 }
    );
  }
}

export function apiResponse(data: any, message: string = "Success", status: number = 200) {
  return NextResponse.json(
    {
      status: status >= 200 && status < 300 ? "success" : "error",
      message,
      data,
    },
    { status }
  );
}
