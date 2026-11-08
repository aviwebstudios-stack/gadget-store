import { prisma } from "@/lib/prisma";
import { ShopNav } from "@/components/ShopNav";
import { Footer } from "@/components/Footer";

export default async function PrivacyPage() {
  const record = await prisma.siteContent.findUnique({ where: { key: "privacy" } });
  const content = record?.value ?? "Privacy Policy content coming soon.";

  return (
    <main className="min-h-screen bg-page text-fg">
      <ShopNav />
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-10 sm:py-16">
        <h1 className="mb-6 text-xl font-semibold sm:text-2xl">Privacy Policy</h1>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg-70">{content}</p>
      </div>
      <Footer />
    </main>
  );
}
