import Link from "next/link";

const LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Contact", href: "/contact" },
  { label: "Track Order", href: "/track-order" },
  { label: "FAQ", href: "/faq" },
];

export function NavLinks() {
  return (
    <nav className="pointer-events-auto flex flex-col items-center gap-3 text-lg">
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href} className="group relative inline-block text-white/85 transition-colors hover:text-white">
          {link.label}
          <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
        </Link>
      ))}
    </nav>
  );
}