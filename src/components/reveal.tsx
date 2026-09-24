"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/** Fades content up once it enters the viewport. */
export function Reveal({ children, as: Tag = "div", className = "", delay = 0 }: {
  children: ReactNode; as?: ElementType; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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

  return <Tag ref={ref} className={`reveal-fade ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
    {children}
  </Tag>;
}
