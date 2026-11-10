import { useLayoutEffect } from "react";

/**
 * Site-wide motion layer.
 *
 * - Splits plain `[data-split="words"]` headings into masked words for a
 *   staggered line-by-line reveal (DOM-built, so original text stays intact
 *   for SEO and assistive technology).
 * - Writes a `--parallax` offset to `[data-parallax]` elements from one
 *   scroll-driven requestAnimationFrame loop.
 * - Fills the fixed scroll-progress bar.
 *
 * Enter/exit visibility itself is owned by useReveal's IntersectionObserver;
 * this hook never hides content on its own. Everything is a no-op for people
 * who prefer reduced motion (CSS also neutralises the transforms).
 */
export function useMotion() {
  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- Split headlines ------------------------------------------------ */
    document.querySelectorAll<HTMLElement>('[data-split="words"]').forEach((el) => {
      if (el.dataset.splitDone || el.children.length) return;
      const words = (el.textContent || "").trim().split(/\s+/);
      if (!words.length) return;
      const fragment = document.createDocumentFragment();
      words.forEach((word, index) => {
        const outer = document.createElement("span");
        outer.className = "word";
        outer.style.setProperty("--wi", String(index));
        const inner = document.createElement("span");
        inner.textContent = word;
        outer.appendChild(inner);
        fragment.appendChild(outer);
        if (index < words.length - 1) fragment.appendChild(document.createTextNode(" "));
      });
      el.textContent = "";
      el.appendChild(fragment);
      el.dataset.splitDone = "";
    });

    /* ---- Line-level reveal for composed headlines ----------------------- */
    document.querySelectorAll<HTMLElement>("[data-lines]").forEach((el) => {
      Array.from(el.children).forEach((child, i) => {
        (child as HTMLElement).style.setProperty("--li", String(i));
      });
    });

    /* ---- Scroll-linked parallax + progress bar -------------------------- */
    const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const bar = document.querySelector<HTMLElement>(".scroll-progress__bar");
    if (reduced || (!parallax.length && !bar)) return;

    let raf = 0;
    const paint = () => {
      raf = 0;
      const vh = window.innerHeight;
      if (bar) {
        const max = document.documentElement.scrollHeight - vh;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
      }
      for (const el of parallax) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) continue;
        const centre = rect.top + rect.height / 2 - vh / 2;
        const amount = Math.max(-1, Math.min(1, centre / vh));
        el.style.setProperty("--parallax", `${(-amount * 26).toFixed(1)}px`);
      }
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, []);
}
