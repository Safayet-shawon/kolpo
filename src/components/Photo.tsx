import media from "@/data/media.json";

type MediaEntry = { width: number; height: number; widths: number[]; blur: string };
const manifest = media as Record<string, MediaEntry>;

export type MediaKey = keyof typeof media;

type Props = {
  name: string;
  alt: string;
  sizes?: string;
  /** LCP image: eager + high fetch priority. */
  priority?: boolean;
  /** Skip AVIF (cheaper to decode on low-power devices) — used for full-bleed hero frames. */
  webpOnly?: boolean;
  /** Eager without raising priority (stacked scenes that are about to be shown). */
  eager?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onError?: React.ReactEventHandler<HTMLImageElement>;
  /** Decorative images pass alt="" and are hidden from assistive tech. */
};

function srcSet(name: string, widths: number[], ext: "avif" | "webp") {
  return widths.map((w) => `/media/${name}-${w}.${ext} ${w}w`).join(", ");
}

/** Responsive AVIF/WebP picture with intrinsic dimensions (no layout shift) and a blur placeholder. */
export default function Photo({ name, alt, sizes = "100vw", priority = false, eager = false, webpOnly = false, className, style, onError }: Props) {
  const entry = manifest[name];
  if (!entry) {
    if (process.env.NODE_ENV !== "production") console.warn(`[Photo] missing media entry "${name}" — run npm run media`);
    return null;
  }
  const fallbackW = entry.widths.includes(1280) ? 1280 : entry.widths[entry.widths.length - 1];
  return (
    <picture>
      {webpOnly ? null : <source type="image/avif" srcSet={srcSet(name, entry.widths, "avif")} sizes={sizes} />}
      <source type="image/webp" srcSet={srcSet(name, entry.widths, "webp")} sizes={sizes} />
      <img
        src={`/media/${name}-${fallbackW}.webp`}
        width={entry.width}
        height={entry.height}
        alt={alt}
        aria-hidden={alt === "" ? true : undefined}
        sizes={sizes}
        loading={priority || eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onError={onError}
        className={className}
        style={{ backgroundImage: `url(${entry.blur})`, backgroundSize: "cover", ...style }}
      />
    </picture>
  );
}
