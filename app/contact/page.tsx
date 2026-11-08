import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ShopNav } from "@/components/ShopNav";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { Logo } from "@/components/Logo";
import { getContactInfo } from "@/lib/store-content-server";
import { displayPhone, telHref, whatsappHref } from "@/lib/store-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContactInfo();
  return pageMetadata(
    "Contact",
    `Visit Delux Tech Gadget at ${c.address}, call ${displayPhone(c.phone)}, message us on WhatsApp or send a message here.`
  );
}

const card = "flex flex-col items-start gap-3 rounded-lg border border-fg/10 p-5 transition-colors hover:border-fg/30";

export default async function ContactPage() {
  const contact = await getContactInfo();
  const cardCount = contact.email ? 4 : 3;

  return (
    <main className="min-h-screen bg-page text-fg">
      <ShopNav />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-10 sm:py-16">
        <div className="flex flex-col items-center text-center">
          <Logo width={200} height={70} className="h-auto w-[150px]" />
          {contact.motto && (
            <p className="mt-4 text-sm italic text-fg-60">&ldquo;{contact.motto}&rdquo;</p>
          )}
        </div>

        <div className={`mt-10 grid gap-4 ${cardCount === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
          <div className={card}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/15 text-info">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-fg-50">Our store</p>
              <p className="mt-1 text-sm text-fg-90">{contact.address}</p>
            </div>
          </div>

          <a href={telHref(contact.phone)} className={card}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/15 text-warning">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-fg-50">Call us</p>
              <p className="mt-1 text-sm text-fg-90">{displayPhone(contact.phone)}</p>
            </div>
          </a>

          <a href={whatsappHref(contact.whatsapp)} target="_blank" rel="noreferrer" className={card}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-fg-50">WhatsApp</p>
              <p className="mt-1 text-sm text-fg-90">{displayPhone(contact.whatsapp)}</p>
            </div>
          </a>

          {contact.email && (
            <a href={`mailto:${contact.email}`} className={card}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 6L2 7" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-fg-50">Email</p>
                <p className="mt-1 break-all text-sm text-fg-90">{contact.email}</p>
              </div>
            </a>
          )}
        </div>

        <div className="mt-12">
          <h2 className="mb-4 text-sm font-semibold text-fg-90">Send us a message</h2>
          <ContactForm />
        </div>
      </div>

      <Footer />
    </main>
  );
}
