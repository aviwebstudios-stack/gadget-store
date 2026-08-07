import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ orders });
}
