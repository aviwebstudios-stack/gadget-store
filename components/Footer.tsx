import Image from "next/image";
import { NewsletterForm } from "@/components/NewsletterForm";

const COLUMNS = [
  {
    heading: "CUSTOMER CARE",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Track Order", href: "/track-order" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    heading: "NAVIGATE",
    links: [
      { label: "Shop", href: "/shop" },
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "On Sale", href: "/on-sale" },
    ],
  },
  {
    heading: "LEGAL",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-black px-6 py-10 text-white sm:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-sm">
          <p className="mb-3 text-xs font-semibold tracking-widest text-white/70">
            SUBSCRIBE TO OUR NEWSLETTER
          </p>
          <NewsletterForm />
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:mt-10 sm:gap-10">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="mb-2 text-[10px] tracking-widest text-white/50 sm:mb-4 sm:text-xs">
                ({col.heading})
              </p>
              <ul className="space-y-1.5 sm:space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    
                     <a href={link.href}
                      className="text-xs text-white/90 hover:text-white sm:text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-14">
          <Image
            src="/logo.png"
            alt="Logo"
            width={280}
            height={100}
            className="h-auto w-[160px] sm:w-[220px]"
          />
        </div>

        <div className="mt-4 flex flex-row items-center justify-between gap-3 text-[10px] text-white/50 sm:mt-6 sm:text-xs">
          <span>© {new Date().getFullYear()} All rights reserved.</span>
          <span>
            POWERED BY{" "}
            
           <a href="https://wa.link/+2348059060395"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-white/80 underline hover:text-white"
            >
              AVI&apos;S WEB STUDIOS
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
