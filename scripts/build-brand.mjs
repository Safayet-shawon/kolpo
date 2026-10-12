// Derives colour variants of the ORIGINAL KOLPO logo (public/brand/kolpo-logo-original.png) without redrawing it:
// the artwork's alpha channel is re-filled with ink / ivory. Also crops the triangle-and-arc mark for icons.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/brand/kolpo-logo-original.png";
const INK = "#1b1a18";
const IVORY = "#f4f0e8";
const MARK_ROWS = 418; // symbol sits above the "Kolpo | কল্প" wordmark

const meta = await sharp(SRC).metadata();
const { width, height } = meta;
const alpha = await sharp(SRC).extractChannel(3).raw().toBuffer();

const tint = (hex, w, h, a) =>
  sharp({ create: { width: w, height: h, channels: 3, background: hex } }).joinChannel(a, { raw: { width: w, height: h, channels: 1 } });

await mkdir("public/brand", { recursive: true });
for (const [name, hex] of [["dark", INK], ["light", IVORY]]) {
  await tint(hex, width, height, alpha).png({ compressionLevel: 9 }).toFile(`public/brand/kolpo-logo-${name}.png`);
  const markAlpha = alpha.subarray(0, width * MARK_ROWS);
  await tint(hex, width, MARK_ROWS, markAlpha).png({ compressionLevel: 9 }).toFile(`public/brand/kolpo-mark-${name}.png`);
}

// App icon: the mark centred on ivory.
const mark = await sharp("public/brand/kolpo-mark-dark.png").resize({ height: 168 }).toBuffer();
await sharp({ create: { width: 256, height: 256, channels: 3, background: IVORY } })
  .composite([{ input: mark, gravity: "center" }])
  .png()
  .toFile("src/app/icon.png");
console.log(`logo variants written (${width}x${height}, mark ${width}x${MARK_ROWS})`);
