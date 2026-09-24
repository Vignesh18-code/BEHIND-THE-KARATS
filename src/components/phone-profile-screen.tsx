"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HOST } from "@/lib/site-content";

const CREDENTIALS = [
  "Director · S.R. Scales",
  "XRF Gold Testing Specialist",
  "Maxsell & A&D Ambassador",
  "Jewellery Technologist",
] as const;

const STATS = [
  { value: 10, suffix: "+", label: "Years" },
  { value: 100, suffix: "+", label: "Guests" },
  { value: 4, suffix: "", label: "Episodes" },
] as const;

/** Runs `on` once the element scrolls into view (always on under reduced motion). */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function useCountUp(target: number, run: boolean, ms = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = reduced ? 1 : Math.min(1, (now - start) / ms);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3)))); // ease-out cubic
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, run, ms]);
  return n;
}

export function PhoneProfileScreen() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [credential, setCredential] = useState(0);

  // Cycle the credential line.
  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setCredential(i => (i + 1) % CREDENTIALS.length), 2600);
    return () => clearInterval(id);
  }, [inView]);


  return <div ref={ref} className="flex h-full w-full flex-col bg-gradient-to-b from-[#14141d] via-[#0b0b12] to-[#08080b] text-white">
    {/* ── hero portrait ── */}
    <div className="relative h-[54%] shrink-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(212,175,55,0.30),transparent_65%)]" />
      <Image src="/images/vikaspic.png" alt={HOST.name} width={860} height={899} sizes="400px" priority
        className={`absolute inset-0 h-full w-full object-cover object-top transition-[transform,opacity] duration-[1600ms] ease-out ${
          inView ? "scale-100 opacity-100" : "scale-[1.12] opacity-0"} phone-kenburns`} />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0b0b12] via-[#0b0b12]/80 to-transparent" />

      <span className={`absolute left-1/2 top-14 -translate-x-1/2 rounded-full border border-gold/50 bg-black/55 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold backdrop-blur-sm transition-all duration-700 ${
        inView ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}>Host</span>
    </div>

    {/* ── identity ── */}
    <div className="px-6 -mt-6 text-center">
      <h3 className={`font-cinzel text-[22px] font-bold tracking-wide transition-all duration-700 delay-150 ${
        inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>{HOST.name.toUpperCase()}</h3>

      <div className="relative mt-1.5 h-4 overflow-hidden">
        {CREDENTIALS.map((c, i) => <span key={c}
          className="absolute inset-x-0 text-[11px] font-medium tracking-wide text-gold transition-all duration-500"
          style={{ opacity: i === credential ? 1 : 0, transform: `translateY(${(i - credential) * 100}%)` }}>{c}</span>)}
      </div>
    </div>

    {/* ── stats ── */}
    <div className="mt-5 grid grid-cols-3 gap-2 px-5">
      {STATS.map((s, i) => <StatTile key={s.label} {...s} run={inView} delay={i * 120} />)}
    </div>

    {/* ── cta ── */}
    <div className="mt-auto px-5 pb-7">
      <button type="button"
        className={`w-full rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-black shadow-lg shadow-gold/20 transition-all duration-700 delay-[650ms] ${
          inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
        Follow The Show
      </button>
    </div>
  </div>;
}

function StatTile({ value, suffix, label, run, delay }: { value: number; suffix: string; label: string; run: boolean; delay: number }) {
  const n = useCountUp(value, run);
  return <div className={`rounded-xl border border-white/8 bg-white/[0.05] py-2.5 text-center transition-all duration-700 ${
    run ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`} style={{ transitionDelay: `${300 + delay}ms` }}>
    <p className="font-cinzel text-[17px] font-bold text-gold">{n}{suffix}</p>
    <p className="mt-0.5 text-[9px] uppercase tracking-widest text-white/50">{label}</p>
  </div>;
}

/** Island shows the show as a live activity. */
export function ShowLiveIsland() {
  return <>
    <div className="flex items-center gap-2">
      <span className="phone-pulse h-2.5 w-2.5 rounded-full bg-emerald-500" />
      <span className="truncate text-[10px] font-medium">Behind The Karats</span>
    </div>
    <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-neutral-900 border border-neutral-700/80">
      <span className="h-1.5 w-1.5 rounded-full bg-indigo-950/80" />
    </span>
  </>;
}
