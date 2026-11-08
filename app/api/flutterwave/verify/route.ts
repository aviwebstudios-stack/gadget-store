import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Public: Flutterwave sends the customer back to /checkout/success with these
// params. Return only what that page needs, never the order's personal details.
export async function GET(req: NextRequest) {
  const transactionId = req.nextUrl.searchParams.get("transaction_id");
  const txRef = req.nextUrl.searchParams.get("tx_ref");

  if (!transactionId || !txRef) {
    return NextResponse.json({ error: "Missing transaction reference" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { txRef } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  let status = order.status;

  // Only pending or failed orders are checked (a customer can retry payment on
  // the same link). Paid, shipped and later orders are never changed here, so a
  // bad or repeated request cannot downgrade them.
  if (status === "pending" || status === "failed") {
    let isSuccessful = false;
    try {
      const verifyRes = await fetch(
        `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`,
        { headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` } }
      );
      const verifyData = await verifyRes.json();
      isSuccessful =
        verifyData.status === "success" &&
        verifyData.data?.status === "successful" &&
        verifyData.data?.tx_ref === txRef;
    } catch {
      return NextResponse.json({ error: "Could not reach Flutterwave" }, { status: 502 });
    }

    status = isSuccessful ? "paid" : "failed";
    await prisma.order.update({ where: { txRef }, data: { status } });
  }

  const success = status !== "pending" && status !== "failed";
  return NextResponse.json({ success, order: success ? { trackingId: order.trackingId } : null });
}
