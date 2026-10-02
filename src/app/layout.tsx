import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Ambience } from "@/components/ambience";
import "./globals.css";

/**
 * Only the weights the page actually renders, measured off the live DOM rather
 * than guessed: Cinzel at 600/700/900 (plus 400 as the stand-in for Glitz),
 * Cormorant in italic alone, and the whole Jakarta range for body copy.
 *
 * Only Jakarta is preloaded. The first screen is the title-film banner — the
 * portrait and the mic, with no serif text on it — so preloading Cinzel and
 * Cormorant only puts ~55KB in front of the image that decides LCP. They load
 * from the stylesheet as their sections come up.
 */
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400","600","700","900"], variable: "--font-cinzel-src", display: "swap", preload: false });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400"], style: ["italic"], variable: "--font-cormorant-src", display: "swap", preload: false });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["300","400","500","600","700"], variable: "--font-jakarta-src", display: "swap" });

/**
 * The fade-up entrances, started without waiting for React.
 *
 * Content in a Reveal is hidden until it scrolls into view. Left to the React
 * component, "into view" could only be noticed once every script had downloaded
 * and the page had hydrated — on a phone, seconds after the first screen was
 * already drawn, with its headline still invisible. This watches the same
 * elements, with the same threshold and margin, from the moment the document is
 * parsed. The animation itself is untouched: same CSS, same staggered delays.
 *
 * `data-js` is only set where the observer exists, so a browser that cannot
 * run this keeps everything visible.
 */
const REVEAL_BOOT = `(function () {
  if (!("IntersectionObserver" in window)) return;
  document.documentElement.dataset.js = "";
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (!entries[i].isIntersecting) continue;
      entries[i].target.setAttribute("data-visible", "true");
      io.unobserve(entries[i].target);
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  window.__reveal = io;
  document.addEventListener("DOMContentLoaded", function () {
    var els = document.querySelectorAll(".reveal-fade");
    for (var i = 0; i < els.length; i++) {
      if (still) els[i].setAttribute("data-visible", "true");
      else io.observe(els[i]);
    }
  });
})();`;

export const metadata: Metadata = {
  title: "Behind The Karats | Real Conversations ft. Vikas Singhvi",
  description: "Real conversations with the people shaping jewellery, business, legacy and everything behind the karats. Hosted by Vikas Singhvi.",
  robots: { index: false, follow: true },
};

export const viewport: Viewport = { themeColor: "#08080b" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // `data-js` is written by the inline script below, before React hydrates.
  return <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${jakarta.variable}`} suppressHydrationWarning>
    <body className="bg-noir text-light antialiased">
      {/* Runs during parse, ahead of the content it applies to, so entrance
          animations can hide content without a flash — and if scripts never
          run at all, nothing is hidden. It also starts those entrances itself
          (see REVEAL_BOOT) rather than leaving them to React. */}
      <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOT }} />
      {/* Every heading on the page is Glitz, so it is worth fetching alongside
          the stylesheet instead of after it. Next hoists this into <head>. */}
      <link rel="preload" href="/Glitz/glitz.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <a className="skip-link" href="#main">Skip to content</a>
      <SmoothScroll />
      <Ambience />
      {children}
    </body>
  </html>;
}
