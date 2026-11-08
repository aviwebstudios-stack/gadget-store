import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Checkout", "Enter your delivery details and pay for your Delux Tech Gadget order with Flutterwave.");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
