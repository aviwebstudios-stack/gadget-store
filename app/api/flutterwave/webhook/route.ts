import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("verif-hash");

  if (!signature || signature !== process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const body = await req.json();
  const { tx_ref, status } = body.data ?? {};

  if (!tx_ref) {
    return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });
  }

  await prisma.order.update({
    where: { txRef: tx_ref },
    data: { status: status === "successful" ? "paid" : "failed" },
  });

  return NextResponse.json({ received: true });
}
