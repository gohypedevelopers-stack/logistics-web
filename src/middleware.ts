import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const secret = process.env.NEXTAUTH_SECRET;
  
  if (!secret) {
    console.warn(`[MIDDLEWARE] CRITICAL: NEXTAUTH_SECRET is not defined in environment variables.`);
  }

  const token = await getToken({ 
    req, 
    secret 
  });
  
  if (token) {
    console.log(`[MIDDLEWARE] User "${token.name}" (${token.role}) accessing: ${path}`);
  } else {
    // Only log if it's a protected route
    if (path.startsWith("/admin") || path.startsWith("/customer")) {
       console.log(`[MIDDLEWARE] UNAUTHORIZED access attempt to: ${path}. Redirecting to /login.`);
    }
  }

  const isAdminRoute = path.startsWith("/admin");
  const isCustomerRoute = path.startsWith("/customer");

  // Protect Admin and Customer routes
  if ((isAdminRoute || isCustomerRoute) && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  // Admin access control (prevent customers from accessing admin)
  if (isAdminRoute && token?.role === "CUSTOMER") {
    return NextResponse.redirect(new URL("/customer/dashboard", req.url));
  }

  // Admin/Staff should not be in customer portal, redirect to admin console
  if (isCustomerRoute && token?.role && token.role !== "CUSTOMER") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/customer/:path*",
  ],
};
