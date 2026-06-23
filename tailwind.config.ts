import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // ROWAD Modern Engineering — official brand palette.
        // Slate navy (wordmark) scaled into deep-navy dark surfaces.
        navy: {
          50: "#eef1f6",
          100: "#d9e0ec",
          200: "#b3c1d6",
          300: "#8597b4",
          400: "#5a6f92",
          500: "#3c5174",
          600: "#2b3b57",
          700: "#202d44",
          800: "#162033",
          900: "#0c1424",
          950: "#070d18",
        },
        graphite: {
          50: "#f5f6f8",
          100: "#e9ebef",
          200: "#d2d6dd",
          300: "#aeb4bf",
          400: "#7f8795",
          500: "#5c6473",
          600: "#474e5b",
          700: "#363c47",
          800: "#23272f",
          900: "#15181d",
        },
        steel: {
          DEFAULT: "#5c6e88",
          light: "#8a99ad",
        },
        // Engineering accent — safety orange (primary action / highlight).
        accent: {
          DEFAULT: "#E8531A",
          hover: "#cf4715",
          soft: "#fcebe3",
          glow: "#ff6a33",
        },
        // Construction yellow — used sparingly for emphasis / caution.
        construction: {
          DEFAULT: "#E8A400",
          soft: "#fbf0d5",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: [
          "var(--font-plex)",
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-plex-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(12,20,36,0.04), 0 10px 30px -16px rgba(12,20,36,0.18)",
        elevated: "0 20px 50px -16px rgba(12,20,36,0.28)",
        glow: "0 0 0 1px rgba(232,83,26,0.35), 0 10px 40px -10px rgba(232,83,26,0.45)",
        "inset-hair": "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        shimmer: "shimmer 1.6s infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
