import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raj Shamani — Always Figuring Out",
  description: "An independent fan tribute to the conversations, curiosity, and entrepreneurial spirit of Raj Shamani.",
  robots: { index: false, follow: true },
};

export const viewport: Viewport = { themeColor: "#080808" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
