import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          950: "#06080c",
          900: "#0b1017",
          850: "#111725",
          800: "#151d2e",
          700: "#20293b"
        },
        ember: {
          300: "#f3be76",
          400: "#d99a53",
          500: "#b57731"
        },
        moss: {
          300: "#8da996",
          400: "#68846f",
          500: "#4a6250"
        },
        steel: {
          200: "#b5c0d4",
          300: "#96a4bc",
          400: "#72829f"
        }
      },
      boxShadow: {
        panel: "0 20px 80px rgba(0, 0, 0, 0.35)",
        glow: "0 0 0 1px rgba(243, 190, 118, 0.2), 0 20px 80px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at top, rgba(243,190,118,0.10), transparent 42%), radial-gradient(circle at bottom, rgba(104,132,111,0.18), transparent 40%)"
      }
    }
  },
  plugins: []
};

export default config;
