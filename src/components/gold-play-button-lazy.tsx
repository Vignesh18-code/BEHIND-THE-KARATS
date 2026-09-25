"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GoldPlayButton3D = dynamic(
  () => import("./gold-play-button-3d").then(m => ({ default: m.GoldPlayButton3D })),
  { ssr: false, loading: () => null },
);

/**
 * three.js is ~185KB of the page's JavaScript, for a backdrop rather than
 * content. Imported on mount it lands mid-flight with the hero portrait that
 * decides LCP, so it waits for the first idle slice after load instead — a
 * couple of hundred milliseconds, while the banner is still filling the
 * screen, and nothing further down the page is waiting on it.
 */
export function GoldPlayButtonLazy() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idle = 0, timer = 0;
    const go = () => setReady(true);
    const schedule = () => {
      if (typeof requestIdleCallback === "function") idle = requestIdleCallback(go, { timeout: 1500 });
      else timer = setTimeout(go, 300) as unknown as number;
    };
    // Waiting for `load` keeps it behind the images; if that already fired
    // (a warm cache, a restored tab) go straight to the idle queue.
    if (document.readyState === "complete") schedule();
    else { addEventListener("load", schedule, { once: true }); }
    return () => {
      removeEventListener("load", schedule);
      if (idle) cancelIdleCallback(idle);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return ready ? <GoldPlayButton3D /> : null;
}
