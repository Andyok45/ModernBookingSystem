import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/server/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  console.log("Token from cookies:", token);

  let verifiedToken = null;
  if (token) {
    try {
      verifiedToken = await verifyAuth(token);
    } catch (err: any) {
      console.log("Token verification failed:", err.message);
    }
  }

  console.log("Verified token:", verifiedToken);

  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  console.log("Request pathname:", pathname);

  // Check if the route is a protected route (dashboard or any subpath)
  const isProtectedRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  // Check if the route is a login route
  const isLoginRoute = pathname === "/login";

  // 1. If user goes to /login and is NOT authenticated => allow
  if (isLoginRoute && !verifiedToken) {
    return NextResponse.next();
  }

  // 2. If user is authenticated and tries to go to /login => redirect to dashboard
  if (isLoginRoute && verifiedToken) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 3. If user is not authenticated and tries to access protected route => redirect to login
  if (isProtectedRoute && !verifiedToken) {
    // Store the original URL to redirect back after login
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 4. Allow the request to proceed
  return NextResponse.next();
}


export const config = {
  matcher: ["/login", "/dashboard", "/dashboard/:path*"],
};






// See "Matching Paths" below to learn more
// export const config = {
//   matcher: ['/dashboard/:path*', '/api/admin/:path*', '/login'],
// }