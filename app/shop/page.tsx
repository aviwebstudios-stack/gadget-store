"use client";

import { useEffect, useState } from "react";
import { ShopNav } from "@/components/ShopNav";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, Product } from "@/lib/products";
import { Footer } from "@/components/Footer";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const TABS = ["All", ...CATEGORIES.map((c) => c.name)];
const ALL_PRODUCTS_FLAT = CATEGORIES.flatMap((c) => c.products);

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [shuffledAll, setShuffledAll] = useState<Product[] | null>(null);

  useEffect(() => {
    setShuffledAll(shuffle(ALL_PRODUCTS_FLAT));
  }, []);

  const displayedProducts: Product[] =
    activeTab === "All"
      ? (shuffledAll ?? ALL_PRODUCTS_FLAT)
      : (CATEGORIES.find((c) => c.name === activeTab)?.products ?? []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-20 bg-black">
        <ShopNav />

        <div className="overflow-x-auto border-b border-white/10 bg-black [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex max-w-7xl gap-6 px-6 py-3 sm:px-10">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 whitespace-nowrap text-sm transition-colors ${
                  activeTab === tab
                    ? "font-semibold text-white underline underline-offset-4"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {tab}
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
