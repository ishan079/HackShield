# HackShield — Next.js & TypeScript Migration

Modern, high-performance Next.js App Router & TypeScript frontend for HackShield (IIT Patna's Official Cybersecurity Club).

> 📘 **Backend Engineers**: See the dedicated [Backend Integration Guide (`BACKEND_README.md`)](./BACKEND_README.md) for full API contracts, data schemas, CTFd integration, and proxy setups.

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 📁 Architecture

- `app/` — Next.js App Router
  - `layout.tsx` — Root layout with metadata, fonts, theme provider, ambient canvas overlays, Navbar, and Footer.
  - `page.tsx` — Home page (Hero, 4 Pillars, Flagship CTF Banner, Programs, Community Stats, Interactive Sandbox Terminal, Team Organizers, CTA).
  - `about/page.tsx` — About HackShield, mission, values, and milestone timeline.
  - `ctf/page.tsx` — CTF hub (Flagship CTF countdown, challenge domains, past archive, 3D Flip Card Mini CTF registration).
  - `programs/page.tsx` — Curriculums, 6-week pathway, workshops, and speaker series.
  - `resources/page.tsx` — Segmented search and filterable security tools, platforms, and cheat sheets.
  - `globals.css` — Liquid glass CSS variables, specular lighting, and typography.
- `components/` — Modular, typed React components:
  - `Navbar.tsx` — Adaptive floating pill navbar with theme switcher and WhatsApp redirect.
  - `Footer.tsx` — Full-fidelity cybersecurity club footer.
  - `BinaryRainTree.tsx` — Full-fidelity interactive Bonsai Binary Rain canvas with scroll morphing.
  - `GrainOverlay.tsx` — GPU-optimized multi-orb ambient gradient mesh.
  - `MouseSpotlight.tsx` — Trailing spring physics spotlight cursor.
  - `Hero.tsx`, `Pillars.tsx`, `CTFBanner.tsx`, `ProgramsSection.tsx`, `StatsSection.tsx`, `InteractiveTerminal.tsx`, `TeamSection.tsx`, `CTASection.tsx`.
- `context/`
  - `ThemeContext.tsx` — Dark/light mode context with SSR-safe localStorage persistence.
- `types/`
  - `index.ts` — Comprehensive TypeScript interfaces for all components, routes, and data models.
- `public/` — Static assets (official logo, favicon icons, hero graphics).

