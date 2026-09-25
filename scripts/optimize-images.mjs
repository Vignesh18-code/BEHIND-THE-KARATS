import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Keep the originals for large displays. Generate mobile/retina candidates
// offline because a static export has no Next.js image optimization server.
const root = fileURLToPath(new URL("../public/images/", import.meta.url));
await mkdir(`${root}responsive`, { recursive: true });
for (const name of ["vikas", "mic"]) {
  const source = `${root}${name}.webp`;
  const { width: originalWidth } = await sharp(source).metadata();
  for (const width of [160, 240, 320, 480, 640, 960, 1280]) {
    if (width >= originalWidth) continue;
    const output = `${root}responsive/${name}-${width}.webp`;
    await sharp(source).resize({ width, withoutEnlargement: true })
      .webp({ quality: 90, effort: 6 }).toFile(output);
    console.log(`${name} ${width}px: ${(await stat(output)).size} bytes`);
  }
}
