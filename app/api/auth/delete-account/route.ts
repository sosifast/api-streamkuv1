import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("dbmovie_session")?.value;

    if (!userId) {
      return NextResponse.json(
        { status: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Delete user and all related data (cascaded by Prisma)
    await prisma.user.delete({
      where: { id: userId },
    });

    // Clear the session cookie
    const response = NextResponse.json({
      status: true,
      message: "Account deleted successfully",
    });

    response.cookies.delete("dbmovie_session");
    return response;
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { status: false, error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
