import { NextResponse } from "next/server";
import { getBossTokenName } from "@/lib/bossAuth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(getBossTokenName(), "", {
    httpOnly: true,
    maxAge: 0,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
