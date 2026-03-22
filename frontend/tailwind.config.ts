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
        background: "var(--background)",
        foreground: "var(--foreground)",
        trinetra: {
          bg: "var(--trinetra-bg)",
          surface: "var(--trinetra-surface)",
          border: "var(--trinetra-border)",
          orange: "#fc5803",
          yellow: "#f7a505",
          purple: "#8A2BE2",
          text: "var(--trinetra-text)",
          muted: "var(--trinetra-muted)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-dm-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-oswald)", "var(--font-outfit)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
