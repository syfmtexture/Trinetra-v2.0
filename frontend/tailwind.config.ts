import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        brand: {
          orange: "hsl(var(--brand-orange))",
          purple: "hsl(var(--brand-purple))",
          yellow: "hsl(var(--brand-yellow))",
          navy:   "hsl(var(--brand-navy))",
          red:    "hsl(0 84% 58%)",
          green:  "hsl(152 69% 40%)",
        },
        trinetra: {
          orange: "hsl(var(--brand-orange))",
          purple: "hsl(var(--brand-purple))",
          yellow: "hsl(var(--brand-yellow))",
          navy:   "hsl(var(--brand-navy))",
          text:   "hsl(var(--foreground))",
          muted:  "hsl(var(--muted-foreground))",
          bg:     "hsl(var(--background))",
          surface:"hsl(var(--card))",
          border: "hsl(var(--border))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, hsl(var(--brand-purple)) 0%, hsl(var(--brand-orange)) 55%, hsl(var(--brand-yellow)) 100%)",
        "gradient-text":  "linear-gradient(120deg, hsl(var(--brand-navy)), hsl(var(--brand-purple)) 50%, hsl(var(--brand-orange)))",
      },
      boxShadow: {
        soft:     "0 1px 2px hsl(var(--brand-navy) / 0.04), 0 8px 30px hsl(var(--brand-navy) / 0.06)",
        elevated: "0 20px 60px -20px hsl(var(--brand-purple) / 0.35)",
        glow:     "0 0 60px hsl(var(--brand-orange) / 0.35)",
      },
      animation: {
        float:         "float 6s cubic-bezier(0.22, 1, 0.36, 1) infinite",
        "pulse-ring":  "pulse-ring 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite",
        scan:          "scan 3s linear infinite",
        marquee:       "marquee 35s linear infinite",
        "fade-up":     "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in":     "fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        breathe:           "breathe 8s ease-in-out infinite",
        "scan-pulse":      "scan-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        float:        { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        "pulse-ring": { "0%": { transform: "scale(0.8)", opacity: "0.5" }, "100%": { transform: "scale(1.3)", opacity: "0" } },
        scan:         { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100%)" } },
        marquee:      { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        "fade-up":    { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "fade-in":    { from: { opacity: "0" }, to: { opacity: "1" } },
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up":   { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        breathe:           { "0%, 100%": { transform: "scale(0.8)", opacity: "0.3" }, "50%": { transform: "scale(1.3)", opacity: "0.6" } },
        "scan-pulse":      { "0%": { transform: "translateY(-100%)", opacity: "0.8" }, "50%": { opacity: "1" }, "100%": { transform: "translateY(100%)", opacity: "0.8" } },
      },
    },
  },
  plugins: [],
};

export default config;
