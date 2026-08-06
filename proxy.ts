import { NextResponse, type NextRequest } from "next/server";
import { verifyJwt } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const session = token ? await verifyJwt(token) : null;

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (req.nextUrl.pathname.startsWith("/admin") && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/collect", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/collect/:path*", "/admin/:path*"],
};
