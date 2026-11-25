import type { Config } from "tailwindcss";

/**
 * Design system — Mentoria Regis-dência · "Premium Dark Blue Experience"
 *
 * Família cromática (profundidade por camadas de azul):
 *  navy-950 #091326 · 900 #0D1930 · 850 #111F39 · 800 #172340 (institucional)
 *  750 #1B2B49 · 700 #223655 · 600 #304665
 * Acento pontual: brand-500 #2A9D90 (texto escuro sobre ele) / brand-700 #176E65.
 * Claro como contraste e leitura: surface-light #F5F7FA · surface-blue #EAF0F6.
 *
 * Tipografia: Newsreader (display editorial) × DM Sans (corpo/UI).
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#091326",
          900: "#0D1930",
          850: "#111F39",
          800: "#172340",
          750: "#1B2B49",
          700: "#223655",
          600: "#304665",
          500: "#4A6283",
          400: "#7F93B1",
          300: "#A5B4CC",
          200: "#C9D3E3",
          100: "#E4EAF3",
          50: "#F3F6FA",
        },
        // Texto sobre fundos escuros
        ondark: {
          DEFAULT: "#F7F9FC",
          soft: "#BAC6D8",
        },
        // Superfícies claras
        porcelain: {
          50: "#F5F7FA",
          DEFAULT: "#F0F3F7",
          100: "#E9EEF4",
          200: "#DCE3EC",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          primary: "#F5F7FA",
          light: "#F5F7FA",
          muted: "#F0F3F7",
          blue: "#EAF0F6",
        },
        line: {
          DEFAULT: "#E1E6EC",
          warm: "#E1E6EC",
          blue: "#D2DCE8",
        },
        // Navy legado/tokens de texto sobre claro (compatibilidade com admin)
        ink: {
          950: "#091326",
          900: "#0D1930",
          800: "#172340",
          700: "#223655",
          600: "#304665",
          500: "#4A6283",
          400: "#7F93B1",
          300: "#A5B4CC",
          200: "#C9D3E3",
          100: "#E4EAF3",
          50: "#F3F6FA",
        },
        // Teal — acento pontual
        brand: {
          50: "#EDF7F5",
          100: "#D4ECE7",
          200: "#A7D8D0",
          300: "#6EC2B5",
          400: "#42B0A2",
          DEFAULT: "#2A9D90",
          500: "#2A9D90",
          600: "#1E8277",
          700: "#176E65",
          800: "#125750",
          900: "#0E443E",
        },
        smoke: {
          700: "#394656",
          600: "#526174",
          500: "#64748A",
          400: "#8291A1",
          300: "#B2BDC8",
          200: "#D5DCE3",
          100: "#EAEEF2",
        },
        // ── Tokens legados — painel administrativo ──
        paper: { 50: "#F6F4EF", 100: "#EFECE3" },
        graphite: { 100: "#657087", 200: "#4E5A72", 300: "#3B455C" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Newsreader", "Georgia", "serif"],
        body: ["var(--font-body)", "DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: { "2xs": ["0.72rem", "1rem"] },
      borderRadius: {
        "ds-sm": "6px",
        "ds-md": "10px",
        "ds-lg": "16px",
        "ds-xl": "22px",
        card: "0.75rem",
        frame: "1rem",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(9,19,38,0.08), 0 4px 12px -4px rgba(9,19,38,0.10)",
        lift: "0 12px 28px -14px rgba(9,19,38,0.35)",
        warm: "0 24px 56px -28px rgba(9,19,38,0.22), 0 4px 14px -6px rgba(9,19,38,0.10)",
        deep: "0 32px 72px -32px rgba(5,10,22,0.7)",
        dark: "0 40px 90px -40px rgba(3,8,20,0.85), 0 0 0 1px rgba(255,255,255,0.04)",
        panel: "0 18px 40px -24px rgba(12,21,38,0.4)",
      },
      letterSpacing: {
        tightest: "-0.04em",
        tight: "-0.02em",
        wider2: "0.14em",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        marquee: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
        "aurora-drift": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(-3%, 2%, 0) scale(1.06)" },
        },
        "light-sweep": {
          "0%": { transform: "translateX(-120%) skewX(-18deg)" },
          "100%": { transform: "translateX(260%) skewX(-18deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.85s ease both",
        marquee: "marquee var(--marquee-duration, 36s) linear infinite",
        aurora: "aurora-drift 18s ease-in-out infinite",
        sweep: "light-sweep 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
