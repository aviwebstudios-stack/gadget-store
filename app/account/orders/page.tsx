import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/format";
import { ShopNav } from "@/components/ShopNav";
import { Footer } from "@/components/Footer";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Awaiting Payment", color: "text-caution" },
  paid: { label: "Payment Confirmed", color: "text-success" },
  processing: { label: "Processing", color: "text-info" },
  shipped: { label: "Shipped", color: "text-accent" },
  delivered: { label: "Delivered", color: "text-success" },
  failed: { label: "Payment Failed", color: "text-danger" },
};

export const metadata: Metadata = pageMetadata("Your orders", "Every order you have placed with Delux Tech Gadget, with tracking IDs and status.");

export default async function OrdersPage() {
  const { userId } = auth();

  const orders = userId
    ? await prisma.order.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <main className="min-h-screen bg-page text-fg">
      <ShopNav />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-10 sm:py-16">
        <h1 className="mb-8 text-xl font-semibold sm:text-2xl">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-fg/15 p-10 text-center">
            <p className="text-sm text-fg-50">You haven&apos;t placed any orders yet.</p>
            <Link href="/shop" className="mt-4 inline-block text-sm text-fg underline">
              Go to the shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border border-fg/10 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-fg-50">Tracking ID</p>
                    <p className="text-sm font-semibold">{order.trackingId}</p>
                  </div>
                  <p className={`text-xs font-medium ${STATUS_LABELS[order.status]?.color ?? "text-fg-60"}`}>
                    {STATUS_LABELS[order.status]?.label ?? order.status}
                  </p>
                </div>

                <p className="mt-2 text-xs text-fg-50">
                  {new Date(order.createdAt).toLocaleDateString()} · {formatNaira(order.total)}
                </p>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <div className="flex gap-2 overflow-x-auto">
                    {order.items.map((item) => (
                      <div key={item.id} className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-fg/5">
                        <Image src={item.image} alt={item.name} width={56} height={56} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/track-order?id=${order.trackingId}&email=${encodeURIComponent(order.email)}`}
                    className="shrink-0 rounded-full border border-fg/25 px-4 py-1.5 text-xs font-medium text-fg hover:border-fg"
                  >
                    Track order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
