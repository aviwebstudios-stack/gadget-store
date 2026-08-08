import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ products: [] });

  const products = await prisma.product.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    take: 8,
  });
  return NextResponse.json({ products });
}
