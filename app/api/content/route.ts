import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const DEFAULTS: Record<string, string> = {
  terms: "Terms & Conditions content coming soon. Contact us with any questions about purchases made on this site.",
  privacy: "Privacy Policy content coming soon. We only use your information to process and deliver your orders.",
};

// Content the public site shows. Everything else in the table (for example the
// Telegram bot token) is only returned to a signed-in admin.
const PUBLIC_KEYS = new Set(["terms", "privacy", "contact", "faq_items", "store_claims"]);

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!PUBLIC_KEYS.has(key) && !(await requireAdmin())) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const record = await prisma.siteContent.findUnique({ where: { key } });
  return NextResponse.json({ value: record?.value ?? DEFAULTS[key] ?? "" });
}
