// Converts source frames in /assets-src into responsive AVIF + WebP files in /public/media
// and writes src/data/media.json (dimensions + tiny blur placeholder) used by <Photo />.
// Usage: npm run media
import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets-src";
const OUT = "public/media";
const WIDTHS = [480, 800, 1280, 1920];
const exts = new Set([".png", ".jpg", ".jpeg", ".webp"]);

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => exts.has(path.extname(f).toLowerCase()));
const manifest = {};

for (const file of files) {
  const name = path.basename(file, path.extname(file));
  const input = sharp(path.join(SRC, file));
  const meta = await input.metadata();
  const widths = WIDTHS.filter((w) => w <= (meta.width ?? 1920));
  if (!widths.includes(meta.width) && meta.width < WIDTHS[WIDTHS.length - 1]) widths.push(meta.width);

  for (const w of widths) {
    const base = sharp(path.join(SRC, file)).resize({ width: w });
    await base.clone().webp({ quality: 74, effort: 5 }).toFile(path.join(OUT, `${name}-${w}.webp`));
    await base.clone().avif({ quality: 52, effort: 4 }).toFile(path.join(OUT, `${name}-${w}.avif`));
  }

  const blur = await sharp(path.join(SRC, file))
    .resize({ width: 24 })
    .blur(1)
    .jpeg({ quality: 50 })
    .toBuffer();

  manifest[name] = {
    width: meta.width,
    height: meta.height,
    widths,
    blur: `data:image/jpeg;base64,${blur.toString("base64")}`,
  };
  console.log(`✓ ${name}  ${meta.width}x${meta.height}  → ${widths.join(", ")}`);
}

await mkdir("src/data", { recursive: true });
await writeFile("src/data/media.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote src/data/media.json (${Object.keys(manifest).length} images)`);
