import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULTS: Record<string, string> = {
  terms: "Terms & Conditions content coming soon. Contact us with any questions about purchases made on this site.",
  privacy: "Privacy Policy content coming soon. We only use your information to process and deliver your orders.",
};

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  const record = await prisma.siteContent.findUnique({ where: { key } });
  return NextResponse.json({ value: record?.value ?? DEFAULTS[key] ?? "" });
}
