"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  priceMin: number;
  quantity: number;
  isNewArrival: boolean;
  isOnSale: boolean;
  image: string;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [categories, setCategories] = useState<string[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories((data.categories ?? []).map((c: { name: string }) => c.name)));

    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        const found = (data.products ?? []).find((p: Product) => p.id === params.id);
        setProduct(found ?? null);
        if (found) setPreview(found.image);
      });
  }, [params.id]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;
    setSaving(true);
    setError(null);

    try {
      let image = product.image;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json().catch(() => ({}));
        if (!uploadRes.ok) throw new Error(uploadData.error ?? "Upload failed");
        image = uploadData.url;
      }

      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.priceMin,
          quantity: product.quantity,
          isNewArrival: product.isNewArrival,
          isOnSale: product.isOnSale,
          image,
        }),
      });
      if (!res.ok) throw new Error("Could not save changes");

      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  if (!product) return <p className="text-sm text-white/50">Loading...</p>;

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">Edit Product</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-xs text-white/60">Product image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
          {preview && <img src={preview} alt="Preview" className="mt-3 h-24 w-24 rounded-md object-cover" />}
        </div>

        <input
          required
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm focus:border-white focus:outline-none"
        />

        <textarea
          value={product.description ?? ""}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          rows={4}
          placeholder="Description"
          className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-white/40 focus:border-white focus:outline-none"
        />

        <select
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
          className="rounded-md border border-white/20 bg-black px-4 py-2.5 text-sm focus:border-white focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input
            required
            type="number"
            value={product.priceMin}
            onChange={(e) => setProduct({ ...product, priceMin: Number(e.target.value) })}
            placeholder="Price (₦)"
            className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm focus:border-white focus:outline-none"
          />
          <input
            required
            type="number"
            value={product.quantity}
            onChange={(e) => setProduct({ ...product, quantity: Number(e.target.value) })}
            placeholder="Quantity in stock"
            className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm focus:border-white focus:outline-none"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={product.isNewArrival}
              onChange={(e) => setProduct({ ...product, isNewArrival: e.target.checked })}
            />
            New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={product.isOnSale}
              onChange={(e) => setProduct({ ...product, isOnSale: e.target.checked })}
            />
            On Sale
          </label>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 rounded-full bg-white py-3 text-sm font-semibold text-black hover:bg-white/85 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
