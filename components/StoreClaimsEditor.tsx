"use client";

import { useEffect, useState } from "react";
import { CLAIM_LABELS, DEFAULT_CLAIMS, parseClaims, type StoreClaims } from "@/lib/store-content";

const KEYS = Object.keys(DEFAULT_CLAIMS) as (keyof StoreClaims)[];

export function StoreClaimsEditor() {
  const [claims, setClaims] = useState<StoreClaims>(DEFAULT_CLAIMS);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    fetch("/api/content?key=store_claims")
      .then((res) => res.json())
      .then((data) => setClaims(parseClaims(data.value)))
      .finally(() => setLoaded(true));
  }, []);

  function update(key: keyof StoreClaims, patch: Partial<StoreClaims[keyof StoreClaims]>) {
    setClaims((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
    setStatus("idle");
  }

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "store_claims", value: JSON.stringify(claims) }),
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mb-6 rounded-lg border border-fg/10 p-5">
      <h3 className="mb-1 text-sm font-semibold">Store promises</h3>
      <p className="mb-5 text-xs text-fg-50">
        Shown under the price on every product page and used in the default FAQ answers. Untick one to hide it everywhere.
      </p>

      {!loaded ? (
        <p className="text-sm text-fg-50">Loading...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {KEYS.map((key) => (
            <div key={key}>
              <label className="mb-1.5 flex items-center gap-2 text-xs text-fg-70">
                <input
                  type="checkbox"
                  checked={claims[key].enabled}
                  onChange={(e) => update(key, { enabled: e.target.checked })}
                />
                Show {CLAIM_LABELS[key].toLowerCase()}
              </label>
              <input
                value={claims[key].text}
                onChange={(e) => update(key, { text: e.target.value })}
                disabled={!claims[key].enabled}
                aria-label={`${CLAIM_LABELS[key]} text`}
                placeholder={DEFAULT_CLAIMS[key].text}
                className="w-full rounded-md border border-fg/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-fg-50 focus:border-fg focus:outline-none disabled:opacity-50"
              />
            </div>
          ))}
          {status === "error" && <p className="text-xs text-danger">Could not save. Check you are still signed in and try again.</p>}
          <button
            onClick={save}
            disabled={status === "saving"}
            className="mt-1 rounded-full bg-fg px-6 py-2.5 text-sm font-semibold text-page hover:bg-fg/85 disabled:opacity-60"
          >
            {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : "Save store promises"}
          </button>
        </div>
      )}
    </div>
  );
}
