import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow access to home page
    if (pathname === "/") {
      return NextResponse.next();
    }

    // Allow access to auth pages without authentication
    if (pathname.startsWith("/login/")) {
      // If user is already authenticated, redirect to dashboard
      if (token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // Allow access to API auth routes
    if (pathname.startsWith("/api/login")) {
      return NextResponse.next();
    }

    // Protect dashboard and other routes
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        const signInUrl = new URL("/login", req.url);
        signInUrl.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(signInUrl);
      }
    }

    // Role-based access control for admin routes
    if (pathname.startsWith("/admin")) {
      if (!token) {
        const signInUrl = new URL("/login", req.url);
        signInUrl.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(signInUrl);
      }
      
      const userRole = token.role?.rName?.toLowerCase();
      if (userRole !== "admin" && userRole !== "administrator") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Protect user management routes
    if (pathname.startsWith("/users")) {
      if (!token) {
        const signInUrl = new URL("/login", req.url);
        signInUrl.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(signInUrl);
      }
      
      const userRole = token.role?.rName?.toLowerCase();
      if (userRole !== "admin" && userRole !== "administrator" && userRole !== "manager") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Always allow access to public routes
        if (
          pathname === "/" || 
          pathname.startsWith("/login/") || 
          pathname.startsWith("/api/login") ||
          pathname.startsWith("/_next/") ||
          pathname.includes(".")
        ) {
          return true;
        }
        
        // Require authentication for protected routes
        if (
          pathname.startsWith("/dashboard") || 
          pathname.startsWith("/admin") ||
          pathname.startsWith("/users") ||
          pathname.startsWith("/api/") && !pathname.startsWith("/api/login")
        ) {
          return !!token;
        }
        
        // Default to allowing access
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/login (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api/login|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
