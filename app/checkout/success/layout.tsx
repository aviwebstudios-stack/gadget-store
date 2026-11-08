import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Payment status", "Confirmation of your Delux Tech Gadget payment and your tracking ID.");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
