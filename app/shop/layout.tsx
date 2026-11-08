import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Shop", "Shop phones, laptops, cameras, speakers, headsets and consoles at Delux Tech Gadget, with prices in naira.");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
