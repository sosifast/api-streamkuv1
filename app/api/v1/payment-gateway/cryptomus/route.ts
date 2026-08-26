import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("dbmovie_session")?.value;

    if (!userId) {
      return NextResponse.json({ status: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.level !== "Admin") {
      return NextResponse.json({ status: false, error: "Forbidden" }, { status: 403 });
    }

    const config = await prisma.paymentGateway.findUnique({
      where: { name: "cryptomus" },
    });

    return NextResponse.json({
      status: true,
      data: config || { name: "cryptomus", merchantId: "", paymentKey: "", isActive: false },
    });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("dbmovie_session")?.value;

    if (!userId) {
      return NextResponse.json({ status: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.level !== "Admin") {
      return NextResponse.json({ status: false, error: "Forbidden" }, { status: 403 });
    }

    const { merchantId, paymentKey, isActive } = await request.json();

    const config = await prisma.paymentGateway.upsert({
      where: { name: "cryptomus" },
      update: {
        merchantId,
        paymentKey,
        isActive,
      },
      create: {
        name: "cryptomus",
        merchantId,
        paymentKey,
        isActive,
      },
    });

    return NextResponse.json({ status: true, data: config, message: "Configuration saved successfully" });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}
