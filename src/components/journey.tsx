"use client";

import { useState } from "react";
import { chapters } from "@/lib/content";

export function Journey() {
  const [active, setActive] = useState(0);
  const chapter = chapters[active];
  return <div className="journey-layout"><div className="chapter-tabs" role="tablist" aria-label="Story chapters">{chapters.map((item, index) => <button key={item.number} id={`chapter-tab-${index}`} role="tab" aria-selected={active === index} aria-controls="chapter-panel" tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => { let next = index; if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % chapters.length; else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + chapters.length - 1) % chapters.length; else if (event.key === "Home") next = 0; else if (event.key === "End") next = chapters.length - 1; else return; event.preventDefault(); setActive(next); document.getElementById(`chapter-tab-${next}`)?.focus(); }}><span>{item.number}</span>{item.label}<span aria-hidden="true">↗</span></button>)}</div><div className="chapter-content" id="chapter-panel" role="tabpanel" aria-labelledby={`chapter-tab-${active}`} tabIndex={0}><span className="eyebrow">CHAPTER {chapter.number}</span><h3>{chapter.title}</h3><p>{chapter.body}</p><span className="chapter-tag">{chapter.tag}</span><span className="chapter-watermark" aria-hidden="true">{chapter.number}</span></div></div>;
}
