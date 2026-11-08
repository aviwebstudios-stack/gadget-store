"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatNaira } from "@/lib/format";

type Product = {
  id: string;
  slug: string;
  name: string;
  image: string;
  category: string;
  priceMin: number;
  priceMax: number;
  inStock: boolean;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleStock(id: string, inStock: boolean) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, inStock } : p)));
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, inStock }),
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  if (loading) return <p className="text-sm text-fg-50">Loading products...</p>;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Products</h2>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-fg px-4 py-2 text-xs font-semibold text-page hover:bg-fg/85"
        >
          + Add Product
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-lg border border-fg/10 p-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-fg/5">
              <Image src={p.image} alt={p.name} width={56} height={56} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="line-clamp-1 text-sm font-medium">{p.name}</p>
              <p className="text-xs text-fg-50">{p.category} · {formatNaira(p.priceMin)}</p>
            </div>
            <label className="flex items-center gap-1.5 text-xs text-fg-60">
              <input
                type="checkbox"
                checked={p.inStock}
                onChange={(e) => toggleStock(p.id, e.target.checked)}
              />
              In stock
            </label>
            <Link href={`/admin/products/${p.id}`} className="text-xs text-fg-60 hover:text-fg">
              Edit
            </Link>
            <button onClick={() => handleDelete(p.id)} className="text-xs text-danger hover:text-danger-hover">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}