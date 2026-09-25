"use client";

import { useEffect, useRef, useState } from "react";

/** Frame 130 of 312 — the logo fully settled, matching the poster. */
const SETTLED_TIME = 130 / 30;

export function HeroLogo() {
  const video = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let onscreen = true;
    const syncPlayback = () => {
      if (document.hidden || !onscreen || manuallyPaused.current) { el.pause(); return; }
      if (motion.matches) {
        el.pause();
        // Hold on the settled logo rather than the near-empty first frame.
        if (el.currentTime < SETTLED_TIME) el.currentTime = SETTLED_TIME;
      } else void el.play().catch(() => {});
    };

    // The markup asks for none of this file, so the parser cannot put 250KB in
    // front of the portrait and the mic — which are the whole first screen.
    // Hydration is where it gets asked for instead. It has to be explicit: a
    // bare play() on a video that has been told to preload nothing will not
    // start the fetch in a backgrounded tab, and then there is no `canplay` to
    // retry on either, leaving the logo stopped on its empty opening frame.
    // Raising `preload` is enough to start it — calling load() as well fetches
    // the file twice.
    el.preload = "auto";
    syncPlayback();
    const retry = () => syncPlayback();
    const observer = new IntersectionObserver(([entry]) => {
      onscreen = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(el);
    el.addEventListener("canplay", syncPlayback);
    document.addEventListener("visibilitychange", retry);
    motion.addEventListener("change", syncPlayback);
    return () => {
      observer.disconnect();
      el.pause();
      el.removeEventListener("canplay", syncPlayback);
      document.removeEventListener("visibilitychange", retry);
      motion.removeEventListener("change", syncPlayback);
    };
  }, []);

  return <button className="hero-logo" type="button"
    aria-label={`${playing ? "Pause" : "Play"} Behind the Karats logo animation`}
    onClick={() => {
      manuallyPaused.current = playing;
      if (playing) video.current?.pause();
      else void video.current?.play().catch(() => {});
    }}>
    <video ref={video} muted loop playsInline preload="none"
      poster="/images/logo-poster.webp" width={1920} height={1080}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onEnded={() => setPlaying(false)} aria-hidden="true">
      <source src="/images/logo.mp4" type="video/mp4" />
    </video>
  </button>;
}
