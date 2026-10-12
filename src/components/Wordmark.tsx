// TEMPORARY KOLPO wordmark: monoline drafting-style letterforms drawn as strokes so the loader can
// "draw" them. No official logo file exists in the project. To replace: drop the supplied SVG in
// /public/brand/ and swap this component's body for <img src="/brand/kolpo.svg" />. See README.

const LETTERS = [
  "M3 3V37 M27 3L3 22 M11 14L27 37", // K
  "M15 3C7 3 3 10 3 20S7 37 15 37S27 30 27 20S23 3 15 3Z", // O
  "M3 3V37H25", // L
  "M3 37V3H15C22 3 26 7 26 12.5S22 22 15 22H3", // P
  "M15 3C7 3 3 10 3 20S7 37 15 37S27 30 27 20S23 3 15 3Z", // O
];
const STEP = 36;

type Props = {
  className?: string;
  /** Animate the strokes drawing in (used by the loader). */
  draw?: boolean;
  title?: string;
};

export default function Wordmark({ className, draw = false, title = "KOLPO" }: Props) {
  return (
    <svg
      viewBox="0 0 176 40"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      {LETTERS.map((d, i) => (
        <g key={i} transform={`translate(${i * STEP - 2} 0)`}>
          <path
            d={d}
            pathLength={1}
            className={draw ? "wm-draw" : undefined}
            style={draw ? ({ "--i": i } as React.CSSProperties) : undefined}
          />
        </g>
      ))}
    </svg>
  );
}
