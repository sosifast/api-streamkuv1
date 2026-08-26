import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

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

    const body = await request.json();
    const { username, password } = body;

    if (!username && !password) {
      return NextResponse.json(
        { status: false, error: "Provide username or password to update" },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (username) {
      // Check if username already exists
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json(
          { status: false, error: "Username already taken" },
          { status: 400 }
        );
      }
      updateData.username = username;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, username: true, email: true },
    });

    return NextResponse.json({
      status: true,
      data: updated,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { status: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
