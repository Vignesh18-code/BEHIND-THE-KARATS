/**
 * The episodes in the cascade. Edit this file; nothing else needs to change.
 *
 * One card per entry, in episode order — the first entry leads the cascade. The helix they sit on is a fixed shape — see
 * `SPIRAL_SPAN` in `lib/spiral.ts` — so adding or removing an episode changes
 * how many cards ride it, not how tightly it winds.
 */
export type Film = {
  /** The clip that rides the helix. */
  video: string;
  /** The full episode on YouTube; the card is a link to it. */
  href: string;
  /** Drawn small under the card and as the eyebrow of the overlay. */
  episode: string;
  /** The name under the card. */
  guest: string;
  /** Carries the overlay, so it wants to be a headline, not a full title. */
  title: string;
  /** The line the overlay sets under the headline. */
  subtitle: string;
};

export const films: Film[] = [
  { video: '/media/5.mp4', href: 'https://youtu.be/AkApe4MIjHg',
    episode: 'EP 1', guest: 'Shri. Nandakumar',
    title: 'Jewellers, Tax & Truth', subtitle: 'An IRS Officer Speaks' },
  { video: '/media/3.mp4', href: 'https://youtu.be/yvVcvfZDlMo',
    episode: 'EP 2', guest: 'SS Alam',
    title: 'AI & Hyper Local Sourcing', subtitle: 'Redefining the Fine Jewellery Market' },
  { video: '/media/1.mp4', href: 'https://youtu.be/d5rM51Gaek4',
    episode: 'EP 4', guest: 'Srinivasan',
    title: 'From ₹100 to Jewellery Empire', subtitle: 'AI, Innovation & Future' },
  { video: '/media/2.mp4', href: 'https://youtu.be/DPnfNZ1utSo',
    episode: 'EP 5', guest: 'K. Karthik',
    title: 'From Jewellery Roots to Bullion Pioneer', subtitle: 'On Silver & Growth' },
  // Unnumbered, so it brings up the rear rather than interrupting the run.
  { video: '/media/4.mp4', href: 'https://youtu.be/GiM-vxTt48Y',
    episode: 'Trailer', guest: 'Nithin',
    title: 'Market Truth: The Rise of Silver', subtitle: "Gen Z's Future Industry" },
];
