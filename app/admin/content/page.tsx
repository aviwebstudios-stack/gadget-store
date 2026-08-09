"use client";

import { useEffect, useState } from "react";

const TEXT_PAGES = [
  { key: "terms", label: "Terms & Conditions" },
  { key: "privacy", label: "Privacy Policy" },
];

type Category = { id: string; name: string };
type FaqItem = { q: string; a: string };

export default function AdminContentPage() {
  const [section, setSection] = useState<"terms" | "privacy" | "categories" | "contact" | "faq">("terms");

  const [textValue, setTextValue] = useState("");
  const [textStatus, setTextStatus] = useState<"idle" | "saving" | "saved">("idle");

  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [contact, setContact] = useState({ motto: "", address: "", phone: "", whatsapp: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "saving" | "saved">("idle");

  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [faqStatus, setFaqStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    if (section === "terms" || section === "privacy") {
      fetch(`/api/content?key=${section}`)
        .then((res) => res.json())
        .then((data) => setTextValue(data.value ?? ""));
    }
    if (section === "categories") loadCategories();
    if (section === "contact") {
      fetch("/api/content?key=contact")
        .then((res) => res.json())
        .then((data) => {
          try {
            setContact(JSON.parse(data.value));
          } catch {
            setContact({ motto: "", address: "", phone: "", whatsapp: "" });
          }
        });
    }
    if (section === "faq") {
      fetch("/api/content?key=faq_items")
        .then((res) => res.json())
        .then((data) => {
          try {
            setFaqItems(JSON.parse(data.value));
          } catch {
            setFaqItems([]);
          }
        });
    }
  }, [section]);

  function loadCategories() {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []));
  }

  async function saveText() {
    setTextStatus("saving");
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: section, value: textValue }),
    });
    setTextStatus("saved");
  }

  async function addCategory() {
    if (!newCategoryName.trim()) return;
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName.trim() }),
    });
    setNewCategoryName("");
    loadCategories();
  }

  async function renameCategory(id: string, name: string) {
    await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name }),
    });
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category tab?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  async function saveContact() {
    setContactStatus("saving");
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "contact", value: JSON.stringify(contact) }),
    });
    setContactStatus("saved");
  }

  async function saveFaq() {
    setFaqStatus("saving");
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "faq_items", value: JSON.stringify(faqItems) }),
    });
    setFaqStatus("saved");
  }

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">Content</h2>

      <div className="mb-6 flex flex-wrap gap-2">
        {TEXT_PAGES.map((p) => (
          <button
            key={p.key}
            onClick={() => setSection(p.key as "terms" | "privacy")}
            className={`rounded-full px-4 py-1.5 text-xs ${
              section === p.key ? "bg-white text-black" : "border border-white/20 text-white/70"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => setSection("categories")}
          className={`rounded-full px-4 py-1.5 text-xs ${
            section === "categories" ? "bg-white text-black" : "border border-white/20 text-white/70"
          }`}
        >
          Shop Tabs
        </button>
        <button
          onClick={() => setSection("contact")}
          className={`rounded-full px-4 py-1.5 text-xs ${
            section === "contact" ? "bg-white text-black" : "border border-white/20 text-white/70"
          }`}
        >
          Contact Us
        </button>
        <button
          onClick={() => setSection("faq")}
          className={`rounded-full px-4 py-1.5 text-xs ${
            section === "faq" ? "bg-white text-black" : "border border-white/20 text-white/70"
          }`}
        >
          FAQ
        </button>
      </div>

      {(section === "terms" || section === "privacy") && (
        <>
          <textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            rows={16}
            className="w-full rounded-md border border-white/20 bg-transparent p-4 text-sm text-white focus:border-white focus:outline-none"
          />
          <button
            onClick={saveText}
            disabled={textStatus === "saving"}
            className="mt-4 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-white/85 disabled:opacity-60"
          >
            {textStatus === "saving" ? "Saving..." : textStatus === "saved" ? "Saved ✓" : "Save"}
          </button>
        </>
      )}

      {section === "categories" && (
        <div>
          <div className="mb-4 flex gap-2">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
              className="flex-1 rounded-md border border-white/20 bg-transparent px-4 py-2 text-sm focus:border-white focus:outline-none"
            />
            <button onClick={addCategory} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black">
              Add
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center gap-2 rounded-md border border-white/10 p-2">
                <input
                  defaultValue={c.name}
                  onBlur={(e) => renameCategory(c.id, e.target.value)}
                  className="flex-1 bg-transparent px-2 text-sm focus:outline-none"
                />
                <button onClick={() => deleteCategory(c.id)} className="text-xs text-red-400 hover:text-red-300">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === "contact" && (
        <div className="flex flex-col gap-3">
          <input
            value={contact.motto}
            onChange={(e) => setContact({ ...contact, motto: e.target.value })}
            placeholder="Motto / tagline"
            className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm focus:border-white focus:outline-none"
          />
          <input
            value={contact.address}
            onChange={(e) => setContact({ ...contact, address: e.target.value })}
            placeholder="Store address"
            className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm focus:border-white focus:outline-none"
          />
          <input
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            placeholder="Phone number"
            className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm focus:border-white focus:outline-none"
          />
          <input
            value={contact.whatsapp}
            onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
            placeholder="WhatsApp number (e.g. 2347070531239)"
            className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm focus:border-white focus:outline-none"
          />
          <button
            onClick={saveContact}
            disabled={contactStatus === "saving"}
            className="mt-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-white/85 disabled:opacity-60"
          >
            {contactStatus === "saving" ? "Saving..." : contactStatus === "saved" ? "Saved ✓" : "Save"}
          </button>
        </div>
      )}

      {section === "faq" && (
        <div>
          <div className="flex flex-col gap-4">
            {faqItems.map((item, i) => (
              <div key={i} className="rounded-md border border-white/10 p-3">
                <input
                  value={item.q}
                  onChange={(e) => {
                    const next = [...faqItems];
                    next[i] = { ...next[i], q: e.target.value };
                    setFaqItems(next);
                  }}
                  placeholder="Question"
                  className="mb-2 w-full bg-transparent text-sm font-medium focus:outline-none"
                />
                <textarea
                  value={item.a}
                  onChange={(e) => {
                    const next = [...faqItems];
                    next[i] = { ...next[i], a: e.target.value };
                    setFaqItems(next);
                  }}
                  rows={2}
                  placeholder="Answer"
                  className="w-full bg-transparent text-sm text-white/70 focus:outline-none"
                />
                <button
                  onClick={() => setFaqItems(faqItems.filter((_, idx) => idx !== i))}
                  className="mt-2 text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setFaqItems([...faqItems, { q: "", a: "" }])}
            className="mt-4 rounded-full border border-white/25 px-4 py-2 text-xs hover:border-white"
          >
            + Add Question
          </button>
          <button
            onClick={saveFaq}
            disabled={faqStatus === "saving"}
            className="mt-4 block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-white/85 disabled:opacity-60"
          >
            {faqStatus === "saving" ? "Saving..." : faqStatus === "saved" ? "Saved ✓" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}