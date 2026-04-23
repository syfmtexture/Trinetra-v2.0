# Trinetra Dashboard Characteristics

This document outlines the core design system, characteristics, typography, and animations from the `prism-theme-forage` setup to allow accurate replication of the dashboard.

## 1. Typography

The application uses two primary fonts sourced from Google Fonts:
- **Headings (h1-h5):** `Space Grotesk`
  - Classes/Usage: `.font-display`, `h1`, `h2`, `h3`, `h4`, `h5`
  - Fallback: `system-ui, sans-serif`
  - Letter Spacing: `-0.02em`
- **Body Text:** `Inter`
  - Fallback: `system-ui, sans-serif`
  - Font features enabled: `"ss01", "cv11"`
  - Antialiased using `-webkit-font-smoothing: antialiased;`

## 2. Color Palette

The theme uses HSL (Hue, Saturation, Lightness) values for all colors.

### Brand Core Colors
- **Brand Orange (Accent):** `hsl(22, 95%, 55%)` — Dominant color, used for rings and accents.
- **Brand Purple (Secondary):** `hsl(255, 70%, 55%)`
- **Brand Yellow (Highlight):** `hsl(42, 96%, 56%)`
- **Brand Navy (Primary):** `hsl(245, 55%, 18%)`

### Light Theme Surfaces
- **Background:** `hsl(40, 33%, 98%)` (Warm off-white)
- **Foreground (Text):** `hsl(240, 35%, 12%)`
- **Cards/Popovers:** `hsl(0, 0%, 100%)`

### Dark Theme Surfaces
- **Background:** `hsl(245, 40%, 7%)` (Deep navy/black)
- **Foreground (Text):** `hsl(40, 33%, 96%)`
- **Cards/Popovers:** `hsl(245, 40%, 10%)`
- **Muted Elements:** `hsl(245, 25%, 15%)`

## 3. Gradients and Visual Effects

- **Brand Gradient:** Linear gradient at 135deg starting with Purple, transitioning to Orange at 55%, and ending with Yellow.
- **Text Gradient:** Linear gradient at 120deg from Navy to Purple to Orange.
- **Aurora Background:** A complex radial gradient combining blurred circles of Orange, Purple, and Yellow.
- **Grid Pattern:** A `.grid-pattern` class combining linear gradients for a grid backdrop with a central elliptical mask to fade out the edges.

### Shadows
- **Soft:** `0 1px 2px hsl(var(--brand-navy) / 0.04), 0 8px 30px hsl(var(--brand-navy) / 0.06)`
- **Elevated:** `0 20px 60px -20px hsl(var(--brand-purple) / 0.35)`
- **Glow:** `0 0 60px hsl(var(--brand-orange) / 0.35)`

## 4. Animations & Motion

The standard easing function for motion is a soft cubic-bezier: `cubic-bezier(0.22, 1, 0.36, 1)`.

### Custom CSS Animations
- **Float (`.animate-float`):** Gentle vertical hovering over 6s.
- **Pulse Ring (`.animate-pulse-ring`):** A scaling and fading ring effect over 2.4s.
- **Scan (`.animate-scan`):** A linear vertical scanning motion over 3s.
- **Marquee (`.marquee`):** A continuous horizontal scroll over 35s.

### Tailwind UI Animations
- **Fade Up (`animate-fade-up`):** Starts at `opacity: 0` and `translateY(20px)` to `opacity: 1` and `translateY(0)` over 0.7s using the soft cubic-bezier.
- **Fade In (`animate-fade-in`):** Simple opacity fade from 0 to 1 over 0.6s.
- **Accordion:** Standard Radix accordion `up` and `down` animations.

## 5. Global Styles & Aesthetics

- **Border Radius:** Default `--radius` is set to `1rem` (16px), giving cards and elements a rounded, modern feel.
- **Borders:** All elements default to the `--border` color.
- **Scroll Behavior:** Smooth scrolling is enabled globally on the `html` element.
- **Design Inspiration:** Modern minimalist aesthetic with generous whitespace, bold accents, and refined typography.

## Summary for Replication

To replicate this dashboard in a new repository:
1. Include `Space Grotesk` and `Inter` from Google Fonts.
2. Initialize Tailwind CSS with the provided custom colors, keyframes, and extended configuration.
3. Apply the global CSS variables for light and dark modes, ensuring HSL format is maintained.
4. Implement the custom utility classes for gradients (`.bg-gradient-brand`, `.text-gradient-brand`, `.bg-aurora`) and animations (`.animate-float`, `.animate-pulse-ring`).
