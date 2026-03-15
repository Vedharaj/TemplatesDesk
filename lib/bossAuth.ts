import jwt from "jsonwebtoken";

const TOKEN_NAME = "admin_token";

export function verifyBossToken(token?: string): boolean {
  if (!token || !process.env.ADMIN_SECRET) {
    return false;
  }

  try {
    jwt.verify(token, process.env.ADMIN_SECRET);
    return true;
  } catch {
    return false;
  }
}

export function getBossTokenName() {
  return TOKEN_NAME;
}
