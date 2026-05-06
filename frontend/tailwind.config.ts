import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10231a",
        moss: "#dcebd6",
        field: "#f6f4ed",
        pine: "#1f4f3f",
        amber: "#c9822b",
        line: "#d5ddcf"
      },
      boxShadow: {
        card: "0 18px 50px rgba(16, 35, 26, 0.08)"
      },
      fontFamily: {
        sans: ["Manrope", "Avenir Next", "Segoe UI", "sans-serif"],
        display: ["Space Grotesk", "Avenir Next Condensed", "Trebuchet MS", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
