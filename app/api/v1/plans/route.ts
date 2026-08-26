import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.membershipPlan.findMany();
    return NextResponse.json({
      status: true,
      data: plans,
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
