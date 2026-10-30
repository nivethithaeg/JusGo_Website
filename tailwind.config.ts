import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        jg: {
          950: "#04170F",
          900: "#0A3D2A",
          800: "#0E5C38",
          600: "#1FA94B",
          400: "#56C271",
          lime: "#9BE22F",
        },
        navy: {
          900: "#0F1A2B",
        },
        mist: {
          50: "#F6F8F7",
        },
        ink: {
          900: "#10201A",
        },
        info: {
          500: "#4F86E8",
        },
        amber: {
          500: "#E8A23C",
        },
        danger: {
          100: "#FCEAEA",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        lime: "0 0 120px rgba(155,226,47,.35)",
        card: "0 10px 40px -15px rgba(10,61,42,.25)",
      },
      letterSpacing: {
        label: "0.18em",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(.22,1,.36,1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.35", transform: "scale(.92)" },
          "50%": { opacity: "0.85", transform: "scale(1.08)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(14px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(14px) rotate(-360deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        glow: "glow 4s ease-in-out infinite",
        orbit: "orbit 15s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
