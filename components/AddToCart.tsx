"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { ProductCard } from "@/components/ProductCard";

type Product = {
  id: string;
  slug: string;
  name: string;
  image: string;
  priceMin: number;
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function AddToCart({
  product,
  otherProducts,
  maxQty,
  outOfStock,
}: {
  product: Product;
  otherProducts: Product[];
  maxQty: number;
  outOfStock: boolean;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  function handleAdd() {
    if (outOfStock) return;
    addItem(
      { id: product.id, name: product.name, image: product.image, priceMin: product.priceMin },
      qty
    );
    setSuggestions(shuffle(otherProducts).slice(0, 6));
    setAdded(true);
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {!outOfStock && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-fg-70">Quantity</span>
            <div className="flex items-center rounded-md border border-fg/20">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 text-fg-80 hover:text-fg"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                disabled={qty >= maxQty}
                className="px-3 py-1.5 text-fg-80 hover:text-fg disabled:opacity-30"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="w-full rounded-full bg-fg py-3 text-sm font-semibold text-page transition-colors hover:bg-fg/85 disabled:cursor-not-allowed disabled:bg-fg/30 disabled:text-fg-60"
        >
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>

        {added && <p className="text-sm text-success">✓ Added to cart</p>}
      </div>

      {added && suggestions.length > 0 && (
        <div className="mt-10 border-t border-fg/10 pt-6">
          <h2 className="mb-4 text-sm font-semibold text-fg-90">You may also like</h2>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}