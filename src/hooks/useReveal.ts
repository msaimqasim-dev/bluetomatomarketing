import { useLayoutEffect } from "react";
import type { CSSProperties } from "react";

/**
 * Scroll-reveal controller. One IntersectionObserver watches every
 * [data-reveal] element and marks it [data-in] the first time it enters the
 * viewport; CSS (base.css) does the animation. With reduced motion — or
 * without IntersectionObserver — everything is shown immediately.
 */
export function useReveal() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.setAttribute("data-in", ""));
      return;
    }

    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);
}

/** Helper for passing CSS custom properties through the `style` prop. */
export const cssVars = (vars: Record<string, string | number>) => vars as CSSProperties;
