import { auth as vercelAuth } from "@/app/(auth-vercel)/auth";
import { auth as mainAuth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Check if the route is a Vercel SDK route
  const isVercelRoute =
    pathname.startsWith("/chat") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  if (isVercelRoute) {
    const session = await vercelAuth();
    if (!session?.user && !["/login", "/register"].includes(pathname)) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    if (session?.user && ["/login", "/register"].includes(pathname)) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  } else {
    // Handle main app authentication
    const session = await mainAuth();
    if (!session?.user && !["/applogin"].includes(pathname)) {
      url.pathname = "/applogin";
      return NextResponse.redirect(url);
    }
    if (session?.user && ["/applogin"].includes(pathname)) {
      url.pathname = "/role_menu";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/applogin", "/chat/:path*", "/login", "/register"],
};
