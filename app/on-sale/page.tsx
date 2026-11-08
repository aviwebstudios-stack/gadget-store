import { prisma } from "@/lib/prisma";
import { ShopNav } from "@/components/ShopNav";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";

export default async function OnSalePage() {
  const products = await prisma.product.findMany({
    where: { isOnSale: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-page text-fg">
      <ShopNav />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-10 sm:py-14">
        <h1 className="mb-2 text-xl font-semibold sm:text-2xl">On Sale</h1>
        <p className="mb-8 text-sm text-fg-60">Deals worth grabbing right now.</p>

        {products.length === 0 ? (
          <p className="text-sm text-fg-50">No sale items right now — check back soon.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-6 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}