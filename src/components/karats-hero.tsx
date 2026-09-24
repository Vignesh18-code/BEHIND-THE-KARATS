import { GoldPlayButton3D } from "./gold-play-button-3d";
import { Reveal } from "./reveal";
import { IconInstagram, IconSpin, IconYouTube } from "./icons";
import { SOCIAL } from "@/lib/site-content";

export function KaratsHero() {
  return <section id="hero" className="section-space relative flex min-h-[74svh] items-center justify-center overflow-hidden">
    <GoldPlayButton3D />

    <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-noir via-noir/55 to-noir/80" />
    <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)]" />

    <div className="pointer-events-none relative z-20 site-container flex flex-col items-center text-center">
      <Reveal className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-gold/5 px-4 py-1.5 shadow-[0_0_20px_rgba(212,175,55,0.15)] backdrop-blur-md">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
        </span>
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-light">The Premier Jewellery &amp; Business Talkshow</span>
      </Reveal>

      <Reveal as="h2" delay={80} className="mb-6 max-w-5xl font-glitz text-[clamp(2rem,6.7vw,6rem)] font-normal leading-[1.08] text-white">
        BEHIND THE <span className="gold-gradient-text gold-shimmer">KARATS.</span>
      </Reveal>

      {/* This line crosses the lit face of the play button, so it carries its own
          contrast: full-strength text plus a soft shadow, rather than the muted
          grey the other body copy uses against flat black. */}
      <Reveal as="p" delay={160} className="mx-auto mb-10 max-w-3xl font-sans text-lg font-light leading-relaxed tracking-wide text-light [text-shadow:0_1px_14px_rgba(0,0,0,.85)] sm:text-xl md:text-2xl">
        Real conversations with the people shaping jewellery, business, legacy and everything <span className="font-medium text-gold-light">behind the karats</span>.
      </Reveal>

      <Reveal delay={240} className="pointer-events-auto flex w-full flex-col items-center gap-4 sm:w-auto md:flex-row md:gap-6">
        <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer"
          className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-black shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(212,175,55,0.55)] sm:w-auto">
          <IconYouTube className="h-4 w-4 transition-transform group-hover:scale-110" />
          <span>Watch on YouTube</span>
        </a>
        <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-5 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold/5 hover:text-gold sm:w-auto">
          <IconInstagram className="h-4 w-4" />
          <span>Follow on Instagram</span>
        </a>
      </Reveal>

      <Reveal delay={300} className="mt-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-white/40">
        <IconSpin className="h-3 w-3 animate-spin-slow text-gold/60" />
        <span>Drag to rotate the 3D gold play button &bull; Scroll to explore</span>
      </Reveal>
    </div>
  </section>;
}
