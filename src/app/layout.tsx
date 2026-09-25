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

export const metadata: Metadata = {
  title: "Behind The Karats | Real Conversations ft. Vikas Singhvi",
  description: "Real conversations with the people shaping jewellery, business, legacy and everything behind the karats. Hosted by Vikas Singhvi.",
  robots: { index: false, follow: true },
};

export const viewport: Viewport = { themeColor: "#08080b" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${jakarta.variable}`}>
    <body className="bg-noir text-light antialiased">
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
