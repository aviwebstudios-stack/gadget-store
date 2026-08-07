import Link from "next/link";

const TABS = [
  { label: "Orders", href: "/admin/orders", icon: "📦" },
  { label: "Products", href: "/admin/products", icon: "🛒" },
  { label: "Content", href: "/admin/content", icon: "📝" },
  { label: "Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black pb-20 text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <h1 className="text-sm font-semibold tracking-wide text-white/90">ADMIN</h1>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">{children}</div>

      <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-white/10 bg-black py-2">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center gap-1 px-4 py-1 text-xs text-white/60 hover:text-white"
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
