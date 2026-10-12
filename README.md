# KOLPO — architecture, interior design & construction website

A cinematic, photography-led marketing site for KOLPO. Next.js 16 (App Router) · React 19 · TypeScript · plain CSS (tokens + CSS Modules) · deployed on Vercel.

> **Read this first — what is real and what is placeholder**
> - No KOLPO logo, project list, office address, phone, team or testimonials were supplied, so none were invented. The wordmark is a **temporary** drawn mark; offices/contact/team show honest "to be confirmed" states.
> - All eight projects (`src/data/projects.ts`) are **demonstration concept projects** flagged `demo: true`. All imagery is **AI-generated concept visualisation** (Runway Gen-4 image models), labelled in the UI. None is a completed KOLPO commission.
> - There is **no video**. The Runway workspace used was on a free plan with no video models, so the four hero "films" are time-based sequences of consistent photoreal stills with camera moves, masked transitions and drawn linework (see *Hero experiences*). Replace them with real footage when available.

## Routes
`/` · `/architecture` · `/interior-design` · `/construction` · `/projects` · `/projects/[slug]` (8 pre-rendered) · `/about` · `/contact` · `/privacy` · `/journal` · `/journal/[slug]` · `/api/contact` · `/sitemap.xml` · `/robots.txt`

## Hero experiences
All four play automatically on entry and are **not** scroll-driven. Engine: `src/components/hero/Cinematic.tsx` (time-based sequencer) with scenes defined in `Heroes.tsx`.

| Hero | Sequence | Assets |
|---|---|---|
| Home | Drafting canvas (SVG line drawing) → aerial community → finished interior → completed building → headline & service links | `arch-colony-aerial`, `interior-3-final`, `cons-5-complete` |
| Architecture | Blank sheet → boundary → roads → plots → footprints → park/trees (SVG) → aerial masterplan (camera pulls back) → street level | `arch-colony-aerial`, `arch-street` |
| Interior | Empty room → fixtures & lighting (wipe) → furnished/styled room with material callouts | `interior-1-empty`, `interior-2-lit`, `interior-3-final` |
| Construction | Empty plot + proposed-footprint overlay → groundwork → structure → envelope & scaffolding → completion → front elevation | `cons-1-site` … `cons-6-front` |

Honest limits: the interior stages are three renders of *similar* rooms (matched sequence), not one continuous 3D transformation; the construction frames keep one building and similar camera but the camera drifts closer between stages; `cons-6-front` still contains a few construction remnants (rebar stubs, a plank) that the crop (`objectPosition`) hides on most screens. Plan linework is a drawing of an invented layout, labelled *illustrative*.

Behaviour: autoplay without waiting for scroll · Skip / Pause / Replay controls · pauses when the tab is hidden or the hero is off-screen · waits (≤3 s) for the next frame to load · repeat visits in a session jump to the resolved frame · `prefers-reduced-motion` shows the resolved frame with no camera or transitions · missing-image fallback surface · loader (`Loader.tsx`) shows only on a hard load, waits for the first hero frame (3.2 s ceiling, CSS-only failsafe) and never repeats in a session.

## Develop
```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm test             # vitest: geo distance + contact validation
npm run build && npm start
```

## Architecture
Single Next.js app with a clear internal split (no database/CMS/auth was needed, so none was added):

```
src/
  app/            routes, metadata, sitemap, robots, API route handler
    api/contact/  the only server code: validation, honeypot, timing check, rate limit, email via Resend
  components/     UI (hero/, projects/, Sections, Nav, Footer, Loader, ContactForm…)
  data/           site facts, services, projects, journal, gazetteer — single source of truth
  lib/            geo.ts (haversine), contact-schema.ts (shared client+server validation) + tests
public/media/     optimised AVIF + WebP (640/1280/1920) — generated, committed
scripts/          optimize-media.mjs
assets-src/       original PNG renders (git-ignored; kept locally for re-optimising)
```

### Environment variables (see `.env.example`)
| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata/sitemap |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_CONTACT_PHONE` | Public contact details (shown only when set) |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` | Enables real enquiry delivery. **Without all three the form tells visitors honestly that nothing was sent** and offers a mailto fallback if a public email is set. Never prefix secrets with `NEXT_PUBLIC_`. |

The in-memory rate limiter is best-effort on serverless; add Vercel Firewall/BotID rate limiting for production.

## Replacing demo assets with real KOLPO media
1. **Logo:** put the supplied SVG in `public/brand/`, then swap the body of `src/components/Wordmark.tsx` for an `<img>`/inline SVG (keep the `draw` prop path animation or drop it). Replace `src/app/icon.svg`.
2. **Photography:** drop new originals in `assets-src/` (16:9, ≥1920 px wide, any of PNG/JPG/WebP) using the same file stem to overwrite, or add new stems; run `npm run media` (regenerates `public/media/*` and `src/data/media.json`). Rename a stem when replacing it to bust the immutable cache.
3. **Projects:** edit `src/data/projects.ts` — replace entries, set `demo: false`, add verified `year`, `status`, real coordinates (used for distance ranking), and facts. Remove the concept disclaimers in `Heroes.tsx` when imagery is real.
4. **Heroes:** edit scenes in `src/components/hero/Heroes.tsx` (image keys, durations, camera). To use real video, add a `video` scene kind to `Cinematic.tsx` (muted, `playsInline`, poster = the existing frame) — poster, mobile and failure fallbacks already exist for stills.
5. **Offices/contact/team:** `src/data/site.ts` (offices render only when `verified: true`), `about/page.tsx` (team), `journal.ts` (articles; remove the `sample` entry).

### Asset plan per hero (for a future real-footage pass)
Start frame / end frame / aspect: Home — blank canvas → finished building, 16:9. Architecture — blank site → oblique aerial of the same masterplan (keep geography), 16:9. Interior — empty room → finished room from one fixed camera, 16:9. Construction — empty plot (aerial) → front elevation of the same building, 16:9. For each deliver H.264 MP4 + WebM, ≤8 MB for desktop (1080p, ~10 s) and ≤2.5 MB mobile (720p, 9:16 crop), a poster WebP, matched lighting, and a still end frame equal to the page's resolved frame.

## Performance
AVIF/WebP with `srcset`/`sizes`, intrinsic dimensions, blur placeholders, LCP frame `fetchpriority=high`; only the current and next hero frames are fetched; immutable cache for `/media/*`; self-hosted fonts via `next/font`; no animation or 3D libraries; route-level code splitting by the App Router; security headers; static generation for every page except the API.

## Deploy
Vercel: import the repo (framework auto-detected, root `/`, build `npm run build`). Add the env vars above in Project Settings → Environment Variables. Nested routes work on direct load/refresh (all pages are statically generated).

## Known limitations
- Demonstration projects/imagery only; AI-generated frames contain minor artefacts (e.g. stray planks/rebar in `cons-6-front`, garbled ruler markings in `materials`).
- No video; no real logo; no verified office, phone, team or testimonials.
- The privacy policy is a draft for legal review.
- Skill repos (Taste, UI UX Pro Max, Design Motion Principles) were read and applied as guidance, not installed.
