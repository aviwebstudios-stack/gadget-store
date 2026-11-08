import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/products";
import { ShopNav } from "@/components/ShopNav";
import { ProductGallery } from "@/components/ProductGallery";
import { AddToCart } from "@/components/AddToCart";
import { BackButton } from "@/components/BackButton";
import { Footer } from "@/components/Footer";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.id } });
  if (!product) notFound();

  const otherProducts = await prisma.product.findMany({
    where: { id: { not: product.id } },
    take: 20,
  });

  const images = [product.image, ...product.images];
  const outOfStock = !product.inStock || product.quantity <= 0;

  return (
    <main className="min-h-screen bg-page text-fg">
      <ShopNav />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-10 sm:py-12">
        <BackButton />
        <p className="mb-4 text-xs text-fg-50">
          <a href="/shop" className="hover:text-fg">Shop</a> / {product.category}
        </p>

        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={images} name={product.name} />

          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">{product.name}</h1>

            <p className="mt-3 text-lg text-fg-90">{formatNaira(product.priceMin)}</p>

            {outOfStock ? (
              <p className="mt-2 inline-block rounded-full bg-danger/15 px-3 py-1 text-xs text-danger">
                Out of Stock
              </p>
            ) : product.quantity <= 3 ? (
              <p className="mt-2 inline-block rounded-full bg-warning/15 px-3 py-1 text-xs text-warning">
                Only {product.quantity} left
              </p>
            ) : (
              <p className="mt-2 inline-block rounded-full bg-success/15 px-3 py-1 text-xs text-success">
                In Stock
              </p>
            )}

            <div className="mt-6">
              <AddToCart product={product} otherProducts={otherProducts} maxQty={product.quantity} outOfStock={outOfStock} />
            </div>

            <div className="mt-10 border-t border-fg/10 pt-6">
              <h2 className="mb-2 text-sm font-semibold text-fg-90">Description</h2>
              <p className="text-sm leading-relaxed text-fg-60">
                {product.description || `Genuine ${product.name}. Brand new and factory sealed, backed by manufacturer warranty. Fast, tracked shipping on every order.`}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2 text-sm text-fg-60">
              <p>✓ Free shipping on all orders</p>
              <p>✓ Manufacturer warranty included</p>
              <p>✓ Pay on delivery available in select areas</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}