"use client";

import { useSyncExternalStore } from "react";
import { dark } from "@clerk/themes";
import { THEME_STORAGE_KEY } from "@/lib/theme-script";

export type Theme = "dark" | "light";

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "dark";
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  root.classList.toggle("dark", theme === "dark");
  window.setTimeout(() => root.classList.remove("theme-transition"), 250);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
  listeners.forEach((l) => l());
}

export function clerkAppearance(theme: Theme) {
  return theme === "dark"
    ? {
        baseTheme: dark,
        variables: { colorPrimary: "#ffffff", colorBackground: "#0a0a0a" },
      }
    : {
        variables: {
          colorPrimary: "#1c1916",
          colorTextOnPrimaryBackground: "#f5f1ea",
          colorBackground: "#fbf8f3",
          colorText: "#1c1916",
        },
      };
}
