import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/checkout(.*)", "/account(.*)", "/api/checkout(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();

  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
    if (!userId || role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};