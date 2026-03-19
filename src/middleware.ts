import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const isAdminRoute = path.startsWith("/admin");
    const isCustomerRoute = path.startsWith("/customer");

    // Protection logic
    if (isAdminRoute && token?.role === "CUSTOMER") {
      return NextResponse.redirect(new URL("/customer/dashboard", req.url));
    }

    if (isCustomerRoute && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Role-based fine-grained admin checks can be added here or in layouts/components
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*"],
};
