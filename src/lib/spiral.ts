/**
 * Layout, camera and timeline values read out of Scheme Engine's homepage
 * bundle (scheme-engine.pages.dev/main.js). Names mirror the original where
 * the original has one, so the two can be diffed by hand.
 */
export const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const power2InOut = (t: number) => t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
const power1InOut = (t: number) => t < .5 ? 2 * t ** 2 : 1 - (-2 * t + 2) ** 2 / 2;

/** `this.pWidth` / `this.pHeight`: the spiral planes are 6 units wide, 16:9. */
export const PLANE_WIDTH = 6;
export const PLANE_HEIGHT = PLANE_WIDTH * 9 / 16;
/** `this.options.rotationY`: every plane is yawed two degrees. */
export const ROTATION_Y = Math.PI / 90;
/** The card element is authored at 100px per world unit. */
export const PX_PER_UNIT = 100;
/** `f` in `startIntroTimeline`: the scrubbed timeline is 21.06 seconds long. */
export const TIMELINE_END = 21.06;
/** `m = d * 1.6`: where the scroll ease changes from power2.inOut to power1.inOut. */
export const SPIRAL_EASE_CHANGE = 30 * .365 * 1.6;
/**
 * The recreation opens at the storytelling section. 6.7 is where the original's
 * camera tween lands on (0, 6.5, 20) and the hero reels have left the frame.
 */
export const STORY_START = 6.7;

export type Camera = { y: number; z: number };

/**
 * `startIntroTimeline` moves the camera three times:
 *
 *     c.to(camera.position, {x: 0, y: 3,   z: 7,  duration: 2  }, 0.9)
 *     c.to(camera.position, {x: 0, y: 6.5, z: 20, duration: 2.5}, 4.2)   // p-3 + (0,2,8)
 *     c.to(camera.position, {y: 0,               duration: 4  }, 6.5)
 *
 * The last two overlap on y between 6.5 and 6.7. GSAP renders children in
 * insertion order, so the later tween wins there, and it captures its start
 * value as y stood at 6.5 rather than at the 6.7 the middle tween was heading
 * for — hence `HANDOVER_Y` rather than a flat 6.5.
 */
const HANDOVER_Y = 3 + 3.5 * power2InOut((6.5 - 4.2) / 2.5);

export function cameraAt(time: number): Camera {
  const toSeven = power2InOut(clamp((time - .9) / 2));
  const toTwenty = power2InOut(clamp((time - 4.2) / 2.5));
  const z = 2 + 5 * toSeven + 13 * toTwenty;
  const y = time >= 6.5
    ? HANDOVER_Y * (1 - power2InOut(clamp((time - 6.5) / 4)))
    : 3 * toSeven + 3.5 * toTwenty;
  return { y, z };
}

/** The two scrubbed `scrollProgress` tweens, as one function of timeline time. */
export function progressAt(time: number) {
  const join = power2InOut(SPIRAL_EASE_CHANGE / 30);
  return time <= SPIRAL_EASE_CHANGE
    ? power2InOut(time / 30)
    : join + (1.15 - join) * power1InOut((time - SPIRAL_EASE_CHANGE) / (TIMELINE_END - SPIRAL_EASE_CHANGE));
}

/**
 * Where the scrub stops. The original runs its timeline to `TIMELINE_END`, but
 * the last card has left the frame by about 15.7 seconds and everything after
 * that is an empty screen. Stopping just past that keeps the whole cascade and
 * ends the section on it, so the next one follows immediately. It also stays
 * inside the first easing segment, so the cards keep one continuous pace.
 */
export const TIMELINE_STOP = 15.9;

export function timelineAt(fraction: number) {
  const time = STORY_START + clamp(fraction) * (TIMELINE_STOP - STORY_START);
  return { time, progress: progressAt(time), camera: cameraAt(time) };
}

/**
 * How much of the original's scroll length to keep. The reference paces roughly
 * twelve viewport heights for nineteen films; five films over that distance is
 * a lot of scrolling for very little movement, so the whole sequence is
 * compressed. Raise it for a longer, slower read.
 */
