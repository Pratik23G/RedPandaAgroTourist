import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FBF9F5",
          100: "#F4EFE6",
          200: "#EAE3D6", // brand background
        },
        forest: {
          600: "#2F4B3C",
          700: "#243A2F", // brand deep green
          800: "#1A2B23",
        },
        rust: {
          400: "#E08A4F",
          500: "#D06A2C", // brand red-panda accent
          600: "#B0511E",
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
    },
  },
  plugins: [],
} satisfies Config;
