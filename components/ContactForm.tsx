"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="rounded-md bg-success/10 px-4 py-3 text-sm text-success">
        Message sent. We will reply to the email you gave us.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="rounded-md border border-fg/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-fg-50 focus:border-fg focus:outline-none"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="rounded-md border border-fg/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-fg-50 focus:border-fg focus:outline-none"
      />
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        placeholder="How can we help?"
        className="rounded-md border border-fg/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-fg-50 focus:border-fg focus:outline-none"
      />
      {status === "error" && <p className="text-xs text-danger">Could not send. Try again.</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-fg py-3 text-sm font-semibold text-page hover:bg-fg/85 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
