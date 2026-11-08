import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ThemedSignUp } from "@/components/ClerkThemed";

export const metadata: Metadata = pageMetadata("Create an account", "Create a Delux Tech Gadget account to keep your orders and tracking IDs in one place.");

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-page">
      <ThemedSignUp />
    </main>
  );
}
