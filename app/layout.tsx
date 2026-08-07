import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/CartDrawer";
import { dark } from "@clerk/themes";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Delux Tech Gadget",
  description: "Phones, laptops, cameras, speakers, headsets, consoles.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Delux Gadget",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "#ffffff", colorBackground: "#0a0a0a" },
      }}
    >
      <html lang="en" className={`${sans.variable} ${mono.variable}`}>
        <body className="bg-[#0a0a0a] text-white antialiased">
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
