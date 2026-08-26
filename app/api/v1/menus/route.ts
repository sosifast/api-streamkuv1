import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// In-memory storage for demo purposes
// In production, this should be stored in database with a Menu model
let menusStore: Array<{
  id: string;
  label: string;
  href: string;
  order: number;
}> = [
  { id: "1", label: "Home", href: "/", order: 0 },
  { id: "2", label: "Dashboard", href: "/dashboard", order: 1 },
  { id: "3", label: "API Docs", href: "/docs", order: 2 },
];

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

    return NextResponse.json({
      status: true,
      data: menusStore.sort((a, b) => a.order - b.order),
    });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch menus" },
      { status: 500 }
    );
  }
}

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
    const { label, href } = body;

    if (!label || !href) {
      return NextResponse.json(
        { status: false, error: "Label and href are required" },
        { status: 400 }
      );
    }

    const newMenu = {
      id: Math.random().toString(36).substring(7),
      label,
      href,
      order: menusStore.length,
    };

    menusStore.push(newMenu);

    return NextResponse.json({
      status: true,
      data: newMenu,
      message: "Menu created successfully",
    });
  } catch (error) {
    console.error("Error creating menu:", error);
    return NextResponse.json(
      { status: false, error: "Failed to create menu" },
      { status: 500 }
    );
  }
}
