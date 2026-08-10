import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/products";

export async function POST() {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let count = 0;
  let catOrder = 0;
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name, order: catOrder },
    });
    catOrder++;

    for (const p of category.products) {
      await prisma.product.upsert({
        where: { slug: p.id },
        update: {},
        create: {
          slug: p.id,
          name: p.name,
          image: p.image,
          category: category.name,
          priceMin: p.priceMin,
          priceMax: p.priceMax,
        },
      });
      count++;
    }
  }

  return NextResponse.json({ imported: count });
}