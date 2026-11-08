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
  inStock: boolean;
  image: string;
  images: string[];
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [categories, setCategories] = useState<string[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

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
        if (found) {
          setCoverPreview(found.image);
          setGalleryUrls(found.images ?? []);
        }
      });
  }, [params.id]);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setCoverFile(f);
    setCoverPreview(URL.createObjectURL(f));
  }

  function handleGalleryAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setNewGalleryFiles((prev) => [...prev, ...files]);
    setNewGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  }

  function removeExistingGalleryImage(index: number) {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function removeNewGalleryImage(index: number) {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "Upload failed");
    return data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;
    setSaving(true);
    setError(null);

    try {
      let image = product.image;
      if (coverFile) image = await uploadFile(coverFile);

      const newUrls: string[] = [];
      for (const f of newGalleryFiles) {
        newUrls.push(await uploadFile(f));
      }
      const images = [...galleryUrls, ...newUrls];

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
          inStock: product.inStock,
          image,
          images,
        }),
      });
      if (!res.ok) throw new Error("Could not save changes");

      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  if (!product) return <p className="text-sm text-fg-50">Loading...</p>;

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">Edit Product</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-xs text-fg-60">Cover image</label>
          <input type="file" accept="image/*" onChange={handleCoverChange} className="text-sm" />
          {coverPreview && <img src={coverPreview} alt="Cover preview" className="mt-3 h-24 w-24 rounded-md object-cover" />}
        </div>

        <div>
          <label className="mb-1 block text-xs text-fg-60">Gallery photos</label>
          <div className="mb-2 flex flex-wrap gap-2">
            {galleryUrls.map((url, i) => (
              <div key={`existing-${i}`} className="relative h-16 w-16">
                <img src={url} alt={`Gallery ${i + 1}`} className="h-16 w-16 rounded-md object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingGalleryImage(i)}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                >
                  ×
                </button>
              </div>
            ))}
            {newGalleryPreviews.map((src, i) => (
              <div key={`new-${i}`} className="relative h-16 w-16">
                <img src={src} alt={`New ${i + 1}`} className="h-16 w-16 rounded-md object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewGalleryImage(i)}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input type="file" accept="image/*" multiple onChange={handleGalleryAdd} className="text-sm" />
        </div>

        <input
          required
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="rounded-md border border-fg/20 bg-transparent px-4 py-2.5 text-sm focus:border-fg focus:outline-none"
        />

        <textarea
          value={product.description ?? ""}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          rows={4}
          placeholder="Description"
          className="rounded-md border border-fg/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-fg-50 focus:border-fg focus:outline-none"
        />

        <select
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
          className="rounded-md border border-fg/20 bg-page px-4 py-2.5 text-sm focus:border-fg focus:outline-none"
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
            className="rounded-md border border-fg/20 bg-transparent px-4 py-2.5 text-sm focus:border-fg focus:outline-none"
          />
          <input
            required
            type="number"
            value={product.quantity}
            onChange={(e) => setProduct({ ...product, quantity: Number(e.target.value) })}
            placeholder="Quantity in stock"
            className="rounded-md border border-fg/20 bg-transparent px-4 py-2.5 text-sm focus:border-fg focus:outline-none"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-fg-80">
          <input
            type="checkbox"
            checked={product.inStock}
            onChange={(e) => setProduct({ ...product, inStock: e.target.checked })}
          />
          Available for purchase (in stock)
        </label>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-fg-80">
            <input
              type="checkbox"
              checked={product.isNewArrival}
              onChange={(e) => setProduct({ ...product, isNewArrival: e.target.checked })}
            />
            New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm text-fg-80">
            <input
              type="checkbox"
              checked={product.isOnSale}
              onChange={(e) => setProduct({ ...product, isOnSale: e.target.checked })}
            />
            On Sale
          </label>
        </div>

        {error && <p className="text-xs text-danger">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 rounded-full bg-fg py-3 text-sm font-semibold text-page hover:bg-fg/85 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}