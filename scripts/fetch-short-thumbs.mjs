/**
 * Pull each Short's poster frame from YouTube once and keep a right-sized copy
 * in public/media/shorts.
 *
 * YouTube only serves the 9:16 frame at 1080x1920 (~120KB of JPEG each). The
 * reel paints them into cards that are 208px wide at the very most, so the
 * browser was downloading roughly 2MB to draw about 130KB worth of pixels —
 * and paying a third-party DNS and TLS handshake for the privilege.
 *
 * Run after changing SHORTS in src/lib/site-content.ts:
 *   node scripts/fetch-short-thumbs.mjs
 */
import { mkdir, writeFile, readFile, readdir, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = "public/media/shorts";
/** 208px card at devicePixelRatio 2, the widest the reel ever draws one. */
const WIDTH = 416;

const ids = [...(await readFile("src/lib/site-content.ts", "utf8"))
  .match(/export const SHORTS = \[([\s\S]*?)\] as const;/)[1]
  .matchAll(/"([\w-]{11})"/g)].map(m => m[1]);

await mkdir(OUT, { recursive: true });

let total = 0;
for (const id of ids) {
  // The WebP original is the same frame as oardefault.jpg, just smaller to move.
  const response = await fetch(`https://i.ytimg.com/vi_webp/${id}/oardefault.webp`);
  if (!response.ok) throw new Error(`${id}: HTTP ${response.status}`);
  const source = Buffer.from(await response.arrayBuffer());
  const out = await sharp(source).resize(WIDTH).webp({ quality: 80, effort: 6 }).toBuffer();
  await writeFile(path.join(OUT, `${id}.webp`), out);
  total += out.length;
  console.log(`${id}  ${(source.length / 1024).toFixed(0)}KB -> ${(out.length / 1024).toFixed(0)}KB`);
}

// Drop thumbnails for Shorts that are no longer listed.
for (const file of await readdir(OUT)) {
  if (!ids.includes(path.parse(file).name)) {
    await unlink(path.join(OUT, file));
    console.log(`removed stale ${file}`);
  }
}

console.log(`\n${ids.length} thumbnails, ${(total / 1024).toFixed(0)}KB total`);
