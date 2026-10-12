import Link from "next/link";
import Cinematic, { type Scene } from "./Cinematic";
import PlanDrawing from "./PlanDrawing";
import { FootprintOverlay, MaterialChips } from "./Overlays";
import styles from "./HeroCopy.module.css";

const DISCLOSURE = "Concept visualisation — not a completed KOLPO project";

function Arrow() {
  return (
    <span aria-hidden="true" className="arr">
      →
    </span>
  );
}

/* ───────────────────────── Home: one story, three disciplines ───────────────────────── */

const homeScenes: Scene[] = [
  { id: "canvas", label: "The canvas", duration: 3600, tone: "light", canvas: <PlanDrawing speed={1.7} /> },
  {
    id: "plan",
    label: "A community planned",
    duration: 3600,
    tone: "dark",
    image: "arch-colony-aerial",
    camera: { from: [1.14, -2, 1.5], to: [1, 0, 0] },
    enter: "fade",
  },
  {
    id: "space",
    label: "A space designed",
    duration: 3600,
    tone: "light",
    image: "interior-3-final",
    camera: { from: [1, 0, 0], to: [1.06, -1.5, 0] },
    enter: "wipe",
  },
  {
    id: "place",
    label: "A place built",
    duration: 0,
    tone: "dark",
    image: "cons-5-complete",
    objectPosition: "50% 60%",
    camera: { from: [1.0, 0, 0], to: [1.06, 0, -1] },
    enter: "fade",
  },
];

export function HeroHome() {
  return (
    <Cinematic
      id="home"
      scenes={homeScenes}
      disclosure={DISCLOSURE}
      description="Introductory sequence: a blank drawing becomes a planned community, then a designed interior, then a finished building."
    >
      <div className={styles.copy}>
        <p className={`eyebrow ${styles.eyebrow}`}>Architecture · Interior design · Construction</p>
        <h1 className={styles.title}>
          Spaces imagined. <em>Places made.</em>
        </h1>
        <p className={styles.lede}>
          KOLPO plans the community, designs the rooms and builds what is drawn — one continuous process from an empty page to a
          finished place.
        </p>
      </div>
      <nav className={styles.services} aria-label="Our services">
        <Link href="/architecture">
          <span className={styles.n}>01</span>
          <span className={styles.t}>Architecture</span>
          <span className={styles.a} aria-hidden="true">→</span>
        </Link>
        <Link href="/interior-design">
          <span className={styles.n}>02</span>
          <span className={styles.t}>Interior Design</span>
          <span className={styles.a} aria-hidden="true">→</span>
        </Link>
        <Link href="/construction">
          <span className={styles.n}>03</span>
          <span className={styles.t}>Construction</span>
          <span className={styles.a} aria-hidden="true">→</span>
        </Link>
      </nav>
    </Cinematic>
  );
}

/* ───────────────────────── Architecture: a colony from a blank canvas ───────────────────────── */

const archScenes: Scene[] = [
  { id: "canvas", label: "Blank canvas to site plan", duration: 6800, tone: "light", canvas: <PlanDrawing /> },
  {
    id: "aerial",
    label: "The masterplan, visualised",
    duration: 5600,
    tone: "dark",
    image: "arch-colony-aerial",
    camera: { from: [1.3, 3, -3], to: [1, 0, 0] },
    enter: "fade",
  },
  {
    id: "street",
    label: "Down to street level",
    duration: 0,
    tone: "dark",
    image: "arch-street",
    camera: { from: [1, 0, 0], to: [1.06, -1, 0] },
    enter: "wipe",
  },
];

export function HeroArchitecture() {
  return (
    <Cinematic
      id="architecture"
      scenes={archScenes}
      disclosure={DISCLOSURE}
      description="Introductory sequence: a blank drafting sheet gains boundaries, roads, plots and buildings, then resolves into an aerial visualisation of a residential community and a view down one of its streets."
    >
      <div className={styles.copy}>
        <p className={`eyebrow ${styles.eyebrow}`}>Architecture &amp; community design</p>
        <h1 className={styles.title}>
          A community, drawn from <em>an empty page.</em>
        </h1>
        <p className={styles.lede}>
          Roads, plots, landscape and homes designed together — so a colony feels like one place, not a row of lots.
        </p>
        <div className={styles.actions}>
          <Link href="/projects?category=architecture" className="btn btn--ghost">
            See architecture work <Arrow />
          </Link>
          <Link href="/contact" className="btn">
            Start a project
          </Link>
        </div>
      </div>
    </Cinematic>
  );
}

