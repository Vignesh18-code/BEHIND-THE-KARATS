"use client";

import { useEffect, useRef, useState } from "react";

/** Frame 130 of 312 — the logo fully settled, matching the poster. */
const SETTLED_TIME = 130 / 30;

export function HeroLogo() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      const el = video.current;
      if (!el) return;
      if (motion.matches) {
        el.pause();
        // Hold on the settled logo rather than the near-empty first frame.
        if (el.currentTime < SETTLED_TIME) el.currentTime = SETTLED_TIME;
      } else void el.play().catch(() => {});
    };
    syncPlayback();
    motion.addEventListener("change", syncPlayback);
    return () => motion.removeEventListener("change", syncPlayback);
  }, []);

  return <button className="hero-logo" type="button"
    aria-label={`${playing ? "Pause" : "Play"} Behind the Karats logo animation`}
    onClick={() => {
      if (playing) video.current?.pause();
      else void video.current?.play().catch(() => {});
    }}>
    <video ref={video} muted loop playsInline preload="auto"
      poster="/images/logo-poster.png" width={1920} height={1080}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onEnded={() => setPlaying(false)} aria-hidden="true">
      <source src="/images/logo.mp4" type="video/mp4" />
    </video>
  </button>;
}
