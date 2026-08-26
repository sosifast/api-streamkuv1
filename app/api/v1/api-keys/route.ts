import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("dbmovie_session")?.value;

    if (!userId) {
      return NextResponse.json(
        { status: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { apiKey: true },
    });

    if (!user) {
      return NextResponse.json(
        { status: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      data: { apiKey: user.apiKey || null },
    });
  } catch (error) {
    console.error("Error fetching API key:", error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch API key" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("dbmovie_session")?.value;

    if (!userId) {
      return NextResponse.json(
        { status: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Generate a simple API key format: sk_{random}
    const newApiKey = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { apiKey: newApiKey },
      select: { apiKey: true },
    });

    return NextResponse.json({
      status: true,
      data: { apiKey: updated.apiKey },
      message: "API key generated successfully",
    });
  } catch (error) {
    console.error("Error generating API key:", error);
    return NextResponse.json(
      { status: false, error: "Failed to generate API key" },
      { status: 500 }
    );
  }
}
