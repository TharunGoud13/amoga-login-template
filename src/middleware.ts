import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req:NextRequest) {
    const session = await auth();
    const url = req.nextUrl.clone();
    const pathname = url.pathname;

    if (!session?.user && !['/applogin'].includes(pathname)) {
        url.pathname = "/applogin";
        return NextResponse.redirect(url);
    }

    if (session?.user && ['/applogin'].includes(pathname)) {
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = { 
    matcher: ['/',  '/applogin'] 
};
