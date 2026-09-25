"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const GoldPlayButton3D = dynamic(
  () => import("./gold-play-button-3d").then(m => ({ default: m.GoldPlayButton3D })),
  { ssr: false, loading: () => null },
);

/** Fetch the renderer shortly before its section enters the viewport. */
export function GoldPlayButtonLazy() {
  const sentinel = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = sentinel.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setReady(true);
      observer.disconnect();
    }, { rootMargin: "300px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <>
    <div ref={sentinel} className="pointer-events-none absolute inset-0" aria-hidden="true" />
    {ready && <GoldPlayButton3D />}
  </>;
}
