"use client";

import { useEffect, useState } from "react";

type Step = 1 | 2 | 3 | 4;

export default function AdminSettingsPage() {
  const [step, setStep] = useState<Step>(1);
  const [token, setToken] = useState("");
  const [botUsername, setBotUsername] = useState("");
  const [chatId, setChatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyConnected, setAlreadyConnected] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.telegramBotToken && data.telegramChatId) {
          setAlreadyConnected(true);
        }
      });
  }, []);

  async function handleVerifyToken() {
    if (!token.trim()) {
      setError("Paste the token first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/telegram/get-bot-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBotUsername(data.username);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckConnection() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/telegram/get-chat-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setChatId(data.chatId);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleFinish() {
    setLoading(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramBotToken: token.trim(), telegramChatId: chatId }),
    });
    setLoading(false);
    setAlreadyConnected(true);
  }

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">Settings</h2>

      <div className="rounded-lg border border-fg/10 p-5">
        <h3 className="mb-4 text-sm font-semibold">Telegram Notifications</h3>

        {alreadyConnected && step === 1 && (
          <div className="mb-4 rounded-md bg-success/10 px-4 py-3 text-sm text-success">
            Telegram is connected. Newsletter signups are sent to this chat.
          </div>
        )}

        <p className="mb-6 text-xs text-fg-50">
          {alreadyConnected ? "To use a different bot, run the steps again." : "Setup takes 4 steps."}
        </p>

        <div className="mb-6 flex gap-2">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full ${step >= n ? "bg-fg" : "bg-fg/15"}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <p className="mb-4 text-sm text-fg-80">
              <strong>Step 1 of 4:</strong> Create your bot
            </p>
            <ol className="mb-5 list-decimal space-y-2 pl-5 text-sm text-fg-70">
              <li>Tap the button below. It opens Telegram.</li>
              <li>Tap <strong className="text-fg">START</strong></li>
              <li>Type <code className="rounded bg-fg/10 px-1.5 py-0.5">/newbot</code> and send it</li>
              <li>Follow the two questions it asks (a name, then a username)</li>
              <li>It sends you a long code. That is your token. Copy it.</li>
            </ol>
            
             <a href="https://t.me/botfather"
              target="_blank"
              rel="noreferrer"
              className="block w-full rounded-full bg-fg py-3 text-center text-sm font-semibold text-page hover:bg-fg/85"
            >
              Open BotFather
            </a>
            <button
              onClick={() => setStep(2)}
              className="mt-3 w-full text-center text-xs text-fg-50 hover:text-fg"
            >
              I already have a token
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="mb-4 text-sm text-fg-80">
              <strong>Step 2 of 4:</strong> Paste your token
            </p>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste the code BotFather gave you"
              className="w-full rounded-md border border-fg/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-fg-50 focus:border-fg focus:outline-none"
            />
            {error && <p className="mt-2 text-xs text-danger">{error}</p>}
            <button
              onClick={handleVerifyToken}
              disabled={loading}
              className="mt-4 w-full rounded-full bg-fg py-3 text-sm font-semibold text-page hover:bg-fg/85 disabled:opacity-60"
            >
              {loading ? "Checking..." : "Check token"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="mb-4 text-sm text-fg-80">
              <strong>Step 3 of 4:</strong> Message your bot
            </p>
            <p className="mb-5 text-sm text-fg-70">
              Tap the button below, then send any message (like &ldquo;hi&rdquo;) to your bot.
              This lets it know where to send you alerts.
            </p>
            
             <a href={`https://t.me/${botUsername}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full rounded-full bg-fg py-3 text-center text-sm font-semibold text-page hover:bg-fg/85"
            >
              Open Your Bot
            </a>
            {error && <p className="mt-3 text-xs text-danger">{error}</p>}
            <button
              onClick={handleCheckConnection}
              disabled={loading}
              className="mt-3 w-full rounded-full border border-fg/25 py-3 text-sm font-semibold text-fg hover:border-fg disabled:opacity-60"
            >
              {loading ? "Checking..." : "Check connection"}
            </button>
          </div>
        )}

        {step === 4 && (
          <div>
            <p className="mb-4 text-sm text-fg-80">
              <strong>Step 4 of 4:</strong> Save
            </p>
            <div className="mb-5 rounded-md bg-success/10 px-4 py-3 text-sm text-success">
              Your bot is connected.
            </div>
            <button
              onClick={handleFinish}
              disabled={loading}
              className="w-full rounded-full bg-fg py-3 text-sm font-semibold text-page hover:bg-fg/85 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save connection"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}