"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/** Fades content up once it enters the viewport. */
export function Reveal({ children, as: Tag = "div", className = "", delay = 0 }: {
  children: ReactNode; as?: ElementType; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.visible) return;
    // Normally the observer started inline in the layout is already watching
    // this element; observe() on a watched target is a no-op, and it covers
    // anything mounted after the document was parsed.
    const shared = (window as Window & { __reveal?: IntersectionObserver }).__reveal;
    if (shared) {
      shared.observe(el);
      return () => shared.unobserve(el);
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.visible = "true";
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      el.dataset.visible = "true";
      observer.disconnect();
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // `data-visible` may already have been set by the inline observer before
  // React hydrates; that is expected, not a mismatch.
  return <Tag ref={ref} className={`reveal-fade ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    suppressHydrationWarning>
    {children}
  </Tag>;
}
