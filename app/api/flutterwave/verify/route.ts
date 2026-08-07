import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const transactionId = req.nextUrl.searchParams.get("transaction_id");
  const txRef = req.nextUrl.searchParams.get("tx_ref");

  if (!transactionId || !txRef) {
    return NextResponse.json({ error: "Missing transaction reference" }, { status: 400 });
  }

  const verifyRes = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    {
      headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` },
    }
  );
  const verifyData = await verifyRes.json();

  const isSuccessful =
    verifyData.status === "success" &&
    verifyData.data?.status === "successful" &&
    verifyData.data?.tx_ref === txRef;

  const order = await prisma.order.update({
    where: { txRef },
    data: { status: isSuccessful ? "paid" : "failed" },
  });

  return NextResponse.json({ success: isSuccessful, order });
}
