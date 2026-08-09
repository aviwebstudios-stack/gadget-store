import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
  return role === "admin";
}

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const slug = body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const price = Number(body.price);

    const product = await prisma.product.create({
      data: {
        slug: `${slug}-${Date.now().toString(36)}`,
        name: body.name,
        image: body.image,
        category: body.category,
        priceMin: price,
        priceMax: price,
        description: body.description || null,
        quantity: Number(body.quantity) || 0,
        isNewArrival: Boolean(body.isNewArrival),
        isOnSale: Boolean(body.isOnSale),
        inStock: (Number(body.quantity) || 0) > 0,
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
    data.inStock = data.quantity > 0;
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
