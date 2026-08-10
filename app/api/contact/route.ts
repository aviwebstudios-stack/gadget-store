import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const botTokenRecord = await prisma.siteContent.findUnique({ where: { key: "telegram_bot_token" } });
  const chatIdRecord = await prisma.siteContent.findUnique({ where: { key: "telegram_chat_id" } });

  const botToken = botTokenRecord?.value || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = chatIdRecord?.value || process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return NextResponse.json({ error: "Telegram not configured" }, { status: 500 });
  }

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: `📬 New contact message\n\nFrom: ${name} (${email})\n\n${message}`,
    }),
  });

  return NextResponse.json({ success: true });
}
