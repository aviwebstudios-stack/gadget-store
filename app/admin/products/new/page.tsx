"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const names = (data.categories ?? []).map((c: { name: string }) => c.name);
        setCategories(names);
        if (names.length > 0) setCategory(names[0]);
      });
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Please choose a product image.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok) throw new Error(uploadData.error ?? "Upload failed");

      const createRes = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          price,
          description,
          quantity,
          isNewArrival,
          isOnSale,
          image: uploadData.url,
        }),
      });
      const createData = await createRes.json().catch(() => ({}));
      if (!createRes.ok) throw new Error(createData.error ?? "Could not save product");

      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">Add Product</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-xs text-white/60">Product image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
          {preview && (
            <img src={preview} alt="Preview" className="mt-3 h-24 w-24 rounded-md object-cover" />
          )}
        </div>

        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
          className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-white/40 focus:border-white focus:outline-none"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Description"
          className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-white/40 focus:border-white focus:outline-none"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price (₦)"
            className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-white/40 focus:border-white focus:outline-none"
          />
          <input
            required
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity in stock"
            className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-white/40 focus:border-white focus:outline-none"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} />
            New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input type="checkbox" checked={isOnSale} onChange={(e) => setIsOnSale(e.target.checked)} />
            On Sale
          </label>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 rounded-full bg-white py-3 text-sm font-semibold text-black hover:bg-white/85 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}