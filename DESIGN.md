# KOLPO — Design System

Source of truth for how the site looks and moves. Tokens live in `src/app/globals.css`.

## Brand direction
Editorial, spatial, material-driven, confident. The work is the hero: large photography, quiet typography, hairline structure. Central idea: **from an empty canvas, to a designed space, to a real place.**

Research informing this (patterns only, no copying): BIG (project-first, image-led grid), Gensler (services framed by outcome), Turner (stage-by-stage project storytelling, locations), Skanska (credibility through case studies). Design guidance applied from the supplied references: Taste Skill (asymmetric layouts, no repeated card grids, restrained palette), UI UX Pro Max (4.5:1 contrast, visible focus, 375/768/1024/1440 checks, no emoji icons, touch targets), Design Motion Principles (purposeful, restrained motion; named easings; reduced-motion handling). These were read from their repository READMEs; the skills were not installed as tooling.

## Colour tokens
Minimal and cool: near-white, graphite, one deep-green accent.

| Token | Value | Use |
|---|---|---|
| `--paper` | `#fafaf8` | Page and 3D-scene background |
| `--paper-2` | `#f0f0ec` | Alternate sections |
| `--stone` | `#e2e2dd` | Image placeholders, fills |
| `--concrete-d` | `#5c5c58` | Secondary text (passes 4.5:1) |
| `--charcoal` / `--ink` | `#111` / `#1b1b1a` | Text, buttons, footer |
| `--accent` | `#2f5d50` | Deep green: links, current page, emphasis (7:1 on paper) |
| `--accent-l` | `#86bda8` | Accent on dark surfaces |

No gradients except legibility veils over the 3D stage.

## Typography
One family: **Hanken Grotesk** (400/500/600), headings at weight 500 with tight tracking. Sentence case everywhere (no uppercase labels). Compact scale: body 0.95rem, section titles 1.6 to 2.4rem, hero title 1.7 to 3.2rem. Buttons are flat, 40px tall, 0.82rem, 500 weight.

## Logo
The original KOLPO logo (triangle-and-arc mark plus the Kolpo | কল্প wordmark) is used unmodified in colour variants (ink on light, near-white on dark). The nav uses the mark alone (the wordmark is illegible that small); footer and loader use the full logo. Never redraw, stretch or add effects.

## Layout & spacing
12-column grid, 1440px max, fluid gutter, hairline rules instead of boxed cards, compact vertical rhythm. Mobile and laptop share one composition: same nav, same hero arrangement (model above, title and two buttons bottom-left), same section order, services always four across.

## Navigation
One fixed top bar with every option (Home, Architecture, Interior, Construction, Our Work, About, Contact), the same on every screen size. On phones the links wrap to a second row so nothing is hidden or behind a menu.

## Home page order
Hero film, Our licenses, Our works, Choose your service (Architecture, Interior, Construction, All in one, left to right in one row on every screen).

## 3D hero treatment
Procedural Three.js architectural-model scenes on warm ivory: white/ivory massing, limestone, charcoal CAD linework (1px line segments drawn in with `drawRange`), sage landscape, brass accents (survey stakes, crane, pendants, entrance canopy). One shadow-casting sun plus a hemisphere light, neutral tone mapping, no decorative particles. An ivory veil sits behind the headline for legibility. The model sits right of the headline on desktop and above it on mobile (camera view offset).

## Image & video treatment
Photography is photoreal only (AI-generated concept visualisation, labelled; see README for provenance). No illustrations, cartoons, icons-as-art. The 3D heroes are the primary visual; photography appears only in supporting sections and as the no-WebGL fallback.
Delivery: AVIF + WebP at 640/1280/1920 via `<picture>`, intrinsic `width`/`height`, blur placeholder, LCP image `fetchpriority=high`.

## Motion principles
1. **Heroes are time-based, never scroll-driven.** They play on entry, work without scrolling, and are skippable/pausable.
2. Scenes cross-dissolve (1.3s) or wipe (1.5s, `clip-path`) with `cubic-bezier(.65,0,.35,1)`; camera is a slow dolly (scale ≤ 1.3, translate ≤ 3%) with ease-out. Only `transform`/`opacity`/`clip-path` animate.
3. Line drawing uses `stroke-dashoffset` with `pathLength=1`.
4. The sequencer waits (≤3s) for the next frame to load before advancing; pauses when the tab is hidden or the hero is off-screen.
5. Reduced motion: heroes show the resolved final frame, no camera, no reveals.
6. Repeat visits in a session skip straight to the resolved frame with a **Replay** control.
7. Scroll reveals (`Reveal`) are subtle (24px, 0.9s) and used only for secondary content; content is visible without JS.

## Responsive behaviour
Breakpoints at 640 / 760 / 900 / 1040 / 1000. Verified at 375px and desktop. Mobile hero keeps the same story with the same assets (no extra layers), larger touch targets (≥44px), HUD wraps, material callouts hidden below 900px.

## Accessibility
Semantic landmarks, skip link, one `h1` per page, visible 2px focus ring, 44px targets, labelled form fields with `aria-invalid`/`aria-describedby`, live regions for filters and status, meaningful `alt`, decorative scene frames `aria-hidden` with a text description on the hero `section`, pause/skip/replay controls for moving content, `prefers-reduced-motion` honoured everywhere.

## Performance constraints
Heroes are procedural 3D (no video, no image sequence): Three.js and GSAP are dynamically imported after first paint; rendering happens only while animating or when the pointer moves after completion; DPR capped (2 desktop / 1.5 mobile); shadow maps 2048/1024. Immutable caching for `/media/*`. Fonts via `next/font` (self-hosted, `display: swap`).

## Components & interaction rules
`Cinematic` (sequencer) · `PlanDrawing` · `Overlays` · `Photo` · `ProjectCard` · `ProjectsExplorer` (filters sync to `?category=`) · `NearestProjects` (geolocation only on button press; distances via haversine; text-only matches labelled *area-based*) · `ContactForm` (client + server validation) · `BeforeAfter` (keyboard-operable slider).

## Anti-patterns (never)
Cartoon/illustrated hero art · placeholder gradients standing in for imagery · three identical cards · scroll-jacking · auto-playing audio · fake progress bars · invented testimonials, addresses, awards, statistics or client names · pill-shaped buttons everywhere · glassmorphism as decoration · hover-only information · unlabelled concept imagery.
