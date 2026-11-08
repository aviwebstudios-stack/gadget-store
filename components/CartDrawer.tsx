"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/products";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty } = useCart();

  const total = items.reduce((sum, i) => sum + i.priceMin * i.qty, 0);

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-[85vw] max-w-xs flex-col bg-surface text-fg transition-transform duration-300 sm:max-w-sm ${
          isOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-fg/10 px-5 py-4">
          <h2 className="text-sm font-semibold">Your Cart</h2>
          <button onClick={closeCart} aria-label="Close cart" className="text-fg-70 hover:text-fg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="text-sm text-fg-50">Your cart is empty.</p>
          ) : (
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
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="px-2 py-0.5 text-fg-70 hover:text-fg"
                        >
                          −
                        </button>
                        <span className="w-6 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="px-2 py-0.5 text-fg-70 hover:text-fg"
                        >
                          +
                        </button>
                      </div>
                      <button
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
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-fg/10 px-5 py-4">
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-fg-70">Total</span>
              <span className="font-semibold">{formatNaira(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full rounded-full bg-fg py-3 text-center text-sm font-semibold text-page hover:bg-fg/85"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
