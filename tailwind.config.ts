import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#3A7D44",
          "primary-dark": "#2D6235",
          "primary-light": "#4A9956",
          soft: "#E7F3E8",
          cream: "#FAF7EF",
          earth: "#8B6F47",
          "earth-light": "#A8916B",
          dark: "#1F2A24",
          muted: "#7A857C",
          warning: "#F4C95D",
          "warning-light": "#FDF3D7",
          danger: "#F28B82",
          "danger-light": "#FDECEA",
          info: "#5B9BD5",
          "info-light": "#E8F0FB",
        },
        surface: {
          0: "#FFFFFF",
          50: "#FAFAF8",
          100: "#F5F3EF",
          200: "#EBE8E0",
          300: "#D6D3CC",
          400: "#A8A29E",
          500: "#78716C",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(31,42,36,0.04), 0 1px 2px rgba(31,42,36,0.03)",
        "card-hover":
          "0 8px 24px rgba(31,42,36,0.08), 0 2px 8px rgba(31,42,36,0.04)",
        "card-lg":
          "0 4px 12px rgba(31,42,36,0.06), 0 1px 4px rgba(31,42,36,0.04)",
        glow: "0 0 24px rgba(58,125,68,0.12)",
        "nav": "0 -1px 8px rgba(31,42,36,0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.35s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.25s ease-out",
        "pulse-soft": "pulseSoft 2.5s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "check-pop": "checkPop 0.35s ease-out",
        "confetti": "confetti 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        checkPop: {
          "0%": { transform: "scale(0)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        confetti: {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(15deg)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
