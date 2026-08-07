"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useCart } from "@/lib/cart-context";
import { SearchModal } from "@/components/SearchModal";

const LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
  { label: "Track Order", href: "/track-order" },
  { label: "FAQ", href: "/faq" },
];

export function ShopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalCount, openCart } = useCart();
  const pathname = usePathname();

  function isLinkActive(href: string) {
    if (href === "/shop") return pathname.startsWith("/shop");
    return pathname === href;
  }

  return (
    <header className="border-b border-white/10 bg-black">
      <div className="relative flex items-center justify-between px-4 py-4 nav:px-10">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          className="text-white nav:hidden"
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>

        <nav className="hidden items-center gap-6 text-sm nav:flex">
          {LINKS.map((link) => {
            const isActive = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative inline-block py-1 transition-colors ${
                  isActive ? "font-semibold text-white" : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] bg-white transition-all duration-300 ease-out ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <Image src="/logo.png" alt="Logo" width={140} height={50} className="h-auto w-[90px] nav:w-[110px]" />
        </Link>

        <div className="flex items-center gap-4 nav:gap-5">
          <button aria-label="Search" onClick={() => setSearchOpen(true)} className="text-white/80 hover:text-white">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          <SignedIn>
            <Link href="/account/orders" className="text-white/80 hover:text-white">
              <UserButton
                afterSignOutUrl="/"
                appearance={{ elements: { avatarBox: "h-6 w-6" } }}
              />
            </Link>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" aria-label="Sign in" className="text-white/80 hover:text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          </SignedOut>

          <button aria-label="Cart" onClick={openCart} className="flex items-center gap-1.5 text-white/80 hover:text-white">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="hidden text-xs font-medium nav:inline">CART ({totalCount})</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-white/10 bg-black px-4 py-3 nav:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`py-2 text-sm ${
                isLinkActive(link.href) ? "font-semibold text-white underline underline-offset-4" : "text-white/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
