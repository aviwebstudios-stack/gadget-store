"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatNaira } from "@/lib/format";

type Result = { id: string; slug: string; name: string; image: string; priceMin: number };

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  const [results, setResults] = useState<Result[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const q = query.trim();

  useEffect(() => {
    if (q.length < 2) {
      setResults([]);
      setStatus("idle");
      return;
    }
    const controller = new AbortController();
    setStatus("loading");
    const timer = setTimeout(() => {
      fetch(`/api/products/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => {
          setResults(data.products ?? []);
          setStatus("done");
        })
        .catch((err) => {
          if (err?.name !== "AbortError") setStatus("error");
        });
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70" onClick={onClose}>
      <div
        className="mx-auto mt-24 w-[92vw] max-w-lg rounded-lg border border-fg/15 bg-surface p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-fg/15 pb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg-50">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-sm text-fg placeholder:text-fg-50 focus:outline-none"
          />
          <button onClick={onClose} className="text-fg-50 hover:text-fg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-3 max-h-[60vh] overflow-y-auto">
          {status === "loading" && results.length === 0 && (
            <p className="py-6 text-center text-sm text-fg-50">Searching...</p>
          )}
          {status === "done" && results.length === 0 && (
            <p className="py-6 text-center text-sm text-fg-50">No products match &ldquo;{q}&rdquo;.</p>
          )}
          {status === "error" && (
            <p className="py-6 text-center text-sm text-danger">Search is not working right now. Try again.</p>
          )}
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-fg/5"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-fg/5">
                <Image src={product.image} alt={product.name} width={48} height={48} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="line-clamp-1 text-sm text-fg-90">{product.name}</p>
                <p className="text-xs text-fg-50">{formatNaira(product.priceMin)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
