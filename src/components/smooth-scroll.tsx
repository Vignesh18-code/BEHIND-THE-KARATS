"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

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
    let generation = 0;

    const raf = (time: number) => {
      lenis?.raf(time);
      frame = lenis?.isScrolling === "smooth" ? requestAnimationFrame(raf) : 0;
    };
    const wake = () => {
      if (!lenis || frame || document.hidden) return;
      // Reset the clock after idle so the next gesture does not jump to its end.
      lenis.time = performance.now();
      frame = requestAnimationFrame(raf);
    };

    const start = async () => {
      if (lenis || motion.matches || touch.matches) return;
      const request = ++generation;
      const { default: Lenis } = await import("lenis");
      if (request !== generation || motion.matches || touch.matches) return;
      lenis = new Lenis({ duration: 0.75, wheelMultiplier: 1, syncTouch: false });
      lenis.on("virtual-scroll", wake);
    };

    const stop = () => {
      generation++;
      cancelAnimationFrame(frame);
      frame = 0;
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
      if (lenis) { lenis.scrollTo(target as HTMLElement, { offset: -80 }); wake(); }
      else target.scrollIntoView({ behavior: motion.matches ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    };

    const sync = () => { if (motion.matches || touch.matches) stop(); else void start(); };
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else if (lenis?.isScrolling === "smooth") wake();
    };
    sync();
    motion.addEventListener("change", sync);
    touch.addEventListener("change", sync);
    document.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", visibility);
    return () => { touch.removeEventListener("change", sync); motion.removeEventListener("change", sync); document.removeEventListener("click", onClick); document.removeEventListener("visibilitychange", visibility); stop(); };
  }, []);

  return null;
}
