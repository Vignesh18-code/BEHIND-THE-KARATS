"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Ease desktop wheel input; leave touch momentum and reduced-motion scrolling
 * to the browser so swipes remain directly attached to the user’s gesture.
 */
export function SmoothScroll() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(pointer: coarse)");
    let lenis: Lenis | null = null;
    let frame = 0;

    const start = () => {
      if (lenis || motion.matches || touch.matches) return;
      lenis = new Lenis({ duration: 0.75, wheelMultiplier: 1, syncTouch: false });
      const raf = (time: number) => { lenis?.raf(time); frame = requestAnimationFrame(raf); };
      frame = requestAnimationFrame(raf);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = null;
    };

    // Route in-page anchors through Lenis so easing matches the wheel feel.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -80 });
      else target.scrollIntoView({ behavior: motion.matches ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    };

    const sync = () => { if (motion.matches || touch.matches) stop(); else start(); };
    sync();
    motion.addEventListener("change", sync);
    touch.addEventListener("change", sync);
    document.addEventListener("click", onClick);
    return () => { touch.removeEventListener("change", sync); motion.removeEventListener("change", sync); document.removeEventListener("click", onClick); stop(); };
  }, []);

  return null;
}
