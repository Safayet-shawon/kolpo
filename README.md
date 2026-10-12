# KOLPO — architecture, interior design & construction website

A cinematic, photography-led marketing site for KOLPO. Next.js 16 (App Router) · React 19 · TypeScript · plain CSS (tokens + CSS Modules) · deployed on Vercel.

> **Read this first: what is real and what is placeholder**
> - **Logo:** the original KOLPO logo (`public/brand/kolpo-logo-original.png`) is used everywhere. `npm run brand` only re-tints its alpha channel (ink / ivory) and crops the triangle-and-arc mark for small sizes and the favicon; the artwork is never redrawn.
> - **Verified facts** (head office and second address, two phone numbers, email, services, the ten completed project names) come from the studio's current site, https://kolpodhaka.com, checked on 2026-10-13. Opening hours, team and social links are not published there, so none are shown.
> - **Concept projects:** the eight entries in `src/data/projects.ts` are **demonstration concepts** (`demo: true`) with AI-generated imagery (Runway Gen-4). They are labelled in the UI and are not completed KOLPO commissions. The real completed projects are listed on `/projects` and link to their pages on kolpodhaka.com.
> - **Licenses:** the home page has an "Our licenses" section driven by `licenses` in `src/data/site.ts`. It is empty until real licence/registration details are added; nothing is invented.
> - **Heroes are procedural 3D** (Three.js + GSAP), not photographs and not video. They are architectural-model abstractions, not approved plans, and say so on screen.

## Routes
`/` · `/architecture` · `/interior-design` · `/construction` · `/all-in-one` · `/projects/[slug]` (8 pre-rendered; `/projects` redirects to the home page carousel) · `/about` · `/contact` · `/privacy` · `/journal` · `/journal/[slug]` · `/api/contact` · `/sitemap.xml` · `/robots.txt`

## Cost estimator (placeholder rates!)
Each service page (and `/all-in-one`) has a "What do you want ...?" picker with three options (Architecture: Home / Building / Colony; Interior: Home / Office / Restaurant; Construction: Home / Building / Colony; All in one: Home / Building / Colony). Choosing one opens a popup that asks for the area in sq ft and returns an indicative total with a per-part breakdown, plus a "Request a quote" link that prefills the contact form.

**The rates in `src/data/pricing.ts` are illustrative placeholders (BDT per sq ft), not KOLPO's prices.** Replace every `perSqft` (and the min/max areas) with the studio's real figures and set `PRICING_VERIFIED = true`. Results are always labelled "indicative estimate, not a quotation".

## Hero experiences (procedural 3D)
All four play automatically on entry, are **time-based (never scroll-driven)**, and come with Pause / Skip / Replay. Code: `src/components/three/` (`runtime.ts` renderer, camera and GSAP timeline control; `ThreeStage.tsx` React wrapper and HUD; `scenes/*.ts` the scene builders; `common.ts` shared helpers). Three.js and GSAP are dynamically imported, so they never block first paint.

| Hero | Stages (HUD labels) |
|---|---|
| Home | One film (about 22 s): a building is designed on an empty site (survey, two-flat floor plan, wireframe proposal), the same building is constructed (excavation, foundations, frame, brickwork, windows, finishing, landscaping), then a first-floor flat is opened up and furnished with its lights switched on |
| Architecture | Empty site, boundary and survey grid, roads and circulation, residential plot layout, building footprints, 3D massing (wireframe rises then solidifies), landscape and community, finished masterplan |
| Interior | Exploded empty shell closes up, floor and wall finishes, ceiling design and lighting, built-in joinery, furniture assembles, lighting comes on, materials and details, finished interior |
| Construction | Surveyed empty site, footprint and wireframe proposal, excavation, foundations, columns/beams/slabs per storey, instanced brickwork (about 5k bricks), windows and doors, finishing (scaffolding and crane removed), landscaping and front three-quarter reveal |

Details: one building, room and footprint is used throughout each sequence (nothing is swapped); furniture grows from the floor inside its final bounds so it never intersects walls; the camera is a tween of position plus look-at target; the scene renders only while animating. Behaviour: autoplay; pauses when the tab is hidden or the hero is off-screen; skip/replay; repeat visits in a session jump to the finished frame; `prefers-reduced-motion` shows the finished frame; no WebGL or a build failure shows a still photograph; the loader waits for the first rendered frame (3.2 s ceiling, CSS-only failsafe). Pointer parallax is available after the sequence completes.

Honest limits: lighting is a hemisphere light plus one shadow-casting sun (no screen-space ambient occlusion); furniture is stylised primitives, not photoreal models; supporting sections below the heroes still use AI-generated concept photography.

## Develop
```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run media        # regenerate optimised photos from assets-src/
npm run brand        # regenerate logo variants from the original logo
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
1. **Logo:** replace `public/brand/kolpo-logo-original.png` (transparent PNG, or adapt `scripts/build-brand.mjs`) and run `npm run brand`. The `Logo` component renders the variants.
2. **Photography:** drop new originals in `assets-src/` (16:9, ≥1920 px wide, any of PNG/JPG/WebP) using the same file stem to overwrite, or add new stems; run `npm run media` (regenerates `public/media/*` and `src/data/media.json`). Rename a stem when replacing it to bust the immutable cache.
3. **Projects:** edit `src/data/projects.ts` — replace entries, set `demo: false`, add verified `year`, `status`, real coordinates (used for distance ranking), and facts. Remove the concept disclaimers in `Heroes.tsx` when imagery is real.
4. **Heroes:** edit scenes in `src/components/hero/Heroes.tsx` (image keys, durations, camera). To use real video, add a `video` scene kind to `Cinematic.tsx` (muted, `playsInline`, poster = the existing frame) — poster, mobile and failure fallbacks already exist for stills.
5. **Offices/contact/team:** `src/data/site.ts` (offices render only when `verified: true`), `about/page.tsx` (team), `journal.ts` (articles; remove the `sample` entry).

## Performance
AVIF/WebP with `srcset`/`sizes`, intrinsic dimensions, blur placeholders, LCP frame `fetchpriority=high`; only the current and next hero frames are fetched; immutable cache for `/media/*`; self-hosted fonts via `next/font`; no animation or 3D libraries; route-level code splitting by the App Router; security headers; static generation for every page except the API.

## Deploy
Vercel: import the repo (framework auto-detected, root `/`, build `npm run build`). Add the env vars above in Project Settings → Environment Variables. Nested routes work on direct load/refresh (all pages are statically generated).

## Known limitations
- Demonstration projects/imagery only; AI-generated frames contain minor artefacts (e.g. stray planks/rebar in `cons-6-front`, garbled ruler markings in `materials`).
- No video. Team profiles and testimonials are not shown (not published in a form we could verify).
- The privacy policy is a draft for legal review.
- Skill repos (Taste, UI UX Pro Max, Design Motion Principles) were read and applied as guidance, not installed.
