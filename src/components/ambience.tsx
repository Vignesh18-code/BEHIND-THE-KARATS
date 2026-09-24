"use client";

import { useEffect, useRef } from "react";

/** Film grain, floating gold orbs, and the gold cursor follower. */
export function Ambience() {
  const glow = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let x = innerWidth / 2, y = innerHeight / 2, gx = x, gy = y, frame = 0;

    const move = (event: PointerEvent) => { x = event.clientX; y = event.clientY; };
    const raf = () => {
      gx += (x - gx) * 0.09;
      gy += (y - gy) * 0.09;
      if (glow.current) glow.current.style.transform = `translate3d(${gx - 160}px, ${gy - 160}px, 0)`;
      if (dot.current) dot.current.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    window.addEventListener("pointermove", move, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", move); };
  }, []);

  return <>
    <div id="cursor-glow" ref={glow} className="pointer-events-none fixed left-0 top-0 z-50" aria-hidden="true" />
    <div id="cursor-dot" ref={dot} className="pointer-events-none fixed left-0 top-0 z-50" aria-hidden="true" />
    <div className="film-grain" aria-hidden="true" />
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />
    </div>
  </>;
}
