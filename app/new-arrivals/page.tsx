import { ShopNav } from "@/components/ShopNav";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/products";
import { Footer } from "@/components/Footer";

const NEW_ARRIVAL_IDS = [
  "iphone-15-pro",
  "macbook-air-m3",
  "galaxy-s24-ultra",
  "ps5-slim",
  "sony-alpha-7-iv",
  "apple-watch-series-9",
  "airpods-pro-2",
  "meta-quest-3",
  "dji-osmo-pocket-3",
  "rog-ally",
];

export default function NewArrivalsPage() {
  const allProducts = CATEGORIES.flatMap((c) => c.products);
  const newArrivals = NEW_ARRIVAL_IDS.map((id) => allProducts.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <ShopNav />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-10 sm:py-14">
        <h1 className="mb-2 text-xl font-semibold sm:text-2xl">New Arrivals</h1>
        <p className="mb-8 text-sm text-white/60">The latest additions to the store.</p>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-6 lg:grid-cols-5">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
