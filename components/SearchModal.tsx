"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, formatNaira } from "@/lib/products";

const ALL_PRODUCTS = CATEGORIES.flatMap((c) => c.products);

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return ALL_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70" onClick={onClose}>
      <div
        className="mx-auto mt-24 w-[92vw] max-w-lg rounded-lg border border-white/15 bg-black p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/15 pb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/50">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-3 max-h-[60vh] overflow-y-auto">
          {query.trim().length >= 2 && results.length === 0 && (
            <p className="py-6 text-center text-sm text-white/40">No products found.</p>
          )}
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              onClick={onClose}
              className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-white/5"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white/5">
                <Image src={product.image} alt={product.name} width={48} height={48} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="line-clamp-1 text-sm text-white/90">{product.name}</p>
                <p className="text-xs text-white/50">{formatNaira(product.priceMin)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
