import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { ShopNav } from "@/components/ShopNav";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = pageMetadata("New arrivals", "Phones, laptops, cameras and other gadgets most recently added to Delux Tech Gadget.");

export default async function NewArrivalsPage() {
  const products = await prisma.product.findMany({
    where: { isNewArrival: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-page text-fg">
      <ShopNav />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-10 sm:py-14">
        <h1 className="mb-2 text-xl font-semibold sm:text-2xl">New Arrivals</h1>
        <p className="mb-8 text-sm text-fg-60">Products we added most recently.</p>

        {products.length === 0 ? (
          <p className="text-sm text-fg-50">Nothing is marked as new right now. Check back soon.</p>
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