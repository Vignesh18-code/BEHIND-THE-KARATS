import Image from "next/image";
import { GROUP_SECTION, GROUP_PEOPLE } from "@/lib/site-content";

/**
 * Where each person sits in the photo, as percentages of the source frame
 * (1634 x 962). Measured from the two photographs rather than estimated: `zone` is the
 * column the pointer has to be in, and `reveal` is the stencil cut out of the
 * waving copy.
 *
 * The stencil is a stepped column, not a plain rectangle, because everyone
 * raises the hand towards the person on their left: above the waistline
 * (44.7%) it reaches left far enough to hold its own hand, and stops short on
 * the right so the neighbour's hand never appears with it. Below that line it
 * is simply the person's own column.
 *
 * Every edge sits on a column where the two photographs are pixel-identical,
 * found by diffing them, so a stencil can neither clip its own person's change
 * nor carry a sliver of the neighbour's. It also stops at 64.4%: nothing about
 * a person changes below the knee, but the two exports differ slightly around
 * the shoes, which would otherwise flicker on hover.
 */
const SLOTS = [
  { zone: "polygon(0% 8%, 15.728% 8%, 15.728% 96%, 0% 96%)",
    reveal: "polygon(0.061% 0%, 14.137% 0%, 14.137% 44.699%, 15.728% 44.699%, 15.728% 64.449%, 0% 64.449%, 0% 44.699%, 0.061% 44.699%)",
    cardX: 7.864 },
  { zone: "polygon(15.728% 8%, 28.274% 8%, 28.274% 96%, 15.728% 96%)",
    reveal: "polygon(14.259% 0%, 26.438% 0%, 26.438% 44.699%, 28.274% 44.699%, 28.274% 64.449%, 15.728% 64.449%, 15.728% 44.699%, 14.259% 44.699%)",
    cardX: 22.001 },
  { zone: "polygon(28.274% 8%, 41.922% 8%, 41.922% 96%, 28.274% 96%)",
    reveal: "polygon(26.561% 0%, 39.963% 0%, 39.963% 44.699%, 41.922% 44.699%, 41.922% 64.449%, 28.274% 64.449%, 28.274% 44.699%, 26.561% 44.699%)",
    cardX: 35.098 },
  { zone: "polygon(41.922% 8%, 54.774% 8%, 54.774% 96%, 41.922% 96%)",
    reveal: "polygon(40.086% 0%, 54.468% 0%, 54.468% 44.699%, 54.774% 44.699%, 54.774% 64.449%, 41.922% 64.449%, 41.922% 44.699%, 40.086% 44.699%)",
    cardX: 48.348 },
  { zone: "polygon(54.774% 8%, 68.727% 8%, 68.727% 96%, 54.774% 96%)",
    reveal: "polygon(54.59% 0%, 67.319% 0%, 67.319% 44.699%, 68.727% 44.699%, 68.727% 64.449%, 54.774% 64.449%, 54.774% 44.699%, 54.59% 44.699%)",
    cardX: 61.75 },
  { zone: "polygon(68.727% 8%, 82.987% 8%, 82.987% 96%, 68.727% 96%)",
    reveal: "polygon(67.442% 0%, 80.355% 0%, 80.355% 44.699%, 82.987% 44.699%, 82.987% 64.449%, 68.727% 64.449%, 68.727% 44.699%, 67.442% 44.699%)",
    cardX: 75.857 },
  { zone: "polygon(82.987% 8%, 100% 8%, 100% 96%, 82.987% 96%)",
    reveal: "polygon(80.477% 0%, 100% 0%, 100% 44.699%, 100% 64.449%, 82.987% 64.449%, 82.987% 44.699%, 80.477% 44.699%)",
    cardX: 91.493 },
] as const;

export function GroupWave() {
  return <section id="group" className="relative z-20 bg-noir section-space">
    <div className="site-container">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="flex items-center gap-3 font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            <span className="h-px w-8 bg-gold/45" aria-hidden="true" />{GROUP_SECTION.kicker}
          </span>
          <h2 className="mt-5 font-glitz text-[clamp(2rem,4.4vw,3.5rem)] font-normal leading-[0.95] tracking-tight text-white">
            {GROUP_SECTION.title}
          </h2>
        </div>
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-light-muted">
          <span className="wave-note-hover">{GROUP_SECTION.note}</span>
          <span className="wave-note-touch">{GROUP_SECTION.touchNote}</span>
        </p>
      </div>

      {/* Two photos of the same line-up, one waving. Each person gets a copy of
          the waving one cut down to their own silhouette, invisible until the
          pointer is in their column — so only they answer. */}
      {/* All photo layers share the same fluid frame so the full line-up fits on phones. */}
      <figure className="wave-group mt-12" aria-label="The Behind The Karats line-up">
        <div className="wave-frame">
        <Image className="wave-base" src="/media/group.png" alt={GROUP_SECTION.alt}
          width={1634} height={962} sizes="(max-width: 1280px) 100vw, 1280px" />
        {SLOTS.map((slot, i) => {
          const person = GROUP_PEOPLE[i];
          const named = Boolean(person?.name);
          return <div key={i} className="wave-person">
            <Image className="wave-hi" src="/media/grouphandup.png" alt="" aria-hidden="true"
              width={1634} height={962} sizes="(max-width: 1280px) 100vw, 1280px" style={{ clipPath: slot.reveal }} />
            {person?.href
              ? <a className="wave-zone" style={{ clipPath: slot.zone }} href={person.href}
                  target="_blank" rel="noopener noreferrer" aria-label={`${person.name} — watch the episode`} />
              : <button type="button" className="wave-zone border-0 bg-transparent p-0" style={{ clipPath: slot.zone }} aria-label={person?.name ? `Show details for ${person.name}` : "Wave to this guest"} />}
            {named && <figcaption className="wave-card" style={{ left: `clamp(min(26vw, 120px), ${slot.cardX}%, calc(100% - min(26vw, 120px)))` }}>
              <strong>{person.name}</strong>
              {person.role && <span>{person.role}</span>}
              {person.href && <em>▶ Play episode</em>}
            </figcaption>}
          </div>;
        })}
        </div>
      </figure>
    </div>
  </section>;
}
