import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { testimonials } from "../content/generated/testimonials";
import { Plus, Arrow, ArrowBack } from "./ui/Icons";

const featured = testimonials.filter((item) => item.featured);
const all = testimonials;
const pad = (value: number) => String(value).padStart(2, "0");
const AUTOPLAY_MS = 9000;

/**
 * 10 — Testimonials. A slow, infinite loop in which a small gradient card on
 * the left is promoted into the large focus card on the right. All 26 original
 * quotations, with their exact names/titles/companies, remain on the page:
 * five featured in the loop and 21 in an accessible expandable panel.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const current = featured[index];

  // Infinite loop — only while on screen, not hovered/focused, motion allowed.
  useEffect(() => {
    const node = regionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || paused || open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % featured.length), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [visible, paused, open, index]);

  const select = (i: number) => setIndex((i + featured.length) % featured.length);
  const step = (delta: number) => select(index + delta);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  };

  return (
    <section id="testimonials" className="section testimonials theme-white" aria-labelledby="testimonials-title">
      <div className="wrap">
        <header className="sec-head testimonials__head">
          <div className="sec-head__main">
            {/* "Client Testimonials" is a transitional section label (not original copy). */}
            <h2 id="testimonials-title" className="t-h2" data-reveal data-split="words">
              Client Testimonials
            </h2>
          </div>
          <p className="sec-head__aside" data-reveal style={{ "--d": "120ms" } as CSSProperties}>
            Our clients don’t just get noticed – they get chosen.
          </p>
        </header>

        <div
          ref={regionRef}
          className="tst"
          role="group"
          aria-roledescription="carousel"
          aria-label="Featured client testimonials"
          onKeyDown={onKeyDown}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) setPaused(false);
          }}
        >
          <div className="tst__side">
            <p className="tst__side-label">Select a story</p>
            <ul className="tst__stack">
              {featured.filter((_, i) => i !== index).map((item) => {
                const i = featured.indexOf(item);
                return (
                  <li key={item.name}>
                    <button type="button" className="tst__mini" onClick={() => select(i)} aria-label={`Read the testimonial from ${item.name}, ${item.company}`}>
                      <span className="tst__mini-num">{pad(i + 1)}</span>
                      <span className="tst__mini-body">
                        <span className="tst__mini-name">{item.name}</span>
                        <span className="tst__mini-company">{item.company}</span>
                      </span>
                      <Arrow />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="tst__numbers" aria-label="Jump to testimonial">
              {featured.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  className="tst__number"
                  data-active={i === index ? "" : undefined}
                  aria-label={`Testimonial ${i + 1}: ${item.name}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => select(i)}
                >
                  {pad(i + 1)}
                </button>
              ))}
            </div>

            <div className="tst__controls">
              <button type="button" className="icon-btn" aria-label="Previous testimonial" onClick={() => step(-1)}>
                <ArrowBack />
              </button>
              <button type="button" className="icon-btn" aria-label="Next testimonial" onClick={() => step(1)}>
                <Arrow />
              </button>
            </div>
          </div>

          <div className="tst__focus">
            <span className="tst__quote-mark" aria-hidden="true">
              “
            </span>
            <figure className="tst__card" key={current.name}>
              <blockquote className="tst__quote">
                {current.quote.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </blockquote>
              <figcaption className="tst__by">
                <span className="tst__by-rule" aria-hidden="true" />
                <span>
                  <strong className="tst__name">{current.name}</strong>
                  <span className="tst__role">{current.title}</span>
                  <span className="tst__company">{current.company}</span>
                </span>
                <span className="tst__index" aria-hidden="true">
                  {pad(index + 1)} / {pad(featured.length)}
                </span>
              </figcaption>
            </figure>
          </div>
        </div>

        <p className="visually-hidden" aria-live="polite">
          Testimonial {index + 1} of {featured.length}: {current.name}, {current.company}.
        </p>

        <div className="testimonials__all">
          <button
            type="button"
            className="testimonials__toggle"
            aria-expanded={open}
            aria-controls="more-testimonials"
            onClick={() => setOpen((value) => !value)}
          >
            <span>
              {open ? "Hide" : "Read"} all client testimonials
            </span>
            <Plus />
          </button>

          <div id="more-testimonials" className="testimonials__panel" data-open={open ? "" : undefined} inert={!open}>
            <div>
              <ul className="testimonials__grid">
                {all.map((item) => (
                  <li key={`${item.name}-${item.company}`}>
                    <figure className="mini-quote">
                      <blockquote>
                        {item.quote.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </blockquote>
                      <figcaption>
                        <strong>{item.name}</strong>
                        {item.title}
                        <br />
                        {item.company}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