/* ───────────────────────── Interior: an empty room becomes a home ───────────────────────── */

const interiorScenes: Scene[] = [
  {
    id: "empty",
    label: "The empty room",
    duration: 3400,
    tone: "light",
    image: "interior-1-empty",
    camera: { from: [1, 0, 0], to: [1.05, -1.2, 0] },
  },
  {
    id: "fit-out",
    label: "Lighting and fixtures",
    duration: 3400,
    tone: "light",
    image: "interior-2-lit",
    camera: { from: [1.02, 0, 0], to: [1.06, -1, 0] },
    enter: "wipe",
  },
  {
    id: "finished",
    label: "Furniture, texture and light",
    duration: 0,
    tone: "light",
    image: "interior-3-final",
    camera: { from: [1, 0, 0], to: [1.07, -2, 0] },
    enter: "wipe",
    overlay: <MaterialChips />,
  },
];

export function HeroInterior() {
  return (
    <Cinematic
      id="interior"
      scenes={interiorScenes}
      disclosure={`${DISCLOSURE}. Matched sequence of three renders of one room`}
      description="Introductory sequence: an empty room gains lighting, then oak flooring, furniture, curtains and styling until it becomes a finished living space."
    >
      <div className={styles.copy}>
        <p className={`eyebrow ${styles.eyebrow}`}>Interior design</p>
        <h1 className={styles.title}>
          An empty room, <em>made to be lived in.</em>
        </h1>
        <p className={styles.lede}>
          Light, material and furniture planned together — from the first layout to the last styled shelf.
        </p>
        <div className={styles.actions}>
          <Link href="/projects?category=interior" className="btn btn--ghost">
            See interior work <Arrow />
          </Link>
          <Link href="/contact" className="btn">
            Start a project
          </Link>
        </div>
      </div>
    </Cinematic>
  );
}

/* ───────────────────────── Construction: from empty plot to finished front elevation ───────────────────────── */

const constructionScenes: Scene[] = [
  {
    id: "site",
    label: "The site",
    duration: 4600,
    tone: "dark",
    image: "cons-1-site",
    camera: { from: [1, 0, 0], to: [1.06, -1.5, 0.5] },
    overlay: <FootprintOverlay />,
  },
  {
    id: "ground",
    label: "Ground preparation",
    duration: 2800,
    tone: "dark",
    image: "cons-2-groundwork",
    camera: { from: [1.03, 0, 0], to: [1, 0, 0] },
    enter: "fade",
  },
  {
    id: "structure",
    label: "Structure",
    duration: 2800,
    tone: "dark",
    image: "cons-3-structure",
    camera: { from: [1, 0, 0], to: [1.04, 0, 0] },
    enter: "fade",
  },
  {
    id: "envelope",
    label: "Building envelope",
    duration: 2800,
    tone: "dark",
    image: "cons-4-envelope",
    camera: { from: [1, 0, 0], to: [1.04, 0, 0] },
    enter: "fade",
  },
  {
    id: "complete",
    label: "Completion",
    duration: 3000,
    tone: "dark",
    image: "cons-5-complete",
    camera: { from: [1, 0, 0], to: [1.05, 0, 0] },
    enter: "fade",
  },
  {
    id: "front",
    label: "Front elevation",
    duration: 0,
    tone: "dark",
    image: "cons-6-front",
    objectPosition: "55% 72%",
    camera: { from: [1.0, 0, 1.5], to: [1.07, 0, -1] },
    enter: "fade",
  },
];

export function HeroConstruction() {
  return (
    <Cinematic
      id="construction"
      scenes={constructionScenes}
      disclosure={`${DISCLOSURE}. AI-generated stage frames`}
      description="Introductory sequence: an empty development plot, a proposed footprint, excavation, concrete structure, enclosed envelope, finished building, and finally the front elevation."
    >
      <div className={styles.copy}>
        <p className={`eyebrow ${styles.eyebrow}`}>Construction</p>
        <h1 className={styles.title}>
          From an empty plot to <em>a finished front door.</em>
        </h1>
        <p className={styles.lede}>
          Staged, coordinated delivery with visible progress at every step — site, groundwork, structure, envelope, handover.
        </p>
        <div className={styles.actions}>
          <Link href="/projects?category=construction" className="btn btn--ghost">
            See construction work <Arrow />
          </Link>
          <Link href="/contact" className="btn">
            Start a project
          </Link>
        </div>
      </div>
    </Cinematic>
  );
}
