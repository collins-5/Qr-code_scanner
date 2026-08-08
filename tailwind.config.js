/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT:  "hsl(var(--primary))",
          dark:     "hsl(var(--primary-dark))",
          deep:     "hsl(var(--primary-deep))",
          navy:     "hsl(var(--primary-navy))",
          glow:     "hsl(var(--primary-glow))",
          light:    "hsl(var(--primary-light))",
          mid:      "hsl(var(--primary-mid))",
          border:   "hsl(var(--primary-border))",
          faint:    "hsl(var(--primary-faint))",
          subtle:   "hsl(var(--primary-subtle))",
          blue:     "#1e40af",
          sky:      "#93c5fd",
          indigo:   "#6366f1",
          foreground: "hsl(var(--primary-foreground))",
        },

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // ─── Brand extended tokens ──────────────────────────────────────────────
        surface: {
          page:    "hsl(var(--surface-page))",
          appgray: "hsl(var(--background))",
          card:    "hsl(var(--card))",
          header:  "hsl(var(--surface-header))",
          muted:   "hsl(var(--muted))",
        },

        "border-card":   "hsl(var(--border-card))",
        "border-medium": "hsl(var(--border))",
        "border-light":  "hsl(var(--border-light))",
        "border-faint":  "hsl(var(--border-faint))",

        "text-body":   "hsl(var(--foreground))",
        "text-muted":  "hsl(var(--muted-foreground))",
        "text-light":  "hsl(var(--muted-foreground))",
      },
    },
  },
  plugins: [],
}
