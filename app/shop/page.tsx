"use client";

import { useEffect, useMemo, useState } from "react";
import { ShopNav } from "@/components/ShopNav";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";

type Product = {
  id: string;
  slug: string;
  name: string;
  image: string;
  priceMin: number;
  priceMax: number;
};
type Category = { name: string; products: Product[] };

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function ShopPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [shuffledAll, setShuffledAll] = useState<Product[] | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []));
  }, []);

  const allFlat = useMemo(() => categories.flatMap((c) => c.products), [categories]);

  useEffect(() => {
    if (allFlat.length > 0) setShuffledAll(shuffle(allFlat));
  }, [allFlat]);

  const tabs = ["All", ...categories.map((c) => c.name)];

  const displayedProducts: Product[] =
    activeTab === "All"
      ? shuffledAll ?? allFlat
      : categories.find((c) => c.name === activeTab)?.products ?? [];

  return (
    <main className="min-h-screen bg-page text-fg">
      <div className="sticky top-0 z-20 bg-page">
        <ShopNav />

        <div className="overflow-x-auto border-b border-fg/10 bg-page [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex max-w-7xl gap-6 px-6 py-3 sm:px-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`group relative inline-block shrink-0 whitespace-nowrap py-1 text-sm transition-colors ${
                  activeTab === tab
                    ? "font-semibold text-fg"
                    : "text-fg-50 hover:text-fg-80"
                }`}
              >
                {tab}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] bg-fg transition-all duration-300 ease-out ${
                    activeTab === tab ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>
            ))}
            <div className="w-6 shrink-0 sm:w-10" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-10 sm:py-12">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-6 lg:grid-cols-5">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}