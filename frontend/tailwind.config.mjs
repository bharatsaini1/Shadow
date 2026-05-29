/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ─── LIGHT MODE SURFACES ─────────────────────────
        paper:        "#F9F7F4",
        "paper-2":    "#F2EFE9",
        card:         "#FFFFFF",
        "card-2":     "#F6F4F1",

        // ─── DARK MODE SURFACES ──────────────────────────
        ink:          "#0F0E0D",
        "ink-2":      "#161513",
        sheet:        "#1C1A18",
        "sheet-2":    "#232018",
        "sheet-3":    "#2A2720",

        // ─── BORDERS ─────────────────────────────────────
        "rule-light":      "#E4E0D8",
        "rule-light-2":    "#D0CBC1",
        "rule-light-focus":"#9C8F7E",
        rule:         "#2E2B26",
        "rule-2":     "#3A3630",
        "rule-focus": "#6B6356",

        // ─── SEMANTIC COLORS ─────────────────────────────
        signal:        "#2558E8",
        "signal-dim":  "#1D49CF",
        "signal-ghost":"rgba(37,88,232,0.07)",

        go:            "#1A9E52",
        "go-dim":      "#158042",
        "go-ghost":    "rgba(26,158,82,0.10)",

        caution:       "#D4740A",
        "caution-dim": "#AE5E07",
        "caution-ghost":"rgba(212,116,10,0.10)",

        stop:          "#D93030",
        "stop-dim":    "#B52525",
        "stop-ghost":  "rgba(217,48,48,0.10)",

        mark:          "#7733E0",
        "mark-dim":    "#6229C2",
        "mark-ghost":  "rgba(119,51,224,0.10)",

        // ─── TYPOGRAPHY — LIGHT MODE ─────────────────────
        "ink-prose":    "#1A1814",
        "ink-prose-2":  "#6B6356",
        "ink-ghost":    "#A89E91",
        "ink-dim":      "#D0C8BC",

        // ─── TYPOGRAPHY — DARK MODE ──────────────────────
        prose:         "#EDEAE5",
        "prose-2":     "#9A9288",
        ghost:         "#504840",
        dim:           "#2A2520",

        // ─── SPECIAL ─────────────────────────────────────
        scrim:         "rgba(15,14,13,0.85)",
        "scrim-light": "rgba(249,247,244,0.90)",
      },

      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body:    ["'Plus Jakarta Sans'", "sans-serif"],
        label:   ["'Plus Jakarta Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },

      fontSize: {
        "2xs": ["10px", { lineHeight: "14px", letterSpacing: "0.06em" }],
        xs:    ["11px", { lineHeight: "16px", letterSpacing: "0.03em" }],
        sm:    ["13px", { lineHeight: "20px" }],
        base:  ["14px", { lineHeight: "22px" }],
        md:    ["15px", { lineHeight: "24px" }],
        lg:    ["17px", { lineHeight: "26px" }],
        xl:    ["20px", { lineHeight: "30px" }],
        "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em" }],
        "3xl": ["30px", { lineHeight: "37px", letterSpacing: "-0.015em" }],
        "4xl": ["38px", { lineHeight: "44px", letterSpacing: "-0.02em" }],
        "5xl": ["50px", { lineHeight: "56px", letterSpacing: "-0.025em" }],
        "6xl": ["64px", { lineHeight: "70px", letterSpacing: "-0.03em" }],
        "7xl": ["82px", { lineHeight: "86px", letterSpacing: "-0.04em" }],
      },

      spacing: {
        sidebar:             "260px",
        "sidebar-collapsed": "52px",
        topbar:              "52px",
        panel:               "316px",
        chat:                "276px",
      },

      borderRadius: {
        none:   "0px",
        sm:     "3px",
        base:   "5px",
        md:     "8px",
        lg:     "12px",
        xl:     "18px",
        pill:   "999px",
      },

      boxShadow: {
        lift:   "0 1px 3px rgba(15,14,13,0.12), 0 0 0 1px rgba(15,14,13,0.04)",
        float:  "0 4px 16px rgba(15,14,13,0.15), 0 0 0 1px rgba(15,14,13,0.05)",
        deep:   "0 8px 32px rgba(15,14,13,0.22), 0 0 0 1px rgba(15,14,13,0.06)",
        "lift-light":  "0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        "float-light": "0 4px 12px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05)",
        "focus-ring":  "0 0 0 2px rgba(37,88,232,0.35)",
      },

      animation: {
        "enter-up":    "enterUp 0.40s cubic-bezier(0.22, 1, 0.36, 1) both",
        "enter-down":  "enterDown 0.40s cubic-bezier(0.22, 1, 0.36, 1) both",
        "enter-left":  "enterLeft 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        "enter-right": "enterRight 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade":        "fade 0.30s ease both",
        "pulse-slow":  "pulse 3.5s ease-in-out infinite",
        "blink":       "blink 1.2s step-start infinite",
        "bar-fill":    "barFill 1.0s cubic-bezier(0.22, 1, 0.36, 1) both",
        "ring-draw":   "ringDraw 1.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        "count-up":    "fade 0.09s ease both",
        "xp-rise":     "xpRise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
        "shake":       "shake 0.32s ease both",
        "shimmer":     "shimmer 1.8s linear infinite",
        "msg-in":      "msgIn 0.22s ease both",
        "dot-1":       "dotPulse 1.3s 0ms ease-in-out infinite",
        "dot-2":       "dotPulse 1.3s 200ms ease-in-out infinite",
        "dot-3":       "dotPulse 1.3s 400ms ease-in-out infinite",
      },

      keyframes: {
        enterUp:    { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        enterDown:  { "0%": { opacity: "0", transform: "translateY(-14px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        enterLeft:  { "0%": { opacity: "0", transform: "translateX(18px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        enterRight: { "0%": { opacity: "0", transform: "translateX(-18px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        fade:       { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        blink:      { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0" } },
        barFill:    { "0%": { width: "0%" }, "100%": { width: "var(--bar-w)" } },
        ringDraw:   { "0%": { strokeDashoffset: "var(--ring-full)" }, "100%": { strokeDashoffset: "var(--ring-offset)" } },
        xpRise:     { "0%": { opacity: "0", transform: "translateY(10px) scale(0.85)" }, "60%": { transform: "translateY(-3px) scale(1.04)" }, "100%": { opacity: "1", transform: "translateY(0) scale(1)" } },
        shake:      { "0%, 100%": { transform: "translateX(0)" }, "20%": { transform: "translateX(-6px)" }, "60%": { transform: "translateX(5px)" } },
        shimmer:    { "0%": { backgroundPosition: "-600px 0" }, "100%": { backgroundPosition: "600px 0" } },
        msgIn:      { "0%": { opacity: "0", transform: "translateY(7px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        dotPulse:   { "0%, 80%, 100%": { transform: "scale(0.55)", opacity: "0.35" }, "40%": { transform: "scale(1)", opacity: "1" } },
      },
    },
  },
  plugins: [],
};
