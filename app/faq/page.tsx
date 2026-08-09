import { prisma } from "@/lib/prisma";
import { ShopNav } from "@/components/ShopNav";
import { Footer } from "@/components/Footer";

const DEFAULT_FAQS = [
  { q: "How do I pay for my order?", a: "Payments are processed securely through Flutterwave — you can pay by card, bank transfer, or other supported methods. Pay on delivery is also available in select areas." },
  { q: "Do you offer free shipping?", a: "Yes, all orders ship free nationwide." },
  { q: "How do I track my order?", a: "After checkout, you'll receive a tracking ID. Use the Track Order page with your tracking ID and the email used at checkout, or view all your orders under your account." },
  { q: "Are your products covered by warranty?", a: "Yes, every product comes with manufacturer warranty coverage." },
  { q: "Do I need an account to shop?", a: "You can browse and add items to your cart without an account, but you'll need to sign in to complete checkout so we can keep your order history accessible to you." },
  { q: "How can I contact support?", a: "Visit the Contact page for our phone number, address, and a message form." },
];

export default async function FaqPage() {
  const record = await prisma.siteContent.findUnique({ where: { key: "faq_items" } });
  let faqs = DEFAULT_FAQS;
  if (record?.value) {
    try {
      const parsed = JSON.parse(record.value);
      if (Array.isArray(parsed) && parsed.length > 0) faqs = parsed;
    } catch {}
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <ShopNav />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-10 sm:py-16">
        <h1 className="mb-8 text-xl font-semibold sm:text-2xl">Frequently Asked Questions</h1>

        <div className="flex flex-col divide-y divide-white/10 border-t border-white/10">
          {faqs.map((item, i) => (
            <details key={i} className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-white/90">
                {item.q}
                <span className="ml-4 text-white/40 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}