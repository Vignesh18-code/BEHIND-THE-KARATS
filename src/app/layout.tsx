import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Ambience } from "@/components/ambience";
import "./globals.css";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400","500","600","700","800","900"], variable: "--font-cinzel-src", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300","400","600"], style: ["normal","italic"], variable: "--font-cormorant-src", display: "swap" });
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
      <a className="skip-link" href="#main">Skip to content</a>
      <SmoothScroll />
      <Ambience />
      {children}
    </body>
  </html>;
}
