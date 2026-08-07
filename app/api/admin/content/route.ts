import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
  return role === "admin";
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { key, value } = await req.json();
  const content = await prisma.siteContent.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return NextResponse.json({ content });
}
