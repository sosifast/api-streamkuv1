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

    const histories = await prisma.historyMembership.findMany({
      where: { userId },
      include: {
        membershipPlan: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      status: true,
      data: histories,
    });
  } catch (error) {
    console.error("Error fetching membership history:", error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
