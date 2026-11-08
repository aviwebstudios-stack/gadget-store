import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Track your order", "Check the status of a Delux Tech Gadget order with your tracking ID and the email you used at checkout.");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
