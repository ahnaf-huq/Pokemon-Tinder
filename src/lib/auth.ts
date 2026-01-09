import jwt from "jsonwebtoken";
import type { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const COOKIE_NAME = "session";
type TokenPayload = { userId: string };

function cookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function signSession(userId: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");
  return jwt.sign({ userId } satisfies TokenPayload, secret, { expiresIn: "7d" });
}

export function verifySession(token: string): TokenPayload | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch {
    return null;
  }
}

// Use these in Route Handlers
export function setSessionCookieOnResponse(res: NextResponse, token: string) {
  res.cookies.set(COOKIE_NAME, token, cookieOptions());
  return res;
}

export function clearSessionCookieOnResponse(res: NextResponse) {
  res.cookies.delete(COOKIE_NAME);
  return res;
}

// Read cookie (Next 16 cookies() is async)
export async function getUserIdFromCookies(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token)?.userId ?? null;
}
