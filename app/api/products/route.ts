import { NextResponse } from "next/server";
import { getCategoriesDb } from "@/lib/products-db";

// Read the database on every request so admin edits show without a redeploy.
export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await getCategoriesDb();
  return NextResponse.json({ categories });
}
