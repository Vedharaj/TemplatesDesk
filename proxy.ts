import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/boss/login")) {
    return NextResponse.next()
  }

  const token = req.cookies.get("admin_token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/boss/login", req.url))
  }

  try {
    jwt.verify(token, process.env.ADMIN_SECRET!)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/boss/login", req.url))
  }
}

export const config = {
  matcher: ["/boss/:path*"]
}
