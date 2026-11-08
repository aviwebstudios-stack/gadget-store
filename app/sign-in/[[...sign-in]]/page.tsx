import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ThemedSignIn } from "@/components/ClerkThemed";

export const metadata: Metadata = pageMetadata("Sign in", "Sign in to see your Delux Tech Gadget orders and tracking IDs.");

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-page">
      <ThemedSignIn />
    </main>
  );
}
