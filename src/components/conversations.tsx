"use client";

import { useState } from "react";
import { episodes } from "@/lib/content";

export function Conversations() {
  const [index, setIndex] = useState(0);
  const episode = episodes[index];
  return <div className="episode-panel">
    <div className="episode-info" aria-live="polite" aria-atomic="true">
      <span className="eyebrow">{episode.category}</span>
      <h3>{episode.name}</h3><p>{episode.topic}</p>
    </div>
    <a className="text-link" href={`https://www.youtube.com/watch?v=${episode.id}`} target="_blank" rel="noopener noreferrer">Watch conversation <span aria-hidden="true">↗</span></a>
    <div className="carousel-controls"><span className="counter">0{index + 1} <span>/ 0{episodes.length}</span></span><button aria-label="Previous conversation" onClick={() => setIndex((index + episodes.length - 1) % episodes.length)}>←</button><button aria-label="Next conversation" onClick={() => setIndex((index + 1) % episodes.length)}>→</button></div>
  </div>;
}
