# Trinetra Frontend — Deep Forensics Dashboard

## Overview

The Trinetra Frontend is a modern, responsive, and high-performance React application built atop the Next.js framework. It serves as the primary visualization and control layer for the Trinetra Deepfake Forensic Analyzer suite, providing investigators and analysts with an intuitive, detailed dashboard for media authentication.

The interface is engineered to present complex machine-learning outputs—such as temporal anomalies, Grad-CAM spatial heatmaps, and geometric landmark jitter—in a clear, actionable, and visually striking manner.

---

## Technical Stack

- **Framework:** Next.js (App Router paradigm) with React.
- **Language:** TypeScript for type-safe, maintainable component architecture.
- **Styling:** Tailwind CSS for rapid, utility-first styling combined with a bespoke design system.
- **Component Library:** Radix UI primitives / Framer Motion for accessible, dynamic, and fluid micro-interactions.
- **State Management:** React Context / Custom Hooks optimized for asynchronous API polling and state hydration.
- **Build Tooling:** Webpack / Turbopack via Next.js infrastructure.

---

## Architecture & Core Features

### 1. Forensic Visualization
The frontend translates raw tensor outputs and metadata from the backend into human-readable forensics:
- **Grad-CAM Overlays:** Interactive image layers mapping the exact pixels the EfficientNet model flagged as manipulated.
- **Error Level Analysis (ELA):** Noise residual mapping to detect compression disparities.
- **Temporal Charts:** Interactive data visualization highlighting frame-to-frame confidence divergence.

### 2. Client-Side Routing & Performance
- Built utilizing Next.js App Router for optimal Server-Side Rendering (SSR) and Static Site Generation (SSG).
- Asset optimization pipeline (Next/Image) guarantees rapid loading even for high-resolution forensic media.

---

## Setup & Development Environment

### Prerequisites
- Node.js (v18.x or higher)
- npm or yarn package manager

### 1. Installation

Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
# or
yarn install
```

### 2. Environment Configuration

If the frontend requires configuration for the local or cloud backend APIs, define them in a `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 3. Running the Development Server

Execute the Next.js development server with Hot Module Replacement (HMR):
```bash
npm run dev
# or
yarn dev
```
*The application will compile and be accessible at http://localhost:3000.*

### 4. Production Build

To generate an optimized production bundle:
```bash
npm run build
npm run start
```

---

## Project Structure (Abridged)

- `src/app/`: Next.js App Router endpoints, pages, and layout definitions.
- `src/components/`: Reusable, atomic React components (e.g., FileUploaders, HeatmapViewers).
- `public/`: Static assets, SVG icons, and global imagery.
- `tailwind.config.ts`: Centralized design system definitions, theme colors, and typography settings.
- `next.config.js`: Next.js build configuration and strict mode settings.

---

## Linting & Quality Assurance

Maintain code quality by adhering to the established ESLint and Prettier rules:
```bash
npm run lint
```
Strict TypeScript checks are enforced during the build pipeline. All new components must include explicit prop interfaces.
