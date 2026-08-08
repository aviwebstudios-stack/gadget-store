import { ShopNav } from "@/components/ShopNav";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/products";
import { Footer } from "@/components/Footer";

const ON_SALE_IDS = [
  "oneplus-12",
  "anker-soundcore-space-a40",
  "fitbit-charge-6",
  "tp-link-kasa-plug",
  "logitech-g502-x",
  "jbl-flip-6",
  "switch-oled",
  "fujifilm-x-t5",
];

export default function OnSalePage() {
  const allProducts = CATEGORIES.flatMap((c) => c.products);
  const onSale = ON_SALE_IDS.map((id) => allProducts.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <ShopNav />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-10 sm:py-14">
        <h1 className="mb-2 text-xl font-semibold sm:text-2xl">On Sale</h1>
        <p className="mb-8 text-sm text-white/60">Deals worth grabbing right now.</p>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-6 lg:grid-cols-5">
          {onSale.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
