"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ShopNav } from "@/components/ShopNav";
import { Footer } from "@/components/Footer";
import { formatNaira } from "@/lib/products";

type OrderResult = {
  trackingId: string;
  status: string;
  total: number;
  fullName: string;
  address: string;
  city: string;
  state: string;
  createdAt: string;
  items: { id: string; name: string; image: string; price: number; qty: number }[];
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Awaiting Payment", color: "text-yellow-400" },
  paid: { label: "Payment Confirmed", color: "text-green-400" },
  processing: { label: "Processing", color: "text-blue-400" },
  shipped: { label: "Shipped", color: "text-purple-400" },
  delivered: { label: "Delivered", color: "text-green-400" },
  failed: { label: "Payment Failed", color: "text-red-400" },
};

export default function TrackOrderPage() {
  const params = useSearchParams();
  const [trackingId, setTrackingId] = useState(params.get("id") ?? "");
const [email, setEmail] = useState(params.get("email") ?? "");
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(
        `/api/track-order?trackingId=${encodeURIComponent(trackingId)}&email=${encodeURIComponent(email)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Could not find that order.");
        return;
      }
      setOrder(data.order);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <ShopNav />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-10 sm:py-16">
        <h1 className="mb-2 text-xl font-semibold sm:text-2xl">Track Your Order</h1>
        <p className="mb-8 text-sm text-white/60">
          Enter your tracking ID and the email used at checkout.
        </p>

        <form onSubmit={handleLookup} className="flex flex-col gap-3 sm:flex-row">
          <input
            required
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Tracking ID (e.g. GDX-123456)"
            className="flex-1 rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-white/40 focus:border-white focus:outline-none"
          />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email used at checkout"
            className="flex-1 rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-white/40 focus:border-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-white/85 disabled:opacity-60"
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {order && (
          <div className="mt-10 rounded-lg border border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/50">Tracking ID</p>
                <p className="text-lg font-semibold">{order.trackingId}</p>
              </div>
              <p className={`text-sm font-medium ${STATUS_LABELS[order.status]?.color ?? "text-white/60"}`}>
                {STATUS_LABELS[order.status]?.label ?? order.status}
              </p>
            </div>

            <p className="mt-4 text-xs text-white/50">
              Ordered {new Date(order.createdAt).toLocaleDateString()} · Delivering to {order.address}, {order.city}, {order.state}
            </p>

            <ul className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-4">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-white/5">
                    <Image src={item.image} alt={item.name} width={56} height={56} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-2 text-xs text-white/90">{item.name}</p>
                    <p className="mt-1 text-xs text-white/50">Qty {item.qty} · {formatNaira(item.price)}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-sm">
              <span className="text-white/70">Total</span>
              <span className="font-semibold">{formatNaira(order.total)}</span>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
