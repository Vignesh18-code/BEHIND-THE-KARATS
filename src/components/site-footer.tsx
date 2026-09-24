import Image from "next/image";
import { IconInstagram, IconYouTube } from "./icons";
import { SOCIAL } from "@/lib/site-content";

export function SiteFooter() {
  return <footer className="relative z-20 border-t border-white/10 bg-black py-12 text-xs text-light-muted">
    <div className="site-container flex flex-col items-center gap-8 md:flex-row md:justify-between">
      <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-4">
        <Image src="/images/logo-mark.png" alt="Behind The Karats" width={875} height={554} className="h-10 w-auto" />
        <div className="text-center md:text-left">
          <p className="font-cinzel text-sm font-bold tracking-[0.2em] text-white">BEHIND THE KARATS</p>
          <p className="mt-1 tracking-wider text-gold-muted">ft. Vikas Singhvi — Real people. Real journeys. Beyond the karats.</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {[{ href: SOCIAL.instagram, Icon: IconInstagram, label: "Instagram" },
          { href: SOCIAL.youtube, Icon: IconYouTube, label: "YouTube" }].map(({ href, Icon, label }) =>
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition-all hover:-translate-y-0.5 hover:border-gold hover:text-gold">
            <Icon className="h-4 w-4" />
          </a>)}
      </div>
    </div>
    <p className="mt-10 border-t border-white/5 px-5 pt-6 text-center text-[11px] tracking-wider">
      © {new Date().getFullYear()} Behind the Karats. All rights reserved.
      <span className="mt-1 block sm:ml-2 sm:mt-0 sm:inline">
        Designed by{" "}
        <a href="https://theelitedesigns.in" target="_blank" rel="noopener noreferrer"
          className="text-gold-muted underline-offset-4 transition-colors hover:text-gold hover:underline">
          EliteDesigns
        </a>
      </span>
    </p>
  </footer>;
}
