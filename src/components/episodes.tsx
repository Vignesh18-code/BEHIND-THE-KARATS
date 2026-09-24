"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "./reveal";
import { IconClose, IconPlay } from "./icons";
import { SHORTS } from "@/lib/site-content";

const thumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/oardefault.jpg`;
/** Every video has `hqdefault`; only some have the original-aspect thumbnail. */
const fallback = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export function Episodes() {
  const [open, setOpen] = useState<string | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  // Modal: lock scroll, trap focus, close on Escape, restore focus on exit.
  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(null); return; }
      if (event.key !== "Tab") return;
      const focusables = dialog.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
      if (!focusables?.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      restoreTo.current?.focus();
    };
  }, [open]);

  return <section id="episodes" className="relative z-20 border-t border-white/5 section-space">
    <div className="site-container">
      {/* Headline and standfirst sit on one line, aligned along their baseline,
          rather than stacked down the left edge. */}
      <Reveal className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.65fr)] lg:items-end lg:gap-16">
        <div>
          <span className="flex items-center gap-3 font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            <span className="h-px w-8 bg-gold/45" aria-hidden="true" />Unfiltered Conversations
          </span>
          <h2 className="mt-5 font-glitz text-[clamp(2.25rem,5.2vw,4.25rem)] font-normal leading-[0.95] tracking-tight text-white">
            Some stories are meant to <span className="gold-gradient-text">travel further.</span>
          </h2>
        </div>
        <p className="max-w-sm border-l border-white/10 pl-5 text-sm leading-relaxed text-light-muted md:pb-2">
          Stories of ambition, legacy, decisions, failures, reinvention and everything success posts usually leave out.
        </p>
      </Reveal>

      <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-medium uppercase tracking-[0.25em] text-light-muted">
        <span>{SHORTS.length} Shorts</span>
        <span className="hidden sm:inline">Tap to play</span>
      </div>
    </div>

    {/* The reel runs on its own; the track holds the list twice so the loop
        never shows a seam, and only the first copy is reachable. */}
    <div className="reel mt-9" aria-label="Shorts reel" data-lenis-prevent>
      <div className="reel-track">
        {[0, 1].map(copy => <div key={copy} className="reel-run" aria-hidden={copy === 1 || undefined}>
          {SHORTS.map(id => <button key={`${copy}-${id}`} type="button" className="reel-card"
            tabIndex={copy === 1 ? -1 : 0} onClick={() => setOpen(id)} aria-label="Play short">
            <Image src={thumbnail(id)} alt="" fill sizes="220px" unoptimized
              onError={event => { event.currentTarget.src = fallback(id); }} />
            <span className="reel-play"><IconPlay className="h-4 w-4 translate-x-0.5" /></span>
          </button>)}
        </div>)}
      </div>
    </div>

    {open && <div data-lenis-prevent className="shorts-overlay fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={event => { if (event.target === event.currentTarget) setOpen(null); }}>
      <div ref={dialog} role="dialog" aria-modal="true" aria-label="Shorts player" tabIndex={-1}
        className="shorts-dialog w-full max-w-[420px] overflow-hidden rounded-2xl border border-gold/25 bg-noir-card shadow-2xl outline-none">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gold">Behind The Karats</span>
          <button type="button" onClick={() => setOpen(null)} aria-label="Close player" className="flex h-11 w-11 shrink-0 items-center justify-center text-light-muted hover:text-gold">
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        <iframe className="block aspect-[9/16] w-full bg-black"
          src={`https://www.youtube-nocookie.com/embed/${open}?autoplay=1&rel=0&playsinline=1`}
          title="Behind The Karats short" allow="autoplay; encrypted-media; picture-in-picture; web-share" allowFullScreen />
      </div>
    </div>}
  </section>;
}
