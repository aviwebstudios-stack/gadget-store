"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-4 border-b border-fg/30 pb-2">
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={status === "sent" ? "Subscribed!" : "Your email"}
        className="w-full bg-transparent text-sm text-fg placeholder:text-fg-50 focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="shrink-0 rounded-md bg-fg/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-fg transition-colors hover:bg-fg/20 disabled:opacity-60"
      >
        {status === "sending" ? "..." : "JOIN"}
      </button>
    </form>
  );
}
