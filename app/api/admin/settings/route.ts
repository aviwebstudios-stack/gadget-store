import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const botToken = await prisma.siteContent.findUnique({ where: { key: "telegram_bot_token" } });
  const chatId = await prisma.siteContent.findUnique({ where: { key: "telegram_chat_id" } });

  return NextResponse.json({
    telegramBotToken: botToken?.value ?? "",
    telegramChatId: chatId?.value ?? "",
  });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { telegramBotToken, telegramChatId } = await req.json();

  await prisma.siteContent.upsert({
    where: { key: "telegram_bot_token" },
    update: { value: telegramBotToken },
    create: { key: "telegram_bot_token", value: telegramBotToken },
  });
  await prisma.siteContent.upsert({
    where: { key: "telegram_chat_id" },
    update: { value: telegramChatId },
    create: { key: "telegram_chat_id", value: telegramChatId },
  });

  return NextResponse.json({ success: true });
}