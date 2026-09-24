"use client";

import { useEffect, useRef, useState } from "react";

const SHORT_ID = "7RVOmp3d2Lk";

/**
 * The host Short, playing bare — no device frame, no card, lightly rounded.
 * The player is mounted only once the section scrolls into view, so YouTube's
 * (~1MB) iframe isn't pulled down on initial page load.
 */
export function HostShort() {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      setMount(true);
      io.disconnect();
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // loop=1 needs playlist set to the same id for a single video
  const params = new URLSearchParams({
    autoplay: reduced ? "0" : "1",
    mute: "1",
    loop: "1",
    playlist: SHORT_ID,
    controls: reduced ? "1" : "0",
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
  });

  return <div ref={ref} className="aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-2xl bg-black">
    {mount && <iframe
      className="block h-full w-full rounded-2xl"
      src={`https://www.youtube.com/embed/${SHORT_ID}?${params}`}
      title="Redefining the Jewellery Industry ft. Vikas Singhvi"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />}
  </div>;
}
