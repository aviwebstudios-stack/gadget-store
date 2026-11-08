"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { ShopNav } from "@/components/ShopNav";
import { Footer } from "@/components/Footer";

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"checking" | "success" | "failed">("checking");
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const { clearCart } = useCart();

  useEffect(() => {
    const transactionId = params.get("transaction_id");
    const txRef = params.get("tx_ref");

    if (!transactionId || !txRef) {
      setStatus("failed");
      return;
    }

    fetch(`/api/flutterwave/verify?transaction_id=${transactionId}&tx_ref=${txRef}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setTrackingId(data.order?.trackingId ?? null);
          clearCart();
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-page text-fg">
      <ShopNav />
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        {status === "checking" && <p className="text-sm text-fg-60">Confirming your payment...</p>}

        {status === "success" && (
          <>
            <p className="mb-3 text-4xl">✓</p>
            <h1 className="text-xl font-semibold">Payment successful</h1>
            <p className="mt-2 text-sm text-fg-60">
              Your order is confirmed. We&apos;ll reach out shortly with delivery details.
            </p>

            {trackingId && (
              <div className="mt-6 rounded-lg border border-fg/10 px-6 py-4">
                <p className="text-xs text-fg-50">Your tracking ID</p>
                <p className="mt-1 text-lg font-semibold tracking-wide">{trackingId}</p>
                <p className="mt-2 text-xs text-fg-50">Save this to track your order status later.</p>
              </div>
            )}
          </>
        )}

        {status === "failed" && (
          <>
            <p className="mb-3 text-4xl">✕</p>
            <h1 className="text-xl font-semibold">Payment not confirmed</h1>
            <p className="mt-2 text-sm text-fg-60">
              Something went wrong verifying your payment. If you were charged, contact support.
            </p>
          </>
        )}

        <div className="mt-8 flex gap-3">
          {trackingId && (
            <Link
              href={`/track-order?id=${trackingId}`}
              className="rounded-full border border-fg/30 px-6 py-2.5 text-sm font-semibold text-fg hover:border-fg"
            >
              Track Order
            </Link>
          )}
          <Link href="/shop" className="rounded-full bg-fg px-6 py-2.5 text-sm font-semibold text-page hover:bg-fg/85">
            Continue Shopping
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
