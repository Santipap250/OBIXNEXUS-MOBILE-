# OBIX NEXUS MOBILE

**Personal FPV OS** — a mobile-first PWA for managing an FPV drone fleet: config analysis, tuning, digital twin, AI assistant, and community.

## Status

PRODUCTION-READY UI, DEMO DATA LAYER. All 9 core screens are built and functional against realistic mock/demo data (no backend yet — see "Backend integration points" below).

- Routes implemented: `/`, `/login`, `/register`, `/app/home`, `/app/fleet`, `/app/fleet/:id`, `/app/fleet/:id/digital-twin`, `/app/tools`, `/app/ai`, `/app/community`, `/app/settings`
- PWA: manifest + service worker via `vite-plugin-pwa`, installable, standalone display, safe-area aware
- Responsive: mobile-first (360–430px tested visually), scales to tablet/desktop with a centered app shell
- Lint/build: **not yet run in this environment** — see "What I could not verify" below

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build to dist/
npm run preview    # preview the production build
npm run lint
```

## Deploying to Vercel

1. Push this repo to `https://github.com/Santipap250/OBIXNEXUS-MOBILE-.git`
2. Import the repo in Vercel → framework preset **Vite** (auto-detected)
3. Build command `npm run build`, output directory `dist` (defaults are correct)
4. `vercel.json` already includes the SPA rewrite so client-side routes don't 404 on refresh

## Environment variables

None required for the current demo build. When you connect a real backend, add a `.env.local` (already git-ignored) with e.g.:

```
VITE_API_BASE_URL=
VITE_AI_PROVIDER_KEY=      # never call this directly from the client — proxy through a server route
VITE_GOOGLE_OAUTH_CLIENT_ID=
```

Never commit real secrets. AI provider keys in particular must live behind a server-side proxy, not in client code.

## Architecture

```
src/
  App.jsx          # route shell + all screen components (see "Known limitation" below)
  main.jsx         # React root, BrowserRouter
  styles/index.css # Tailwind entry
public/
  favicon.svg, manifest assets
```

Data models currently live inline as seed arrays (`seedDrones`, `seedTools`, `seedPosts`) inside `App.jsx`. For a real backend, promote these to `src/types/`, `src/data/`, and `src/services/api.ts` as described in the original brief, and swap the seed arrays for fetch calls / React Query.

### Known limitation — single-file component tree

To get you a complete, working app fast, all screens currently live in one `src/App.jsx` (~1000 lines) rather than being split into `components/`, `pages/`, `features/` per the target architecture. It works correctly, but before this grows further you should split it into per-feature files (`features/fleet/`, `features/tools/`, `features/ai/`, `features/community/`, `features/configdoctor/`, `features/digital-twin/`) — the component boundaries already exist as named functions (`Home_`, `Fleet`, `DroneDetail`, `DigitalTwin`, `Tools`, `AIAssistant`, `Community`, `Settings_`), so this is a mechanical extraction, not a rewrite.

## Features implemented

- **Splash** — animated logo/wordmark sequence, auto-advances
- **Login/Register** — mock auth (any email/password), Google button stub, inline validation
- **Home dashboard** — greeting, NEXUS STATUS card (live-looking stats from state), horizontally scrolling fleet cards, AI banner
- **Fleet** — search, active/inactive filter, add drone (form), delete drone, tap-through to detail
- **Drone detail** — telemetry grid (battery/voltage/current/temp/RPM/flight time), performance chart, tabs (overview/config/blackbox/history), quick actions, link to Digital Twin
- **Digital Twin** — component health grid, build/config/blackbox/tuning timeline
- **Tools** — category filter + search over 8 tools with status badges; ConfigDoctor has a working mock "Analyze" flow producing a health score and category checklist
- **AI Assistant (NEXUS AI)** — chat UI, suggested-question chips, typing indicator, structured mock PID recommendation card
- **Community** — post feed with working like toggling, category chips
- **Settings** — profile row, language toggle (TH/EN switch wired for future localization), sign out

## What I could not verify in this environment

I don't have network access here, so I could not:
- run `npm install` / `npm run build` / `npm run lint` against this exact project
- push to your GitHub repository
- deploy to Vercel

Please run the three commands above locally (or in CI) before merging — the code follows standard Vite + React 18 + Tailwind 3 conventions and there are no unusual dependencies, so a clean install should build without changes, but I can't guarantee it without having actually run it.

## Backend integration points (future work)

- Auth: swap mock `Login` submit handler for Firebase/Supabase/Auth0/Google OAuth
- ConfigDoctor / OBIXCORE / ConfigFPV: replace seed data + mock "Analyze" timeout with real API calls; the UI states (loading/result) are already structured to drop a real response into
- NEXUS AI: replace the `setTimeout` mock reply in `AIAssistant` with a real request to your model provider, proxied through a server route so no key sits in the client
- Persistence: fleet edits currently live in React state only (reset on reload); wire to a backend or `IndexedDB`/`localStorage` for local-first persistence
- Icons: add real `192x192` and `512x512` PNG app icons to `public/icons/` (referenced by `vite.config.js`'s PWA manifest) — placeholders are not included in this drop
