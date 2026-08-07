import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type CheckoutItem = {
  id: string;
  name: string;
  image: string;
  priceMin: number;
  qty: number;
};

export async function POST(req: NextRequest) {
  const { userId } = auth();
if (!userId) {
  return NextResponse.json({ error: "Please sign in to checkout" }, { status: 401 });
}
  const body = await req.json();
  const { items, shipping } = body as {
    items: CheckoutItem[];
    shipping: {
      fullName: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      state: string;
    };
  };

  if (!items?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const total = items.reduce((sum, i) => sum + i.priceMin * i.qty, 0);
  const txRef = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const trackingId = `GDX-${Math.floor(100000 + Math.random() * 900000)}`;

  const order = await prisma.order.create({
    data: {
      userId,
      txRef,
      trackingId,
      fullName: shipping.fullName,
      phone: shipping.phone,
      email: shipping.email,
      address: shipping.address,
      city: shipping.city,
      state: shipping.state,
      total,
      items: {
        create: items.map((i) => ({
          productId: i.id,
          name: i.name,
          image: i.image,
          price: i.priceMin,
          qty: i.qty,
        })),
      },
    },
  });

  const origin = req.nextUrl.origin;

  const flwRes = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: txRef,
      amount: total,
      currency: "NGN",
      redirect_url: `${origin}/checkout/success`,
      customer: {
        email: shipping.email,
        phonenumber: shipping.phone,
        name: shipping.fullName,
      },
      customizations: {
        title: "Store Checkout",
      },
    }),
  });

  const flwData = await flwRes.json();

  if (flwData.status !== "success") {
    return NextResponse.json({ error: "Could not initialize payment" }, { status: 502 });
  }

  return NextResponse.json({ link: flwData.data.link, orderId: order.id });
}
