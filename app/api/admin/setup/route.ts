import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { username, password, setupKey } = await req.json();

  if (!setupKey || setupKey !== process.env.ADMIN_SETUP_KEY) {
    return NextResponse.json({ error: "Invalid setup key" }, { status: 403 });
  }

  const existing = await prisma.admin.findFirst();
  if (existing) {
    return NextResponse.json(
      { error: "An admin account already exists." },
      { status: 400 }
    );
  }

  if (!username || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Username and a password of at least 8 characters are required." },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.create({ data: { username, passwordHash } });

  return NextResponse.json({ success: true });
}
