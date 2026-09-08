# OBIX NEXUS MOBILE — Engineering Handoff

This package is the current working baseline rebuilt from the supplied latest GitHub ZIP.

## Verified in this environment

- Repository structure inspected.
- Authentication is not in the primary route flow.
- Local persistence abstraction is present.
- PWA configuration and install icons are present.
- Local FPV visual assets are included.
- Vercel SPA rewrite configuration is present.

## Not claimed as verified

The environment cannot reach the npm registry, so a fresh `npm install` could not complete here. Therefore `npm run build` and `npm run lint` were not falsely marked as passed.

Run locally/CI:

```bash
npm install
npm run lint
npm run build
```

## Product direction

Free public, no-account, mobile-first PWA. NEXUS AI and analyzer surfaces remain explicitly demo/local until secure backend integrations are added.
