import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId, status } = await req.json();
  const order = await prisma.order.update({ where: { id: orderId }, data: { status } });
  return NextResponse.json({ order });
}