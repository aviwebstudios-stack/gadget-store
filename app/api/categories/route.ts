import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Read the database on every request so admin edits show without a redeploy.
export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ categories });
}
