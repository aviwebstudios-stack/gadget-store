"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");

      router.push("/admin/orders");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <p className="mb-6 text-xs font-semibold tracking-widest text-white/50">ADMIN ACCESS</p>

      <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col gap-3">
        <input
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
        />
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-white py-3 text-sm font-semibold text-black hover:bg-white/85 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}