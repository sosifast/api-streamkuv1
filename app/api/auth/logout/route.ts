import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    status: true,
    message: "Logged out successfully",
  });

  response.cookies.delete("dbmovie_session");
  return response;
}
