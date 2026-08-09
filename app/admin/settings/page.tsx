"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved">("loading");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setBotToken(data.telegramBotToken ?? "");
        setChatId(data.telegramChatId ?? "");
      })
      .finally(() => setStatus("idle"));
  }, []);

  async function handleSave() {
    setStatus("saving");
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramBotToken: botToken, telegramChatId: chatId }),
    });
    setStatus("saved");
  }

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">Settings</h2>

      <div className="rounded-lg border border-white/10 p-5">
        <h3 className="mb-2 text-sm font-semibold">Telegram Notifications</h3>
        <p className="mb-4 text-xs leading-relaxed text-white/50">
          Connect your own Telegram bot to receive newsletter signup alerts. In Telegram, message{" "}
          <span className="text-white/80">@BotFather</span>, send <span className="text-white/80">/newbot</span>,
          and follow the steps to get a bot token. Then message your new bot once, and visit{" "}
          <span className="text-white/80">
            https://api.telegram.org/bot&lt;YOUR_TOKEN&gt;/getUpdates
          </span>{" "}
          to find your chat ID.
        </p>

        <div className="flex flex-col gap-3">
          <input
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
            placeholder="Telegram Bot Token"
            className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-white/40 focus:border-white focus:outline-none"
          />
          <input
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            placeholder="Telegram Chat ID"
            className="rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-white/40 focus:border-white focus:outline-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="mt-4 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-white/85 disabled:opacity-60"
        >
          {status === "saving" ? "Saving..." : status === "saved" ? "Saved ✓" : "Save"}
        </button>
      </div>
    </div>
  );
}
