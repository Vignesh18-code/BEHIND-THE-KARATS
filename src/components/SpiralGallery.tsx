'use client';

import { useEffect, useRef, useState } from 'react';
import { films } from '@/lib/films';
import { CASCADE_COPY } from '@/lib/site-content';
import {
  cardOpacity, clamp, depthIndex, PLANE_WIDTH, projectCard, PX_PER_UNIT,
  scrollDistance, shouldLoad, smoothstep, storyPhase, timelineAt,
} from '@/lib/spiral';

/** The card is authored at this width, so a projection is a plain scale of it. */
const CARD_PX = PLANE_WIDTH * PX_PER_UNIT;
/** Decoding every card at once costs more than it shows; the deep ones idle. */
const MAX_PLAYING = 6;
/**
 * A phone has the hero logo and the host Short decoding too, and iOS starts
 * refusing playback well before seven streams. The front cards are the ones
 * big enough to read as motion; the rest hold their poster frame.
 */
const MAX_PLAYING_TOUCH = 3;

export default function SpiralGallery() {
  const runway = useRef<HTMLElement>(null);
  const opening = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const captions = useRef<(HTMLSpanElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  /** Which episode the overlay is naming: whichever card is nearest the camera. */
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    let width = innerWidth, height = innerHeight;
    let distance = scrollDistance(width, height);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = matchMedia('(pointer: coarse)').matches;
    const resize = () => {
      width = runway.current?.clientWidth ?? innerWidth;
      height = runway.current?.querySelector('.stage')?.clientHeight ?? innerHeight;
      distance = scrollDistance(width, height);
      if (runway.current) runway.current.style.height = `${distance + height}px`;
      schedule();
    };
    window.addEventListener('resize', resize);
    const sizeObserver = new ResizeObserver(resize);
    const stage = runway.current?.querySelector<HTMLElement>('.stage') ?? null;
    if (stage) sizeObserver.observe(stage);

    // The stage is pinned with `position: sticky`, and on some phones that
    // simply does not hold — older iPhone WebKit, which Chrome on iOS uses too,
    // lets the stage scroll away and leaves screens of empty runway behind it.
    // Every frame already measures the runway, so check the stage is where a
    // working sticky would put it; if it is not, pin it from here instead with
    // `position: fixed`, which those browsers do handle, and release it at
    // both ends. Where sticky works this never switches on.
    let pinnedByScript = false, pinState = '', pinLeft = -1, pinWidth = -1;
    const pin = (rect: DOMRect) => {
      if (!stage) return;
      if (!pinnedByScript) {
        // As soon as the runway's top has gone past the top of the screen a
        // working sticky stage reads 0; a broken one moves with the page. Judge
        // it on the first frame that can tell them apart, so the stage barely
        // drifts before it is caught. (A wrong call costs nothing: pinned by
        // script looks the same.)
        if (!(rect.top < -3 && rect.bottom > height + 3)) return;
        if (Math.abs(stage.getBoundingClientRect().top) <= 2) return;
        pinnedByScript = true;
        runway.current?.setAttribute('data-pin', 'script');
      }
      const next = rect.top >= 0 ? 'before' : rect.bottom <= height ? 'after' : 'pinned';
      const s = stage.style;
      if (next === 'pinned' && (rect.left !== pinLeft || rect.width !== pinWidth)) {
        pinLeft = rect.left; pinWidth = rect.width;
        s.left = `${rect.left}px`; s.width = `${rect.width}px`;
      }
      if (next === pinState) return;
      pinState = next;
      if (next === 'pinned') { s.position = 'fixed'; s.top = '0'; s.bottom = 'auto'; }
      else {
        pinLeft = pinWidth = -1;
        s.position = 'absolute'; s.left = '0'; s.width = '100%';
        s.top = next === 'before' ? '0' : 'auto';
        s.bottom = next === 'after' ? '0' : 'auto';
      }
    };
    let wasOnscreen = false;
    const render = () => {
      frame = 0;
      const rect = runway.current?.getBoundingClientRect();
      if (!rect) return;
      // Before the off-screen return, so a script-pinned stage is always let go.
      pin(rect);
      const onscreen = rect.top < height && rect.bottom > 0 && !document.hidden;
      // Avoid projecting and writing every card while another section is visible.
      if (!onscreen) {
        if (wasOnscreen) videos.current.forEach(video => video?.pause());
        wasOnscreen = false;
        return;
      }
      wasOnscreen = true;
      const scrolled = clamp(-rect.top / distance);
      const { progress, camera } = timelineAt(scrolled);
      const story = storyPhase(scrolled);
      if (opening.current) opening.current.style.opacity = String(story.opening);
      if (heading.current) heading.current.style.opacity = String(story.category);

      // One pass places every card; the second decides which few of them play.
      const placed = films.map((_, slot) => projectCard(slot, progress, width, height, camera, coarse));
      const opacities = placed.map(card => card.behindCamera ? 0 : cardOpacity(card.travel));
      const nearest = films
        .map((_, slot) => slot)
        .filter(slot => opacities[slot] > .02)
        .sort((a, b) => Math.abs(placed[a].travel) - Math.abs(placed[b].travel));
      const playable = new Set(nearest.slice(0, coarse ? MAX_PLAYING_TOUCH : MAX_PLAYING));
      // The overlay hands over to the next episode as that card takes the front.
      if (nearest.length && nearest[0] !== currentRef.current) {
        currentRef.current = nearest[0];
        setCurrent(nearest[0]);
      }

      films.forEach((film, slot) => {
        const card = cards.current[slot], caption = captions.current[slot], video = videos.current[slot];
        if (!card || !video) return;
        const position = placed[slot];
        const opacity = opacities[slot];
        const visible = onscreen && opacity > .003;
        // A card is mounted for the whole load window, not just for its fade, so
        // that it has buffered a frame by the time it lifts out of the depth.
        const mounted = onscreen && !position.behindCamera && shouldLoad(position.travel);
        const scale = position.width / CARD_PX;
        card.style.transform = position.transform;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(depthIndex(position.depth));
        card.style.visibility = mounted ? 'visible' : 'hidden';
        card.style.pointerEvents = visible ? 'auto' : 'none';
        card.tabIndex = visible ? 0 : -1;
        if (caption) {
          caption.style.transform =
            `translate(${position.x - CARD_PX / 2}px, ${position.y + position.height / 2 + 26 * scale}px) scale(${scale})`;
          // Only the card at the front is captioned. Episode titles are long
          // enough that two neighbours' captions overlap into an unreadable
          // heap, and `travel` is 0 exactly as a card passes the camera — so
          // the caption hands over to the next episode as it takes the front.
          caption.style.opacity = String(opacity * (1 - smoothstep(.04, .13, Math.abs(position.travel))));
          caption.style.visibility = visible ? 'visible' : 'hidden';
          caption.style.zIndex = String(depthIndex(position.depth));
        }
        if (mounted && !video.getAttribute('src')) {
          // Set together, so the still costs nothing until its card is near.
          video.poster = film.poster;
          video.src = film.video;
          video.load();
        }
        const play = visible && playable.has(slot) && !document.hidden && !reduced.matches;
        if (play && video.paused && video.dataset.playing !== 'pending') {
          video.dataset.playing = 'pending';
          video.play().catch(() => {}).finally(() => { delete video.dataset.playing; });
        } else if (!play && !video.paused) video.pause();
        if (reduced.matches && visible && video.readyState >= 1 && !video.dataset.parked) {
          video.currentTime = Math.min(1.5, (video.duration || 0) * .1);
          video.dataset.parked = 'true';
        }
      });
    };
    // Only scroll and size changes affect projection; videos animate natively.
    function schedule() {
      if (!frame) frame = requestAnimationFrame(render);
    }
    resize();
    window.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    reduced.addEventListener('change', schedule);
    const mountedVideos = videos.current;
    mountedVideos.forEach(video => video?.addEventListener('loadedmetadata', schedule));
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', schedule);
      document.removeEventListener('visibilitychange', schedule);
      reduced.removeEventListener('change', schedule);
      mountedVideos.forEach(video => video?.removeEventListener('loadedmetadata', schedule));
      sizeObserver.disconnect();
      mountedVideos.forEach(video => video?.pause());
    };
  }, []);

  const film = films[current];
  return (
    <section ref={runway} className="runway" aria-label="Episodes">
      <div className="stage">
        <div className="c-bg" aria-hidden="true" />
        <div ref={opening} className="gallery-story">
          {CASCADE_COPY.opening.map(line => <p key={line}>{line}</p>)}
        </div>
        <div ref={heading} className="gallery-now" aria-hidden="true">
          <span key={current} className="now-card">
            <span className="now-ep">{film.episode}</span>
            <span className="now-title">{film.title}</span>
            <span className="now-sub">{film.subtitle}</span>
          </span>
        </div>
        <div className="gallery">
          {films.map((entry, slot) => (
            <div key={entry.href} className="plane">
              <a ref={element => { cards.current[slot] = element; }} className="project"
                href={entry.href} target="_blank" rel="noopener noreferrer"
                aria-label={`Watch ${entry.episode}, ${entry.title}, with ${entry.guest} on YouTube`}>
                <span className="picture">
                  <video ref={element => { videos.current[slot] = element; }} muted loop playsInline
                    preload="metadata" disablePictureInPicture aria-hidden="true" />
                </span>
              </a>
              <span ref={element => { captions.current[slot] = element; }} className="caption" aria-hidden="true">
                <span className="label label-guest">{entry.guest}</span>
                <span className="label label-title">{entry.title}</span>
                <span className="label label-ep">{entry.episode}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <noscript><div className="no-script">Please enable JavaScript to explore the scrolling film collection.</div></noscript>
    </section>
  );
}
