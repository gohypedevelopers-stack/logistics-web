import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  const path = req.nextUrl.pathname;

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

  // Customer access control (prevent admins/managers from accessing customer portal if needed)
  // Currently, we allow admins to potentially see customer pages if they navigate there,
  // but usually roles like ADMIN, MANAGER etc. should be handled.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/customer/:path*",
  ],
};
