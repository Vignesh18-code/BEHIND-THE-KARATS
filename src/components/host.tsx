import { HostShort } from "./host-short";
import { Reveal } from "./reveal";
import { HOST } from "@/lib/site-content";

export function Host() {
  return <section id="host" className="relative z-20 overflow-hidden border-t border-white/5 bg-noir-light/60 section-space">
    <div className="site-container">
      <div className="grid gap-8 sm:gap-10 lg:gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <Reveal className="flex justify-center lg:justify-start">
          <HostShort />
        </Reveal>

        <Reveal delay={100}>
          <span className="inline-block rounded-full border border-gold/30 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">Meet The Host</span>
          <h2 className="mt-5 font-glitz text-4xl font-normal tracking-tight text-white sm:text-5xl">{HOST.name.toUpperCase()}</h2>
          <p className="mt-4 font-cormorant text-2xl italic text-light-muted">{HOST.motto}</p>
          <p className="mt-6 text-sm leading-relaxed text-light-muted">{HOST.intro}</p>
          <blockquote className="mt-8 border-l-2 border-gold pl-6 font-cormorant text-xl italic leading-relaxed text-white">
            &ldquo;{HOST.pullQuote}&rdquo;
            <footer className="mt-3 font-sans text-[10px] uppercase tracking-[0.25em] not-italic text-gold-muted">— Vikas Singhvi</footer>
          </blockquote>
          <div className="mt-8 rounded-2xl border border-gold/20 bg-gold/5 p-6">
            <h4 className="font-glitz text-sm font-normal uppercase tracking-wider text-gold">◆ Then Came Behind The Karats</h4>
            <p className="mt-3 text-sm leading-relaxed text-light-muted">{HOST.showNote}</p>
          </div>
        </Reveal>
      </div>
    </div>
  </section>;
}
