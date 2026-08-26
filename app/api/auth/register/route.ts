import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Username, email, dan password wajib diisi." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter." },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username atau email sudah terdaftar." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        level: "Member",
        status: "Active",
      },
    });

    try {
      await pusherServer.trigger("admin-notifications", "new-user", {
        message: `New user registered: ${username} (${email})`,
        time: new Date().toISOString(),
      });
    } catch (pushErr) {
      console.error("Pusher error:", pushErr);
    }

    return NextResponse.json(
      {
        status: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          level: user.level,
        },
        message: "Register success",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat registrasi." },
      { status: 500 },
    );
  }
}
