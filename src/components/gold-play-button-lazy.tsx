"use client";

import dynamic from "next/dynamic";

/**
 * three.js is around 750KB — half the JavaScript on the page — and all it
 * draws is the gold button sitting behind the hero copy. Loading it through
 * `dynamic` keeps it out of the first bundle: the text, the buttons and the
 * rest of the page become interactive first, and the canvas arrives after.
 */
export const GoldPlayButtonLazy = dynamic(
  () => import("./gold-play-button-3d").then(m => ({ default: m.GoldPlayButton3D })),
  { ssr: false, loading: () => null },
);
