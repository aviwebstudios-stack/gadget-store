import Link from "next/link";
import { ShopNav } from "@/components/ShopNav";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="min-h-screen bg-page text-fg">
      <ShopNav />
      <div className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="text-xl font-semibold">We could not find that page</h1>
        <p className="mt-2 text-sm text-fg-60">The link may be old, or the product may have been removed.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-fg px-6 py-2.5 text-sm font-semibold text-page hover:bg-fg/85">
          Go to the shop
        </Link>
      </div>
      <Footer />
    </main>
  );
}
