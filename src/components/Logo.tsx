/** The ORIGINAL KOLPO logo (public/brand/kolpo-logo-original.png) — recoloured copies only, never redrawn. */

const SIZES = {
  full: { w: 375, h: 501, file: "kolpo-logo" },
  mark: { w: 375, h: 418, file: "kolpo-mark" },
} as const;

type Props = {
  /** "full" = mark + Kolpo | কল্প wordmark. "mark" = triangle-and-arc symbol only (small sizes). */
  variant?: "full" | "mark";
  /** "dark" for light backgrounds, "light" for dark ones. */
  tone?: "dark" | "light";
  /** Rendered height in CSS px; width follows the artwork's aspect ratio. */
  height: number;
  className?: string;
  priority?: boolean;
};

export default function Logo({ variant = "full", tone = "dark", height, className, priority }: Props) {
  const s = SIZES[variant];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/brand/${s.file}-${tone}.png`}
      alt="Kolpo | কল্প"
      width={Math.round((s.w / s.h) * height)}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={{ height, width: "auto" }}
    />
  );
}
