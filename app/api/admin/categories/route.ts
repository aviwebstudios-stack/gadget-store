import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { name } = await req.json();
  const count = await prisma.category.count();
  const category = await prisma.category.create({ data: { name, order: count } });
  return NextResponse.json({ category });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, name } = await req.json();
  const newName = typeof name === "string" ? name.trim() : "";
  if (!newName) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const current = await prisma.category.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Products store the category name, so rename them too or they would drop
  // out of the renamed tab.
  const [category] = await prisma.$transaction([
    prisma.category.update({ where: { id }, data: { name: newName } }),
    prisma.product.updateMany({ where: { category: current.name }, data: { category: newName } }),
  ]);
  return NextResponse.json({ category });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}