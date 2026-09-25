"use client";

import type { ImageLoaderProps } from "next/image";

/** Map Next's responsive srcset onto files generated for the static export. */
export default function imageLoader({ src, width }: ImageLoaderProps) {
  const originalWidth = src === "/images/vikas.webp" ? 620 : src === "/images/mic.webp" ? 1500 : 0;
  if (!originalWidth) return src;
  const candidate = [160, 240, 320, 480, 640, 960, 1280]
    .find(size => size >= width && size < originalWidth);
  return candidate ? src.replace("/images/", "/images/responsive/").replace(".webp", `-${candidate}.webp`) : src;
}
