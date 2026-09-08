# OBIX NEXUS MOBILE — Phase 2

**Personal FPV OS — free, public, no account required.**

Open → use → analyze → learn. Every core feature works immediately, with no login, register, or forgot-password wall anywhere in the primary flow.

## What changed in Phase 2

1. **Authentication removed from the core flow.** Startup is now `Splash → Home Dashboard` — no login gate. The old email/password screen still exists as reference code but is isolated at `src/pages/future/Login.jsx`, not imported anywhere, and not wired into any route. If a later phase adds optional cloud accounts, that file is a starting point, not something to re-enable as a gate.
2. **Local Pilot Profile replaces accounts.** `src/pages/Profile.jsx` lets you set a name and role, stored only in this browser via `localStorage`. It's explicitly labeled "Local Profile" everywhere it appears, with a one-line privacy note: your data stays on this device, nothing is sent anywhere.
3. **Local persistence for everything that should survive a refresh:** fleet (added/edited/deleted drones), pilot profile, language, and favorited tools. All reads/writes go through one small abstraction (`src/lib/storage.js` + `src/lib/usePersistentState.js`) instead of scattered `localStorage` calls, so swapping to IndexedDB or a backend later is a one-file change.
4. **NEXUS AI now says "DEMO MODE"**, not "BETA" — it's clearly local mock intelligence, not a live model call, and the chat's first message says so in plain language. No API keys anywhere in the client.
5. **Tools status relabeled.** ConfigDoctor/OBIXCORE were "CONNECTED" in Phase 1, which implied an authenticated backend. They're "READY" now — accurate for a demo tool nothing is actually connected to. Added a favorites toggle (star), persisted locally.
6. **Settings rebuilt around local preferences**, not account management: Local Pilot (edit link), notifications, general preferences, theme, language, about, and a "reset local data" action (with a confirm step) that clears everything this app has written to `localStorage` and restores the seed demo data.
7. **Community is browsable with no sign-in**, with a one-line note saying so; likes are local UI state for now (see Known limitations).
8. **Refactored the single 1000-line `App.jsx` into modules:**
   ```
   src/
     App.jsx                 routing shell only
     main.jsx                React root
     lib/storage.js          localStorage abstraction
     lib/usePersistentState.js
     data/seed.js             demo data + design tokens (colors/status)
     components/ui.jsx        shared atoms (GlassCard, StatusPill, BottomNav, Timeline, MiniChart, headers)
     pages/                   one file per screen (Home, Fleet, DroneDetail, DigitalTwin, Tools, AIAssistant, Community, Settings, Profile)
     pages/future/Login.jsx   isolated, unused, Phase 3 reference only
   ```

## Routes (unchanged set, no auth routes)

`/` (splash) → `/app/home`, `/app/fleet`, `/app/fleet/:id`, `/app/fleet/:id/digital-twin`, `/app/tools`, `/app/ai`, `/app/community`, `/app/settings`, `/app/profile`. Unknown paths redirect to `/app/home`.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview
npm run lint
```

## Build / lint status — what I actually verified here

I still don't have network access in this environment, so I could not run `npm install` against the real npm registry, and therefore could not run a real `npm run build` or `npm run lint` (lint needs the `eslint` binary from `node_modules`, which `npm install` would provide).

What I did verify without network:
- Syntax-checked all 17 `.js`/`.jsx` files with the TypeScript compiler's `transpileModule` (JSX-aware parser) — 0 syntax errors.
- Manually re-read every cross-file import/export (page to `components/ui.jsx` to `data/seed.js` to `lib/*`) to confirm every imported name is actually exported where it's imported from, and every prop a page expects is passed by `App.jsx`.
- Added a minimal `.eslintrc.cjs` (missing from the Phase 1 drop — `npm run lint` would have failed immediately with "no config found" even after install) so lint has rules to run once you install.

Please run `npm install && npm run lint && npm run build` locally or in CI before merging. The syntax check gives real confidence there are no parse errors, but it can't catch things a real bundler/linter would (missing dependency versions, unused-var warnings, browser-only API misuse). I did not previously verify Phase 1's build either — flagging that so it doesn't read as a regression.

## Data persisted locally (localStorage, prefixed `obixnexus:`)

| Key | What |
|---|---|
| `pilot-profile` | name, role |
| `drones` | your fleet, including added/edited/deleted |
| `lang` | `th` or `en` |
| `favorite-tools` | starred tool ids |

"Reset local data" in Settings clears all four and restores the seed demo fleet.

## Known limitations (Phase 2)

- Community likes/posts are in-memory per session (not yet in the storage abstraction) — refreshing resets them. Straightforward to move into `lib/storage.js` alongside the rest when the community feature gets a real backend.
- Language toggle in Settings changes the stored preference and is wired for future localization, but screen copy itself is still hardcoded Thai (per the reference design) — full TH/EN string switching is follow-up work, not done in this pass.
- Tool icon/app assets are still Lucide icons + CSS gradients rather than real drone photography (see "Image strategy" from the original brief) — swap in `public/images/` assets when available.
- PWA icons (`192x192`/`512x512` PNG) referenced by `vite.config.js` are not included — add them to `public/icons/` before shipping installable builds.

## Deploying to Vercel

Unchanged from Phase 1: import the repo, Vite preset auto-detects, `vercel.json` has the SPA rewrite so client routes don't 404 on refresh.
