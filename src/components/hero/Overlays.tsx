import styles from "./Overlays.module.css";

/** Proposed building footprint drawn over the empty site photo (viewBox matches the 1920×1088 frame). */
export function FootprintOverlay() {
  return (
    <svg className={styles.footprint} viewBox="0 0 1920 1088" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <polygon className={styles.fill} points="640,505 1285,455 1505,690 885,845" />
      <polygon className={styles.line} pathLength={1} points="640,505 1285,455 1505,690 885,845" />
      <path className={styles.thin} pathLength={1} d="M800,492 L1045,684 M962,480 L1195,755 M720,598 L1390,568 M760,700 L1450,628" />
      <path className={styles.line} pathLength={1} d="M600,478 L600,880 M588,490 H612 M588,868 H612" style={{ animationDelay: "2.4s" }} />
      <text className={styles.label} x="1080" y="425">PROPOSED BUILDING FOOTPRINT · ILLUSTRATIVE</text>
    </svg>
  );
}

const CHIPS = [
  { x: 47, y: 13, text: "Brass pendant lighting" },
  { x: 66, y: 27, text: "Linen curtains" },
  { x: 52, y: 66, text: "Travertine coffee table" },
  { x: 19, y: 80, text: "Oak herringbone floor" },
];

/** Material callouts for the finished room. Positions are tuned to the 16:9 frame; hidden on small screens. */
export function MaterialChips() {
  return (
    <ul className={styles.chips}>
      {CHIPS.map((c, i) => (
        <li key={c.text} style={{ left: `${c.x}%`, top: `${c.y}%`, animationDelay: `${1800 + i * 450}ms` }}>
          <i aria-hidden="true" />
          <span>{c.text}</span>
        </li>
      ))}
    </ul>
  );
}
