"use client";

import { useEffect, useState } from "react";

const PAGES = [
  { key: "terms", label: "Terms & Conditions" },
  { key: "privacy", label: "Privacy Policy" },
];

export default function AdminContentPage() {
  const [selected, setSelected] = useState(PAGES[0].key);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved">("idle");

  useEffect(() => {
    setStatus("loading");
    fetch(`/api/content?key=${selected}`)
      .then((res) => res.json())
      .then((data) => setValue(data.value ?? ""))
      .finally(() => setStatus("idle"));
  }, [selected]);

  async function handleSave() {
    setStatus("saving");
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: selected, value }),
    });
    setStatus("saved");
  }

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">Content</h2>

      <div className="mb-4 flex gap-3">
        {PAGES.map((p) => (
          <button
            key={p.key}
            onClick={() => setSelected(p.key)}
            className={`rounded-full px-4 py-1.5 text-xs ${
              selected === p.key ? "bg-white text-black" : "border border-white/20 text-white/70"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={16}
        className="w-full rounded-md border border-white/20 bg-transparent p-4 text-sm text-white focus:border-white focus:outline-none"
      />

      <button
        onClick={handleSave}
        disabled={status === "saving"}
        className="mt-4 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-white/85 disabled:opacity-60"
      >
        {status === "saving" ? "Saving..." : status === "saved" ? "Saved ✓" : "Save"}
      </button>
    </div>
  );
}
