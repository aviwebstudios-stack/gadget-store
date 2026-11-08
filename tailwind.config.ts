import type { Config } from "tailwindcss";

const channel = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        nav: "775px",
      },
      fontFamily: {
        mono: ["var(--font-mono)"],
        sans: ["var(--font-sans)"],
      },
      colors: {
        page: channel("page"),
        canvas: channel("canvas"),
        surface: channel("surface"),
        fg: {
          DEFAULT: channel("fg"),
          90: "var(--fg-90)",
          80: "var(--fg-80)",
          70: "var(--fg-70)",
          60: "var(--fg-60)",
          50: "var(--fg-50)",
        },
        success: channel("success"),
        danger: {
          DEFAULT: channel("danger"),
          hover: channel("danger-hover"),
        },
        warning: channel("warning"),
        caution: channel("caution"),
        info: channel("info"),
        accent: channel("accent"),
      },
    },
  },
  plugins: [],
};
export default config;
