import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";

const isProtectedRoute = createRouteMatcher(["/checkout(.*)", "/account(.*)", "/api/checkout(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);
const isAdminPublicRoute = createRouteMatcher([
  "/admin/login",
  "/admin/setup",
  "/api/admin/login",
  "/api/admin/setup",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) auth().protect();

  if (isAdminRoute(req) && !isAdminPublicRoute(req)) {
    const token = req.cookies.get("admin_session")?.value;
    const adminId = await verifyAdminToken(token);
    if (!adminId) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};