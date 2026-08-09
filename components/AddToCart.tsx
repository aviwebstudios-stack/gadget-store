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
}: {
  product: Product;
  otherProducts: Product[];
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  function handleAdd() {
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
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/70">Quantity</span>
          <div className="flex items-center rounded-md border border-white/20">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-1.5 text-white/80 hover:text-white"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-sm">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="px-3 py-1.5 text-white/80 hover:text-white"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="w-full rounded-full bg-white py-3 text-sm font-semibold text-black transition-colors hover:bg-white/85"
        >
          Add to Cart
        </button>

        {added && <p className="text-sm text-green-400">✓ Added to cart</p>}
      </div>

      {added && suggestions.length > 0 && (
        <div className="mt-10 border-t border-white/10 pt-6">
          <h2 className="mb-4 text-sm font-semibold text-white/90">You may also like</h2>
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