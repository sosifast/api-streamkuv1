import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Reference to the same in-memory store
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("dbmovie_session")?.value;

    if (!userId) {
      return NextResponse.json(
        { status: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { label, href } = body;

    if (!label || !href) {
      return NextResponse.json(
        { status: false, error: "Label and href are required" },
        { status: 400 }
      );
    }

    const menuIndex = menusStore.findIndex((m) => m.id === id);
    if (menuIndex === -1) {
      return NextResponse.json(
        { status: false, error: "Menu not found" },
        { status: 404 }
      );
    }

    menusStore[menuIndex] = { ...menusStore[menuIndex], label, href };

    return NextResponse.json({
      status: true,
      data: menusStore[menuIndex],
      message: "Menu updated successfully",
    });
  } catch (error) {
    console.error("Error updating menu:", error);
    return NextResponse.json(
      { status: false, error: "Failed to update menu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("dbmovie_session")?.value;

    if (!userId) {
      return NextResponse.json(
        { status: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const menuIndex = menusStore.findIndex((m) => m.id === id);
    if (menuIndex === -1) {
      return NextResponse.json(
        { status: false, error: "Menu not found" },
        { status: 404 }
      );
    }

    const deleted = menusStore.splice(menuIndex, 1)[0];

    // Reorder remaining items
    menusStore.forEach((menu, index) => {
      menu.order = index;
    });

    return NextResponse.json({
      status: true,
      data: deleted,
      message: "Menu deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu:", error);
    return NextResponse.json(
      { status: false, error: "Failed to delete menu" },
      { status: 500 }
    );
  }
}
