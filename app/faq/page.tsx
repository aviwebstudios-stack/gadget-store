import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { ShopNav } from "@/components/ShopNav";
import { Footer } from "@/components/Footer";
import { getStoreClaims } from "@/lib/store-content-server";
import { defaultFaqs, type FaqItem } from "@/lib/store-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata("FAQ", "Answers about paying, shipping, warranty, accounts and tracking orders at Delux Tech Gadget.");

export default async function FaqPage() {
  const record = await prisma.siteContent.findUnique({ where: { key: "faq_items" } });
  let faqs: FaqItem[] = defaultFaqs(await getStoreClaims());
  if (record?.value) {
    try {
      const parsed = JSON.parse(record.value);
      if (Array.isArray(parsed) && parsed.length > 0) faqs = parsed;
    } catch {}
  }

  return (
    <main className="min-h-screen bg-page text-fg">
      <ShopNav />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-10 sm:py-16">
        <h1 className="mb-8 text-xl font-semibold sm:text-2xl">Frequently Asked Questions</h1>

        <div className="flex flex-col divide-y divide-fg/10 border-t border-fg/10">
          {faqs.map((item, i) => (
            <details key={i} className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-fg-90">
                {item.q}
                <span className="ml-4 text-fg-50 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-fg-60">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}