export const SCROLL_SCALE = .34;

/** `getHomeScrollEndDistance`, compressed by `SCROLL_SCALE`. */
export function scrollDistance(width: number, height: number) {
  const fullJourney = Math.round((width < 768 ? 1800 : 2600) * TIMELINE_END / 30) / 100;
  return height * fullJourney * (TIMELINE_STOP - STORY_START) / TIMELINE_END * SCROLL_SCALE;
}

export type Profile = ReturnType<typeof viewportProfile>;

/** `interpolateToWidth` + `applyAspectAwareFov` + `getSpiralLayoutMetrics`. */
export function viewportProfile(width: number, height: number, coarse = false) {
  const smallPhone = width < 430;
  const phone = width < 768;
  const tablet = width >= 768 && width < 1024;
  const interpolated = 75 + 40 * clamp(width / 390);
  let fov = width > 1024 ? 75 : width > 520 ? Math.max(75, interpolated * .9) : interpolated;
  const aspect = width / Math.max(height, 1);
  if (aspect >= 1.45 && coarse && height <= 600) {
    fov = Math.min(fov, 2 * Math.atan(Math.tan(121 * Math.PI / 360) / aspect) * 180 / Math.PI);
  } else if (aspect < 1.45) {
    fov = Math.min(92, fov + 14 * clamp((1.45 - Math.max(aspect, .75)) / .7));
  }
  const layout = smallPhone
    ? { radius: 10.7, planeScale: 1, labelScale: 1.78, verticalScale: .88, verticalSpread: 1.75, singleLabel: true, labelClearanceScale: 1.4, labelLineGapScale: 1.32 }
    : phone
      ? { radius: 11.9, planeScale: 1.08, labelScale: 1.72, verticalScale: .92, verticalSpread: 1.75, singleLabel: true, labelClearanceScale: 1.35, labelLineGapScale: 1.28 }
      : tablet
        ? { radius: 12.8, planeScale: .78, labelScale: 1.06, verticalScale: .96, verticalSpread: 1, singleLabel: false, labelClearanceScale: 1, labelLineGapScale: 1.08 }
        : { radius: 14.5, planeScale: .85, labelScale: 1, verticalScale: 1, verticalSpread: 1, singleLabel: false, labelClearanceScale: 1, labelLineGapScale: 1 };
  return { ...layout, fov, aspect, width, height, phone, smallPhone, tablet };
}

/** Pixels per world unit at one unit of depth. */
export const focalLength = (height: number, fov: number) => height / (2 * Math.tan(fov * Math.PI / 360));

/** Paint order stands in for the depth buffer; nearer planes sit on top. */
export const depthIndex = (z: number) => Math.round((z + 20) * 10);

/**
 * The original sizes the helix from its own plane count: `totalHeight` is
 * `count * 2`, and one revolution, one card gap and the starting offset are all
 * fractions of it. That coupling means fewer cards wind the helix tighter — at
 * five planes it turns a full revolution every ten units of travel instead of
 * every thirty-eight, and the cascade collapses into one short diagonal.
 *
 * So the shape is pinned to the reference's nineteen planes and the number of
 * cards drawn on it is independent. Five cards then read as the first five of
 * the reference's cascade rather than as a different, tighter spiral.
 */
export const REFERENCE_PLANES = 19;
export const SPIRAL_SPAN = REFERENCE_PLANES * 2;
export const CARD_SPACING = SPIRAL_SPAN / (REFERENCE_PLANES - 2);
/**
 * Where the cards sit at the start of the run. The reference drops them a full
 * .7 of the helix below the camera, which is the back of the cylinder: from
 * there a card crawls up through the flat far side, level with the ones behind
 * it, before the helix ever swings it out to a side of the frame. That crawl is
 * the snake. Starting them a third of the way down instead puts the first thing
 * you see at the near end of the left-hand sweep.
 */
export const INITIAL_OFFSET_Y = SPIRAL_SPAN * .32;

