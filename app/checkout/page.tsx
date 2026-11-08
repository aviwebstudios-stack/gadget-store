"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/products";
import { ShopNav } from "@/components/ShopNav";
import { Footer } from "@/components/Footer";

export default function CheckoutPage() {
  const { items, updateQty, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce((sum, i) => sum + i.priceMin * i.qty, 0);

  async function handlePlaceOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const shipping = {
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shipping }),
      });
      const data = await res.json();

      if (!res.ok || !data.link) {
        setError("Could not start payment. Try again.");
        setLoading(false);
        return;
      }

      window.location.href = data.link;
    } catch {
      setError("Could not reach the server. Try again.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-page text-fg">
        <ShopNav />
        <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
          <h1 className="text-xl font-semibold">Your cart is empty</h1>
          <Link href="/shop" className="mt-6 rounded-full bg-fg px-6 py-2.5 text-sm font-semibold text-page hover:bg-fg/85">
            Browse the shop
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-page text-fg">
      <ShopNav />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-10 sm:py-14">
        <h1 className="mb-8 text-xl font-semibold sm:text-2xl">Checkout</h1>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-fg-90">Shipping details</h2>

            <input
              required
              name="fullName"
              placeholder="Full name"
              className="rounded-md border border-fg/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-fg-50 focus:border-fg focus:outline-none"
            />
            <input
              required
              name="phone"
              type="tel"
              placeholder="Phone number"
              className="rounded-md border border-fg/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-fg-50 focus:border-fg focus:outline-none"
            />
            <input
              required
              name="email"
              type="email"
              placeholder="Email address"
              className="rounded-md border border-fg/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-fg-50 focus:border-fg focus:outline-none"
            />
            <input
              required
              name="address"
              placeholder="Delivery address"
              className="rounded-md border border-fg/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-fg-50 focus:border-fg focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                name="city"
                placeholder="City"
                className="rounded-md border border-fg/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-fg-50 focus:border-fg focus:outline-none"
              />
              <input
                required
                name="state"
                placeholder="State"
                className="rounded-md border border-fg/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-fg-50 focus:border-fg focus:outline-none"
              />
            </div>

            <h2 className="mt-4 text-sm font-semibold text-fg-90">Payment</h2>
            <p className="text-xs text-fg-50">
              You&apos;ll be redirected to Flutterwave to complete payment securely.
            </p>
            {error && <p className="text-xs text-danger">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-fg py-3 text-sm font-semibold text-page hover:bg-fg/85 disabled:opacity-60"
            >
              {loading ? "Redirecting to payment..." : `Pay ${formatNaira(total)}`}
            </button>
          </form>

          <div className="h-fit rounded-lg border border-fg/10 p-5">
            <h2 className="mb-4 text-sm font-semibold text-fg-90">Order Summary</h2>
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-fg/5">
                    <Image src={item.image} alt={item.name} width={64} height={64} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-2 text-xs text-fg-90">{item.name}</p>
                    <p className="mt-1 text-xs text-fg-50">{formatNaira(item.priceMin)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded border border-fg/20 text-xs">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="px-2 py-0.5 text-fg-70 hover:text-fg"
                        >
                          −
                        </button>
                        <span className="w-6 text-center">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="px-2 py-0.5 text-fg-70 hover:text-fg"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-fg-50 hover:text-danger"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-between border-t border-fg/10 pt-4 text-sm">
              <span className="text-fg-70">Total</span>
              <span className="font-semibold">{formatNaira(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}