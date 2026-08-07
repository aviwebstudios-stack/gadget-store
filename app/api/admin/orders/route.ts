import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
  return role === "admin";
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId, status } = await req.json();
  const order = await prisma.order.update({ where: { id: orderId }, data: { status } });
  return NextResponse.json({ order });
}
