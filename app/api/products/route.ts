import { NextResponse } from "next/server";
import { getCategoriesDb } from "@/lib/products-db";

export async function GET() {
  const categories = await getCategoriesDb();
  return NextResponse.json({ categories });
}
