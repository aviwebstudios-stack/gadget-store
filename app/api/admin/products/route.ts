import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const slug = body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const price = Number(body.price);
    const quantity = Number(body.quantity) || 0;

    const product = await prisma.product.create({
      data: {
        slug: `${slug}-${Date.now().toString(36)}`,
        name: body.name,
        image: body.image,
        images: Array.isArray(body.images) ? body.images : [],
        category: body.category,
        priceMin: price,
        priceMax: price,
        description: body.description || null,
        quantity,
        isNewArrival: Boolean(body.isNewArrival),
        isOnSale: Boolean(body.isOnSale),
        inStock: quantity > 0,
      },
    });
    return NextResponse.json({ product });
  } catch (err) {
    console.error("Create product error:", err);
    return NextResponse.json({ error: "Could not create product" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, price, ...rest } = await req.json();
  const data: Record<string, unknown> = { ...rest };

  if (price !== undefined) {
    data.priceMin = Number(price);
    data.priceMax = Number(price);
  }
  if (data.quantity !== undefined) {
    data.quantity = Number(data.quantity);
  }
  if (data.quantity === 0) {
    data.inStock = false;
  }

  const product = await prisma.product.update({ where: { id }, data });
  return NextResponse.json({ product });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}