import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/CartDrawer";
import { themeInitScript } from "@/lib/theme-script";
import { DEFAULT_SHARE_IMAGE } from "@/lib/seo";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const description =
  "Phones, laptops, cameras, speakers, headsets and consoles from Delux Tech Gadget in Benin City. Pay online with Flutterwave and track your order.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Delux Tech Gadget",
    template: "%s | Delux Tech Gadget",
  },
  description,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Delux Gadget",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon-192.png", type: "image/png", sizes: "192x192" }],
    apple: "/icon-192.png",
  },
  openGraph: {
    type: "website",
    siteName: "Delux Tech Gadget",
    title: "Delux Tech Gadget",
    description,
    locale: "en_NG",
    images: [DEFAULT_SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_SHARE_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`dark ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        </head>
        <body className="bg-canvas text-fg antialiased">
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
