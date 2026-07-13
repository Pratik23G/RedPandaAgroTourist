import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FBF8F1",
          100: "#F3E8D4",
          200: "#E8D8B8", // brand background, warmer/richer than before
        },
        forest: {
          500: "#3A5C48",
          600: "#2B4A3A",
          700: "#1F3A2C", // brand deep green
          800: "#142A1F",
          900: "#0D1D15", // near-black green, for max-contrast text/bg
        },
        rust: {
          400: "#E2934F",
          500: "#C85A1E", // brand red-panda accent, terracotta not pastel
          600: "#9B4315",
          700: "#7A3410",
        },
        gold: {
          400: "#DDB759",
          500: "#C99A2E", // secondary accent — badges, dividers, sparing use
          600: "#A67C1F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
        devanagari: ["var(--font-devanagari)"],
      },
      borderRadius: {
        lg: "0.75rem",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
} satisfies Config;
