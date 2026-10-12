# KOLPO — Design System

Source of truth for how the site looks and moves. Tokens live in `src/app/globals.css`.

## Brand direction
Editorial, spatial, material-driven, confident. The work is the hero: large photography, quiet typography, hairline structure. Central idea: **from an empty canvas, to a designed space, to a real place.**

Research informing this (patterns only, no copying): BIG (project-first, image-led grid), Gensler (services framed by outcome), Turner (stage-by-stage project storytelling, locations), Skanska (credibility through case studies). Design guidance applied from the supplied references: Taste Skill (asymmetric layouts, no repeated card grids, restrained palette), UI UX Pro Max (4.5:1 contrast, visible focus, 375/768/1024/1440 checks, no emoji icons, touch targets), Design Motion Principles (purposeful, restrained motion; named easings; reduced-motion handling). These were read from their repository READMEs; the skills were not installed as tooling.

## Colour tokens
| Token | Value | Use |
|---|---|---|
| `--paper` | `#f4f0e8` | Warm architectural white, page background |
| `--paper-2` | `#ebe5d8` | Limestone wash, alternate sections |
| `--stone` | `#d9d0bd` | Image placeholders, fills |
| `--concrete` / `--concrete-d` | `#8a8883` / `#5d5c58` | Secondary text (`-d` passes 4.5:1 on paper) |
| `--charcoal` / `--ink` | `#1b1a18` / `#24221f` | Dark sections, body text |
| `--olive` | `#565d4a` | Landscape accents in drawings |
| `--accent` | `#9a4a31` | Terracotta: text-safe accent (5.6:1 on paper) |
| `--accent-l` | `#c0694a` | Terracotta on dark / large graphics only |

No neon, no gradients as decoration. The only gradients are legibility scrims over photography.

## Typography
- Display: **Instrument Serif** (regular + italic), tight tracking, `text-wrap: balance`. Italic is used for one emphasised phrase per headline.
- Text: **Hanken Grotesk** — highly legible, used for body, UI and uppercase letter-spaced labels.
- Fluid scale `--step--1 … --step-4` via `clamp()`. Body never below 16px. Fallbacks: Times / system-ui.

## Layout & spacing
12-column grid (`.grid-12`), `--max: 1560px`, fluid `--gutter`. Compositions are deliberately asymmetric: services use three different layouts (wide image + side text / text + tall crop / full-bleed overlay); the project grid alternates 7/5 column spans with vertical offsets. Hairline rules (`--line`) instead of boxed cards. Sections alternate paper / stone / charcoal.

## Image & video treatment
Photography is photoreal only (AI-generated concept visualisation, labelled; see README for provenance). No illustrations, cartoons, icons-as-art. The only drawn graphics are functional architectural linework (site-plan drafting animation, footprint overlay), always labelled *illustrative*.
Delivery: AVIF + WebP at 640/1280/1920 via `<picture>`, intrinsic `width`/`height`, blur placeholder, LCP image `fetchpriority=high`.

## Motion principles
1. **Heroes are time-based, never scroll-driven.** They play on entry, work without scrolling, and are skippable/pausable.
2. Scenes cross-dissolve (1.3s) or wipe (1.5s, `clip-path`) with `cubic-bezier(.65,0,.35,1)`; camera is a slow dolly (scale ≤ 1.3, translate ≤ 3%) with ease-out. Only `transform`/`opacity`/`clip-path` animate.
3. Line drawing uses `stroke-dashoffset` with `pathLength=1`.
4. The sequencer waits (≤3s) for the next frame to load before advancing; pauses when the tab is hidden or the hero is off-screen.
5. Reduced motion: heroes show the resolved final frame, no camera, no reveals.
6. Repeat visits in a session skip straight to the resolved frame with a **Replay** control.
7. Scroll reveals (`Reveal`) are subtle (24px, 0.9s) and used only for secondary content; content is visible without JS.

## Navigation
Fixed header; transparent over heroes with a soft scrim, flips to ink on pale drafting scenes (`html[data-hero-tone]`), solid paper after 24px scroll. Mobile: full-screen menu, focus trap, Escape to close, `aria-expanded`.

## Responsive behaviour
Breakpoints at 640 / 760 / 900 / 1040 / 1000. Verified at 375px and desktop. Mobile hero keeps the same story with the same assets (no extra layers), larger touch targets (≥44px), HUD wraps, material callouts hidden below 900px.

## Accessibility
Semantic landmarks, skip link, one `h1` per page, visible 2px focus ring, 44px targets, labelled form fields with `aria-invalid`/`aria-describedby`, live regions for filters and status, meaningful `alt`, decorative scene frames `aria-hidden` with a text description on the hero `section`, pause/skip/replay controls for moving content, `prefers-reduced-motion` honoured everywhere.

## Performance constraints
No video: heroes are image sequences loaded just-in-time (current + next frame only). Hero route JS is one client component. No animation library (CSS + WAAPI-free timers). Immutable caching for `/media/*`. Fonts via `next/font` (self-hosted, `display: swap`).

## Components & interaction rules
`Cinematic` (sequencer) · `PlanDrawing` · `Overlays` · `Photo` · `ProjectCard` · `ProjectsExplorer` (filters sync to `?category=`) · `NearestProjects` (geolocation only on button press; distances via haversine; text-only matches labelled *area-based*) · `ContactForm` (client + server validation) · `BeforeAfter` (keyboard-operable slider).

## Anti-patterns (never)
Cartoon/illustrated hero art · placeholder gradients standing in for imagery · three identical cards · scroll-jacking · auto-playing audio · fake progress bars · invented testimonials, addresses, awards, statistics or client names · pill-shaped buttons everywhere · glassmorphism as decoration · hover-only information · unlabelled concept imagery.
