"use client";

import Image from "next/image";
import { useState } from "react";
import { House, MoreHorizontal, MoreVertical, Play, Plus, Share2, Sparkle, SquarePlay, ThumbsDown, ThumbsUp, Zap } from "lucide-react";

const VIDEO_ID = "DPnfNZ1utSo";

const EPISODE = {
  title: "EP:4 From ₹100 to Jewellery Empire | AI, Innovation & Legacy",
  handle: "@BehindtheKarats",
  meta: "31 likes  770 views  4 wk ago",
  comments: 3,
} as const;

/** `thumb: null` falls back to a branded tile — drop a path in once we have the still. */
const UP_NEXT = [
  { title: "How He Built Emerald | Srinivasan on Vision & Leadership | Trailer | BTK ft…",
    duration: "2:35", meta: "556 views · 1 month ago", thumb: null },
  { title: "Ep:3 Is Silver Replacing Gold: Gen Z Silver Shift. BIS Hallmarking | Nithin | BTK | ft…",
    duration: "57:57", meta: "792 views · 1 month ago", thumb: null },
  { title: "Market Truth. The Rise of Silver Gen Z's Future Industry | Trailer | Nithin | BTK ft.Vika…",
    duration: "2:14", meta: "399 views · 1 month ago", thumb: null },
  { title: "EP 2 - The AI & Hyper Local Sourcing Redefining Fine Jewellery Market | SS Alam|…",
    duration: "1:07:15", meta: "688 views · 2 months ago", thumb: null },
] as const;

/**
 * Watch screen: player, meta, comments, up-next list and the pinned tab bar.
 * Thumbnail facade — the real embed (and YouTube's ~1MB player) only loads on tap.
 */
export function PhoneYouTubeScreen({ onPlayingChange }: { onPlayingChange?: (playing: boolean) => void }) {
  const [playing, setPlaying] = useState(false);

  return <div className="flex h-full w-full flex-col bg-[#0f0f0f] text-white">
    {/* ── player ── */}
    <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-black">
      {playing ? <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
        title={EPISODE.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      /> : <button type="button" onClick={() => { setPlaying(true); onPlayingChange?.(true); }}
        className="group absolute inset-0 h-full w-full" aria-label={`Play ${EPISODE.title}`}>
        <Image src="/images/ep4-thumb.jpg" alt="" width={720} height={405} sizes="400px" priority
          className="absolute inset-0 h-full w-full object-cover" />
        <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/30" />
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <Play className="h-4 w-4 translate-x-[1px] fill-white text-white" />
        </span>
        <span className="absolute bottom-0 left-0 h-[3px] w-1/3 bg-red-600" />
      </button>}
    </div>

    {/* ── scrolling body ── */}
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="px-4 pt-3">
        <h3 className="text-[14px] font-semibold leading-snug">{EPISODE.title}</h3>
        <p className="mt-1 text-[10px] text-white/55">
          <span className="text-white/85">{EPISODE.handle}</span>{`  ${EPISODE.meta}  `}
          <span className="font-medium text-white/85">...more</span>
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
            <Image src="/images/logo-mark.png" alt="" width={875} height={554} className="h-full w-full object-contain p-0.5" />
          </span>
          <button type="button" className="rounded-full bg-white px-3.5 py-1 text-[11px] font-semibold text-black">Subscribe</button>
        </div>
        <div className="flex items-center gap-3 text-white/90">
          <ThumbsUp className="h-4 w-4" />
          <ThumbsDown className="h-4 w-4" />
          <Share2 className="h-4 w-4" />
          <Sparkle className="h-4 w-4" />
          <MoreHorizontal className="h-4 w-4" />
        </div>
      </div>

      <div className="mx-4 mt-3 rounded-xl bg-white/[0.07] p-2.5">
        <p className="text-[11px] font-semibold">Comments <span className="ml-1 font-normal text-white/55">{EPISODE.comments}</span></p>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-5 w-5 shrink-0 rounded-full bg-white/15" />
          <span className="flex-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] text-white/40">Comment...</span>
        </div>
      </div>

      {/* up next — fills the space under the comments */}
      <div className="mt-4 px-3 pb-3">
        {UP_NEXT.map(item => <div key={item.title} className="mb-3 flex gap-2.5">
          <div className="relative aspect-video w-[38%] shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#26262e] to-[#14141a]">
            {item.thumb ? <Image src={item.thumb} alt="" width={720} height={405} sizes="160px"
              className="absolute inset-0 h-full w-full object-cover" />
              : <span className="absolute inset-0 flex items-center justify-center">
                  <Image src="/images/logo-mark.png" alt="" width={875} height={554} className="w-[70%] opacity-40" />
                </span>}
            <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-px text-[8px] font-medium tabular-nums">{item.duration}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-3 text-[10px] font-medium leading-snug">{item.title}</p>
            <p className="mt-1 text-[8px] text-white/50">{item.meta}</p>
          </div>
          <MoreVertical className="mt-0.5 h-3 w-3 shrink-0 text-white/70" />
        </div>)}
      </div>
    </div>

    {/* ── pinned tab bar ── */}
    <nav className="flex shrink-0 items-center justify-around border-t border-white/10 bg-[#0f0f0f] px-2 pb-6 pt-2">
      <Tab Icon={House} label="Home" active />
      <Tab Icon={Zap} label="Shorts" />
      <div className="flex flex-col items-center gap-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15"><Plus className="h-4 w-4" /></span>
      </div>
      <Tab Icon={SquarePlay} label="Subscriptions" dot />
      <div className="flex flex-col items-center gap-1">
        <span className="h-[18px] w-[18px] overflow-hidden rounded-full bg-white">
          <Image src="/images/logo-mark.png" alt="" width={875} height={554} className="h-full w-full object-contain" />
        </span>
        <span className="text-[8px] text-white/70">You</span>
      </div>
    </nav>
  </div>;
}

function Tab({ Icon, label, active = false, dot = false }:
  { Icon: typeof House; label: string; active?: boolean; dot?: boolean }) {
  return <div className="flex flex-col items-center gap-1">
    <span className="relative">
      <Icon className={`h-[18px] w-[18px] ${active ? "fill-white text-white" : "text-white/85"}`} />
      {dot && <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-red-600" />}
    </span>
    <span className={`text-[8px] ${active ? "font-medium text-white" : "text-white/70"}`}>{label}</span>
  </div>;
}
