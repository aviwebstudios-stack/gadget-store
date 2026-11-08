"use client";

import { setTheme, useTheme } from "@/lib/theme";

export function ThemeToggle({ className = "", showLabel = false }: { className?: string; showLabel?: boolean }) {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${next} mode`;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className={`flex items-center gap-2 ${className}`}
    >
      {/* Icons are picked by CSS so the right one shows before hydration */}
      <svg className="hidden dark:block" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      <svg className="block dark:hidden" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
      {showLabel && (
        <span className="text-sm">
          <span className="hidden dark:inline">Light mode</span>
          <span className="dark:hidden">Dark mode</span>
        </span>
      )}
    </button>
  );
}