/**
 * `slot` is the card's place on the helix, in units of `CARD_SPACING`. The
 * reference uses 0, 1, 2 … for its nineteen cards; a fractional or negative
 * slot rides the same helix further along, which is how a handful of cards can
 * be spread around it instead of clustering on one side.
 */
export function projectCard(slot: number, progress: number, width: number, height: number, camera: Camera, coarse = false) {
  const total = SPIRAL_SPAN;
  const start = -slot * CARD_SPACING - INITIAL_OFFSET_Y;
  const end = (-slot * CARD_SPACING + INITIAL_OFFSET_Y + total) * .93;
  const spiralY = start + (end - start) * progress;
  const angle = spiralY / total * Math.PI * 2;
  const profile = viewportProfile(width, height, coarse);
  const z = profile.radius * Math.cos(angle);
  const x = profile.radius * Math.sin(angle);
  const y = spiralY * profile.verticalSpread;
  const focal = focalLength(height, profile.fov);
  // The camera pulls back from z = 2 to z = 20 over the hero sequence, so a
  // card can sit behind it early on; those have no projection at all.
  const depth = camera.z - z;
  const behindCamera = depth <= .1;
  const factor = focal / depth;
  const planeWidth = PLANE_WIDTH * factor * profile.planeScale;
  // Project the actual two-degree world rotation, instead of adding a second,
  // unrelated CSS perspective after projecting the card into screen space.
  const unit = profile.planeScale / PX_PER_UNIT;
  const sin = Math.sin(ROTATION_Y) * unit;
  const cos = Math.cos(ROTATION_Y) * unit;
  const cx = width / 2, cy = height / 2;
  const halfW = PLANE_WIDTH * PX_PER_UNIT / 2, halfH = PLANE_HEIGHT * PX_PER_UNIT / 2;
  const leftDepth = depth - halfW * sin;
  const matrix = [
    (cx * sin + focal * cos) / depth, cy * sin / depth, 0, sin / depth,
    0, focal * unit / depth, 0, 0,
    0, 0, 1, 0,
    (cx * leftDepth + focal * (x - halfW * cos)) / depth,
    (cy * leftDepth - focal * (y - camera.y + halfH * unit)) / depth,
    0, leftDepth / depth,
  ];
  return {
    behindCamera,
    x: cx + x * factor,
    y: cy - (y - camera.y) * factor,
    width: planeWidth,
    height: planeWidth * 9 / 16,
    depth: z,
    // `h` in updatePositions: 0 when the card passes the camera.
    distance: Math.abs(spiralY / total),
    /** Signed `distance`: where the card sits on the helix, in revolutions. */
    travel: spiralY / total,
    transform: `matrix3d(${matrix.join(',')})`,
  };
}

/**
 * The two overlays, as one function of scroll: the opening copy clears before
 * the episode title arrives, and the title holds until the last card is gone.
 */
export function storyPhase(progress: number) {
  return {
    opening: 1 - smoothstep(.02, .12, progress),
    // The episode title holds until the last card is off, and the section ends
    // there — no closing card, nothing to scroll past once the films are done.
    category: smoothstep(.12, .22, progress) * (1 - smoothstep(.92, .99, progress)),
  };
}

/**
 * A card is drawn for exactly one pass. `travel` is its place on the helix in
 * revolutions, so a window narrower than a full turn (1) is what stops a card
 * coming round a second time: it lifts out of the depth low in the frame, grows
 * as it swings past the camera, and is gone again on the way back out.
 */
export const CARD_ENTER = -.28;
export const CARD_EXIT = .34;
export function cardOpacity(travel: number) {
  return smoothstep(CARD_ENTER, CARD_ENTER + .08, travel) * (1 - smoothstep(CARD_EXIT - .16, CARD_EXIT, travel));
}

/** Cards buffer a little before their fade-in, so none of them pops in black. */
export const shouldLoad = (travel: number) => travel > CARD_ENTER - .15 && travel < CARD_EXIT + .06;
