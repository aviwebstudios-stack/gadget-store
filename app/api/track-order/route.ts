import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  return NextResponse.json({ order });
}
