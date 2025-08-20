// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const uploadTracker: Record<string, number> = {};

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // let sessionId = req.cookies.get("session-id")?.value;

  // if (!sessionId) {
  //   sessionId = crypto.randomUUID();

  //   res.cookies.set("session-id", sessionId, {
  //     httpOnly: true,
  //     sameSite: "strict",
  //     path: "/",
  //     secure:true,
  //   });
  // }
  // // Count uploads for this session
  // uploadTracker[sessionId] = (uploadTracker[sessionId] || 0) + 1;

  // if (uploadTracker[sessionId] > 3) {
  //   return NextResponse.json({ success: false, error: "Upload limit reached" }, { status: 429 });
  // }

  // res.headers.set("x-upload-count", uploadTracker[sessionId].toString());
  
  return res;
}
export const config = {
  matcher: "/api/:path*",
};
