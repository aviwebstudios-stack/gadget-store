import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { ShopNav } from "@/components/ShopNav";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata("Terms and conditions", "The terms that apply when you buy from Delux Tech Gadget.");

export default async function TermsPage() {
  const record = await prisma.siteContent.findUnique({ where: { key: "terms" } });
  const content = record?.value ?? "Terms & Conditions content coming soon.";

  return (
    <main className="min-h-screen bg-page text-fg">
      <ShopNav />
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-10 sm:py-16">
        <h1 className="mb-6 text-xl font-semibold sm:text-2xl">Terms & Conditions</h1>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg-70">{content}</p>
      </div>
      <Footer />
    </main>
  );
}
