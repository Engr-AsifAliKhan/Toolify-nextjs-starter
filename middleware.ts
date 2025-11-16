import { NextRequest, NextResponse } from "next/server";

const buckets = new Map<string, { tokens: number; last: number }>();
const RATE_LIMIT_PER_SECOND = 1;

export function middleware(req: NextRequest) {
  const ip =
    req.ip ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const now = Date.now();
  const bucket = buckets.get(ip) ?? { tokens: RATE_LIMIT_PER_SECOND, last: now };
  const elapsed = (now - bucket.last) / 1000;
  bucket.tokens = Math.min(RATE_LIMIT_PER_SECOND, bucket.tokens + elapsed * RATE_LIMIT_PER_SECOND);
  bucket.last = now;

  if (bucket.tokens < 1) {
    return new NextResponse("Rate limit exceeded", { status: 429 });
  }

  bucket.tokens -= 1;
  buckets.set(ip, bucket);

  // Enforce file size limit via header hint (client validates too)
  const res = NextResponse.next();
  res.headers.set("X-Toolify-Max-Upload-MB", "10");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons/|manifest.json|sw.js).*)"],
};