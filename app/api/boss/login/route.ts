import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getBossTokenName } from "@/lib/bossAuth"

export async function POST(req: Request) {
  if (!process.env.ADMIN_SECRET || !process.env.ADMIN_USER || !process.env.ADMIN_PASS) {
    return NextResponse.json({ error: "Admin auth is not configured" }, { status: 500 })
  }

  const { username, password } = await req.json()

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {

    const token = jwt.sign(
      { admin: true },
      process.env.ADMIN_SECRET!,
      { expiresIn: "1d" }
    )

    const response = NextResponse.json({ success: true })

    response.cookies.set(getBossTokenName(), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    })

    return response
  }

  return NextResponse.json({ error: "Invalid login" }, { status: 401 })
}