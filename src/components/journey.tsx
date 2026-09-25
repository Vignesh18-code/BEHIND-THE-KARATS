"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "./reveal";
import { IconAtom, IconBriefcase, IconScale, IconShop } from "./icons";
import { JOURNEY, TIMELINE } from "@/lib/site-content";

const NODE_ICONS = { shop: IconShop, briefcase: IconBriefcase, atom: IconAtom, scale: IconScale } as const;

export function Journey() {
  const track = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  // Scroll wakes the rail; frames continue until its existing easing settles.
  useEffect(() => {
    const el = track.current, bar = rail.current;
    if (!el || !bar) return;
    let frame = 0;
    let nearby = false;
    // Empty as the first chapter comes up from the fold, full once the last one
    // has settled above the middle of the screen.
    const target = () => {
      const rect = el.getBoundingClientRect();
      return Math.min(1, Math.max(0, (innerHeight * .75 - rect.top) / (rect.height + innerHeight * .1)));
    };
    let shown = target();
    const paint = () => { bar.style.transform = `scaleY(${shown.toFixed(4)})`; };
    paint();
    const render = () => {
      frame = 0;
      const want = target();
      // Easing towards the target rather than snapping to it keeps the fill
      // gliding through the frames where the scroll position barely moves.
      shown += (want - shown) * .14;
      if (Math.abs(want - shown) < .0004) shown = want;
      paint();
      if (shown !== want) wake();
    };
    function wake() {
      if (nearby && !document.hidden && !frame) frame = requestAnimationFrame(render);
    }
    const watch = new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting;
      if (nearby) wake();
      else { cancelAnimationFrame(frame); frame = 0; }
    }, { rootMargin: "250px 0px" });
    watch.observe(el);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    document.addEventListener("visibilitychange", wake);
    return () => {
      watch.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      document.removeEventListener("visibilitychange", wake);
    };
  }, []);

  return <section id="journey" className="relative z-20 overflow-hidden border-t border-white/5 bg-noir-light/60 section-space">
    <div className="site-container">
      <Reveal className="max-w-2xl">
        <span className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold">{JOURNEY.kicker}</span>
        <h3 className="mt-3 font-glitz text-4xl font-normal leading-[1.05] text-white sm:text-5xl">
          The Ground-Up <span className="gold-gradient-text gold-shimmer">Journey</span>
        </h3>
        <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-light-muted">{JOURNEY.sub}</p>
      </Reveal>

      <div ref={track} className="relative mt-16">
        {/* progress rail — a hairline, not a timeline spine */}
        <div className="absolute left-0 top-0 hidden h-full w-px bg-white/10 md:block" aria-hidden="true">
          {/* `scaleY` rather than `height`: the fill rides the compositor, so it
              moves with the scroll instead of relaying out on every frame. */}
          <div ref={rail} className="h-full w-px origin-top bg-gradient-to-b from-gold-light to-gold [will-change:transform]"
            style={{ transform: "scaleY(0)" }} />
        </div>

        <ol className="md:pl-10">
          {TIMELINE.map((item, i) => {
            const Icon = NODE_ICONS[item.icon];
            const current = "current" in item && item.current;
            return <Reveal as="li" key={item.year} delay={i * 90}
              className="group relative border-t border-white/8 last:border-b">
              {/* gold wash on hover */}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-gold/[0.07] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
              {/* accent bar slides in from the left */}
              <span className="pointer-events-none absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 bg-gradient-to-b from-gold-light to-gold transition-transform duration-500 group-hover:scale-y-100" aria-hidden="true" />

              <div className="relative grid gap-4 py-9 transition-transform duration-500 group-hover:translate-x-2 md:grid-cols-[120px_minmax(0,1fr)] xl:grid-cols-[160px_minmax(0,1fr)_auto] md:items-start md:gap-10 md:py-11">
                {/* numeral + year */}
                <div className="flex items-center gap-4 md:w-auto md:flex-col md:items-start md:gap-2">
                  <span className="font-cinzel text-5xl font-black leading-none text-white/[0.07] transition-colors duration-500 group-hover:text-gold/20 md:text-6xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`font-cinzel text-sm font-bold tracking-[0.15em] ${current ? "gold-gradient-text" : "text-gold/80"}`}>
                    {item.year}
                  </span>
                </div>

                {/* body */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-500 ${
                      current ? "bg-gold text-black" : "bg-white/[0.06] text-gold group-hover:bg-gold/15"}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <h4 className="font-glitz text-lg font-normal leading-snug text-white transition-colors duration-500 group-hover:text-gold-light sm:text-xl">
                      {item.title}
                    </h4>
                  </div>
                  <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-light-muted">{item.body}</p>
                  {"extra" in item && item.extra && <p className="mt-2 max-w-xl text-sm font-light leading-relaxed text-light-muted">{item.extra}</p>}
                </div>

                {/* aside */}
                <div className="md:col-start-2 xl:col-start-auto xl:pt-1 xl:text-right">
                  {current
                    ? <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                        <span className="phone-pulse h-1.5 w-1.5 rounded-full bg-gold" />Now
                      </span>
                    : <span className="text-[10px] uppercase tracking-[0.2em] text-gold-muted/50">{item.aside}</span>}
                </div>
              </div>
            </Reveal>;
          })}
        </ol>
      </div>
    </div>
  </section>;
}
