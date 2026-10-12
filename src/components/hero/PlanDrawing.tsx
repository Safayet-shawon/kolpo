import styles from "./PlanDrawing.module.css";

// Illustrative drafting sequence: grid → site boundary → roads → plots → footprints → park & trees.
// Pure SVG stroke animation, driven by the parent scene's `data-state` (time-based, never scroll-driven).
// It is a drawing of an invented layout and is labelled as such.

type Block = [x: number, y: number, w: number, h: number, cols: number, rows: number];

const BLOCKS: Block[] = [
  [235, 190, 255, 170, 4, 2],
  [560, 175, 390, 185, 5, 2],
  [1020, 165, 340, 195, 4, 2],
  [245, 550, 245, 195, 4, 2],
  [560, 560, 390, 185, 5, 2],
  [1030, 545, 330, 200, 4, 2],
];

// Deterministic pseudo-random so server and client render the same SVG.
const rnd = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

function plots() {
  const out: { x: number; y: number; w: number; h: number; i: number }[] = [];
  let i = 0;
  for (const [x, y, w, h, cols, rows] of BLOCKS) {
    const cw = w / cols;
    const rh = h / rows;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) out.push({ x: x + c * cw, y: y + r * rh, w: cw, h: rh, i: i++ });
  }
  return out;
}

const PLOTS = plots();

const TREES = (() => {
  const t: { x: number; y: number; r: number }[] = [];
  for (let y = 170; y < 800; y += 58) {
    t.push({ x: 507, y: y + rnd(y) * 10, r: 7 + rnd(y + 1) * 3 });
    t.push({ x: 1003, y: y + 20 + rnd(y + 3) * 10, r: 7 + rnd(y + 2) * 3 });
  }
  for (let k = 0; k < 16; k++) {
    const a = rnd(k + 40) * Math.PI * 2;
    const d = Math.sqrt(rnd(k + 90));
    t.push({ x: 800 + Math.cos(a) * d * 175, y: 455 + Math.sin(a) * d * 62, r: 8 + rnd(k) * 5 });
  }
  return t;
})();

const rect = (x: number, y: number, w: number, h: number) => `M${x.toFixed(1)} ${y.toFixed(1)}h${w.toFixed(1)}v${h.toFixed(1)}h${(-w).toFixed(1)}z`;
const PLOT_PATH = PLOTS.map((p) => rect(p.x, p.y, p.w, p.h)).join("");
const FOOTPRINT_PATH = PLOTS.map((p) => {
  const iw = p.w * (0.46 + rnd(p.i) * 0.2);
  const ih = p.h * (0.42 + rnd(p.i + 7) * 0.2);
  return rect(p.x + (p.w - iw) / 2, p.y + (p.h - ih) / 2, iw, ih);
}).join("");
const TREE_PATH = TREES.map((t) => `M${(t.x - t.r).toFixed(1)} ${t.y.toFixed(1)}a${t.r.toFixed(1)} ${t.r.toFixed(1)} 0 1 0 ${(t.r * 2).toFixed(1)} 0a${t.r.toFixed(1)} ${t.r.toFixed(1)} 0 1 0 ${(-t.r * 2).toFixed(1)} 0z`).join("");

const at = (ms: number, dur = 900) => ({ "--t": ms, "--l": `${dur}ms` }) as React.CSSProperties;

export default function PlanDrawing({ speed = 1 }: { speed?: number }) {
  const k = 1 / speed;
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      style={{ "--k": k } as React.CSSProperties}
    >
      <defs>
        <pattern id="plan-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="currentColor" strokeWidth="1.1" />
        </pattern>
        <pattern id="plan-grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M50 0H0V50" fill="none" stroke="currentColor" strokeWidth="0.6" />
        </pattern>
      </defs>

      {/* Drafting grid */}
      <rect className={`${styles.fade} ${styles.grid}`} width="1600" height="900" fill="url(#plan-grid)" style={at(0, 900)} />

      {/* Site boundary */}
      <path
        className={`${styles.draw} ${styles.heavy}`}
        pathLength={1}
        d="M200 140 L1390 118 L1462 430 L1410 790 L255 820 L168 480 Z"
        style={at(250, 1500)}
      />
      {/* Dimension line + ticks along the top edge */}
      <g className={styles.thin}>
        <path className={styles.draw} pathLength={1} d="M200 100 L1390 80" style={at(1300, 800)} />
        <path className={styles.draw} pathLength={1} d="M200 90 V112 M1390 70 V92" style={at(1500, 500)} />
        <text className={styles.fade} x="795" y="68" textAnchor="middle" style={at(1800, 600)}>
          SITE BOUNDARY — ILLUSTRATIVE
        </text>
      </g>

      {/* Roads: double lines — approach roads, cross streets and the park ring */}
      <g className={styles.road}>
        {[-12, 12].map((o) => (
          <g key={o}>
            <path className={styles.draw} pathLength={1} d={`M170 ${455 + o} H540`} style={at(1600, 1100)} />
            <path className={styles.draw} pathLength={1} d={`M1060 ${455 + o} H1462`} style={at(1800, 1100)} />
            <path className={styles.draw} pathLength={1} d={`M${525 + o} 128 V815`} style={at(2000, 1300)} />
            <path className={styles.draw} pathLength={1} d={`M${985 + o} 122 V818`} style={at(2200, 1300)} />
          </g>
        ))}
        <ellipse className={styles.draw} pathLength={1} cx="800" cy="455" rx="268" ry="104" style={at(2500, 1400)} />
        <ellipse className={styles.draw} pathLength={1} cx="800" cy="455" rx="242" ry="82" style={at(2700, 1400)} />
      </g>

      {/* Plot lines: one compound path (a single animated element instead of ~50) */}
      <path className={`${styles.draw} ${styles.thinLine}`} pathLength={1} d={PLOT_PATH} style={at(2900, 1800)} />

      {/* Building footprints: one compound, hatched shape fading in */}
      <path className={`${styles.fade} ${styles.footprint}`} d={FOOTPRINT_PATH} fill="url(#plan-hatch)" style={at(4300, 800)} />

      {/* Park, pond, trees */}
      <ellipse className={`${styles.fade} ${styles.park}`} cx="800" cy="455" rx="226" ry="68" style={at(4700, 700)} />
      <path
        className={`${styles.draw} ${styles.pond}`}
        pathLength={1}
        d="M700 452 C720 425 790 418 840 436 C885 452 880 484 830 490 C780 498 705 486 700 452 Z"
        style={at(4800, 900)}
      />
      <path className={`${styles.fade} ${styles.trees}`} d={TREE_PATH} style={at(5000, 700)} />

      {/* North arrow + title block */}
      <g className={`${styles.fade} ${styles.thin}`} style={at(5400, 600)}>
        <path d="M1500 740 L1514 790 L1500 780 L1486 790 Z" fill="currentColor" />
        <text x="1500" y="728" textAnchor="middle">N</text>
        <text x="168" y="866">KOLPO — SITE PLAN · NOT TO SCALE · ILLUSTRATIVE LAYOUT</text>
      </g>
    </svg>
  );
}
