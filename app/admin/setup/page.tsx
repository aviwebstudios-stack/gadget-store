"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSetupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, setupKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Setup failed");

      router.push("/admin/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <p className="mb-2 text-xs font-semibold tracking-widest text-white/50">ONE-TIME ADMIN SETUP</p>
      <p className="mb-6 max-w-xs text-center text-xs text-white/40">
        This only works once. After the first admin account is created, this page will refuse to create another.
      </p>

      <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col gap-3">
        <input
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
        />
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Choose a password (8+ characters)"
          className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
        />
        <input
          required
          value={setupKey}
          onChange={(e) => setSetupKey(e.target.value)}
          placeholder="Setup key (from your .env)"
          className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-white py-3 text-sm font-semibold text-black hover:bg-white/85 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Admin Account"}
        </button>
      </form>
    </main>
  );
}
