import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    const data = await res.json();
    const chatId = data.result?.[data.result.length - 1]?.message?.chat?.id;

    if (!chatId) {
      return NextResponse.json({ error: "No message found yet. Send your bot a message and try again." }, { status: 404 });
    }

    return NextResponse.json({ chatId: String(chatId) });
  } catch {
    return NextResponse.json({ error: "Could not check for messages." }, { status: 500 });
  }
}