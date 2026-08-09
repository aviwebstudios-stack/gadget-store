import { SignIn } from "@clerk/nextjs";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <p className="mb-6 text-xs font-semibold tracking-widest text-white/50">ADMIN ACCESS</p>
      <SignIn
        appearance={{ variables: { colorPrimary: "#ffffff" } }}
        forceRedirectUrl="/admin/orders"
        signUpUrl="/sign-up"
      />
    </main>
  );
}
