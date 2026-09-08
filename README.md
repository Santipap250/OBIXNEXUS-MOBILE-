# OBIX NEXUS MOBILE

**Personal FPV OS — free public, mobile-first, no account required.**

This build is designed as a premium PWA for FPV pilots: fleet management, configuration tools, tuning, Blackbox workflows, Digital Twin, NEXUS AI demo mode and community surfaces.

## Current build direction

- Free public / no-login primary flow
- Mobile-first app shell with bottom navigation
- Local-first fleet/profile/favorites persistence
- PWA manifest + install icons
- Local FPV visual assets (no fragile remote image dependency)
- Thai-first interface
- Vercel SPA-ready

## Run

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Deploy to Vercel

Framework: **Vite**

Build: `npm run build`

Output: `dist`

No environment variables are required for the demo/local-first build.

## Product honesty

NEXUS AI and several analysis tools are intentionally labeled **DEMO MODE** until a secure server-side integration is connected. No private provider API keys belong in this client application.

## Structure

```text
src/
  components/
  data/
  lib/
  pages/
  styles/
public/
  icons/
  images/
```
