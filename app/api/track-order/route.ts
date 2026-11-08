import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const trackingId = req.nextUrl.searchParams.get("trackingId")?.trim();
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!trackingId || !email) {
    return NextResponse.json({ error: "Tracking ID and email are required" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { trackingId },
    include: { items: true },
  });

  if (!order || order.email.toLowerCase() !== email) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Only what the Track Order page shows. No phone, user ID or payment reference.
  return NextResponse.json({
    order: {
      trackingId: order.trackingId,
      status: order.status,
      total: order.total,
      fullName: order.fullName,
      address: order.address,
      city: order.city,
      state: order.state,
      createdAt: order.createdAt,
      items: order.items.map((i) => ({ id: i.id, name: i.name, image: i.image, price: i.price, qty: i.qty })),
    },
  });
}
