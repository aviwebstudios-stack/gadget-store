import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await res.json();
    if (!data.ok) return NextResponse.json({ error: "That token doesn't look right." }, { status: 400 });

    return NextResponse.json({ username: data.result.username });
  } catch {
    return NextResponse.json({ error: "Could not verify token." }, { status: 500 });
  }
}