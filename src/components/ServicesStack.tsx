import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { fullServiceRange, serviceCards, serviceSummaries } from "../content/services";
import { services } from "../content/site";
import { cssVars } from "../hooks/useReveal";
import { Arrow, ArrowBack, ArrowUpRight, Plus } from "./ui/Icons";
import { LiveLink } from "./ui/LiveLink";
import { Picture } from "./ui/Picture";

const COUNT = serviceCards.length;
const LAST = COUNT - 1;
const STATIC_QUERY = "(prefers-reduced-motion: reduce), (max-height: 600px)";
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => n * n * (3 - 2 * n);

type Box = { x: number; y: number; width: number; height: number };
const interpolate = (a: Box, b: Box, t: number): Box => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  width: a.width + (b.width - a.width) * t,
  height: a.height + (b.height - a.height) * t,
});

/** Images, not whole content cards, travel through three measured slots.
 * The current image shrinks to the upper-left; the lower-right thumbnail
 * expands into the focus slot. Copy stays in its own column throughout. */
export function ServicesStack() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const previousRef = useRef<HTMLButtonElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const visualRefs = useRef<(HTMLElement | null)[]>([]);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLSpanElement>(null);
  const currentRef = useRef(0);
  const jumpRef = useRef<((index: number) => void) | null>(null);
  const [active, setActive] = useState(0);
  const [staticMode, setStaticMode] = useState(
    () => typeof window !== "undefined" && window.matchMedia(STATIC_QUERY).matches,
  );

  useLayoutEffect(() => {
    const media = window.matchMedia(STATIC_QUERY);
    const update = () => setStaticMode(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    const scene = sceneRef.current;
    const previous = previousRef.current;
    const focus = focusRef.current;
    const next = nextRef.current;
    if (staticMode || !track || !sticky || !scene || !previous || !focus || !next) return;

    let raf = 0;
    let disposed = false;
    let headerHeight = 0;
    let travel = 1;
    let slots: { previous: Box; focus: Box; next: Box };

    // Read geometry only on resize. Absolute image bounds do not disturb the
    // document layout; object-fit keeps crops correct while thumbnails grow.
    const measure = () => {
      const origin = scene.getBoundingClientRect();
      const local = (el: HTMLElement): Box => {
        const r = el.getBoundingClientRect();
        return { x: r.x - origin.x, y: r.y - origin.y, width: r.width, height: r.height };
      };
      headerHeight = parseFloat(getComputedStyle(sticky).top) || 0;
      travel = Math.max(1, track.offsetHeight - sticky.offsetHeight);
      slots = { previous: local(previous), focus: local(focus), next: local(next) };
    };

    const drawImage = (index: number, box: Box, opacity: number, layer: number) => {
      const node = visualRefs.current[index];
      if (!node) return;
      node.style.visibility = opacity > 0.005 ? "visible" : "hidden";
      node.style.opacity = String(opacity);
      node.style.width = `${box.width}px`;
      node.style.height = `${box.height}px`;
      node.style.transform = `translate3d(${box.x}px, ${box.y}px, 0)`;
      node.style.zIndex = String(layer);
    };

    const paint = () => {
      raf = 0;
      if (disposed || !slots) return;
      const p = clamp((headerHeight - track.getBoundingClientRect().top) / travel);
      const position = p * LAST;
      const step = Math.min(LAST, Math.floor(position));
      // Rest briefly on each composition before moving the two images.
      const t = step === LAST ? 0 : ease(clamp((position - step - 0.38) / 0.62));

      for (let i = 0; i < COUNT; i++) {
        const offset = i - step;
        if (offset === -1) {
          drawImage(i, slots.previous, 1 - t, 1);
        } else if (offset === 0) {
          drawImage(i, interpolate(slots.focus, slots.previous, t), 1, 3);
        } else if (offset === 1) {
          drawImage(i, interpolate(slots.next, slots.focus, t), 1, 4);
        } else if (offset === 2 && t > 0) {
          drawImage(i, slots.next, t, 1);
        } else {
          const image = visualRefs.current[i];
          if (image) image.style.visibility = "hidden";
        }

        const copy = copyRefs.current[i];
        if (!copy) continue;
        const outgoing = i === step;
        const incoming = i === step + 1;
        // Keep copy hidden while the growing image crosses its column.
        const alpha = outgoing ? 1 - clamp(t / 0.22) : incoming ? clamp((t - 0.82) / 0.18) : 0;
        copy.style.opacity = String(alpha);
        copy.style.visibility = alpha > 0.005 ? "visible" : "hidden";
        copy.style.transform = `translate3d(0, ${outgoing ? -12 * t : 16 * (1 - t)}px, 0)`;
      }

      const selected = Math.min(LAST, step + (t >= 0.5 ? 1 : 0));
      if (selected !== currentRef.current) {
        currentRef.current = selected;
        setActive(selected);
      }
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
    };

    const request = () => {
      if (!disposed && !raf) raf = requestAnimationFrame(paint);
    };
    const resize = () => {
      measure();
      request();
    };

    jumpRef.current = (index) => {
      const top = track.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({
        top: top + (Math.max(0, Math.min(LAST, index)) / LAST) * travel,
        behavior: "smooth",
      });
    };

    const ro = new ResizeObserver(resize);
    ro.observe(scene);
    ro.observe(sticky);
    resize();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", resize);
    document.fonts.ready.then(() => !disposed && resize());

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", resize);
      jumpRef.current = null;
    };
  }, [staticMode]);

  const goTo = useCallback((index: number) => jumpRef.current?.(index), []);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    goTo(currentRef.current + (event.key === "ArrowRight" ? 1 : -1));
  };

  return (
    <section id="services" className="section svc theme-off" aria-labelledby="services-title">
      <div className="wrap">
        <header className="sec-head svc__heading">
          <div className="sec-head__main">
            <p className="eyebrow" data-reveal>Services</p>
            <h2 id="services-title" className="t-h2" data-reveal data-split="words">Core Capabilities</h2>
          </div>
          <p className="sec-head__aside" data-reveal style={cssVars({ "--d": "120ms" })}>
            We don&apos;t approach marketing as a series of disconnected tactics. We design cohesive ecosystems where every
            channel, message, and asset works together to strengthen perception and drive results.
          </p>
        </header>
      </div>

      {staticMode ? (
        <div className="wrap svc__static">
          {serviceCards.map((card, index) => (
            <article className="svc__static-item" key={card.id}>
              <div className="svc__static-image"><Picture image={card.image} sizes="(min-width: 768px) 46vw, 90vw" /></div>
              <div className="svc__copy-content"><ServiceCopy index={index} /></div>
            </article>
          ))}
        </div>
      ) : (
        <div className="svc__track" ref={trackRef} style={cssVars({ "--steps": LAST })}>
          <div className="svc__sticky" ref={stickyRef}>
            <div className="wrap svc__inner">
              <div className="svc__scene" ref={sceneRef} role="group" onKeyDown={onKeyDown} aria-label="Services. Scroll or use the controls to explore.">
                <button
                  className="svc__thumbnail svc__thumbnail--previous"
                  ref={previousRef}
                  type="button"
                  disabled={active === 0}
                  onClick={() => goTo(active - 1)}
                  aria-label={active > 0 ? `Previous service: ${serviceCards[active - 1].name}` : "Previous service"}
                >
                  <span className="svc__thumbnail-label">Previous</span>
                </button>

                <div className="svc__focus-slot" ref={focusRef} role="img" aria-label={serviceCards[active].image.alt} />

                <div className="svc__images" aria-hidden="true">
                  {serviceCards.map((card, index) => (
                    <figure
                      key={card.id}
                      className="svc__visual"
                      ref={(el) => { visualRefs.current[index] = el; }}
                    >
                      <Picture image={{ ...card.image, alt: "" }} sizes="(min-width: 1024px) 43vw, (min-width: 768px) 44vw, 65vw" eager />
                    </figure>
                  ))}
                </div>

                <div className="svc__descriptions">
                  {serviceCards.map((card, index) => (
                    <div
                      className="svc__copy"
                      key={card.id}
                      ref={(el) => { copyRefs.current[index] = el; }}
                      inert={index !== active}
                      aria-hidden={index !== active}
                    >
                      <ServiceCopy index={index} />
                    </div>
                  ))}
                </div>

                <button
                  className="svc__thumbnail svc__thumbnail--next"
                  ref={nextRef}
                  type="button"
                  disabled={active === LAST}
                  onClick={() => goTo(active + 1)}
                  aria-label={active < LAST ? `Next service: ${serviceCards[active + 1].name}` : "Next service"}
                >
                  <span className="svc__thumbnail-label">Up next <Arrow /></span>
                </button>
              </div>

              <div className="svc__rail">
                <span className="svc__hint">Scroll to explore</span>
                <span className="svc__progress-track" aria-hidden="true"><span ref={progressRef} className="svc__progress-bar" /></span>
                <div className="svc__controls" onKeyDown={onKeyDown}>
                  <button className="icon-btn" type="button" disabled={active === 0} aria-label="Previous service" onClick={() => goTo(active - 1)}><ArrowBack /></button>
                  <button className="icon-btn" type="button" disabled={active === LAST} aria-label="Next service" onClick={() => goTo(active + 1)}><Arrow /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="wrap svc__bottom">
        <details className="svc__directory">
          <summary><span>Explore every capability</span><Plus /></summary>
          <div className="svc__directory-grid">
            {serviceCards.map((card) => (
              <article className="svc__directory-item" key={card.id}>
                <h3>{card.name}</h3>
                <p>{card.headline}</p>
                {card.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <ul>{card.includes.map((item) => <li key={item}>{item}</li>)}</ul>
                <LiveLink className="link-arrow" href={card.href}><span className="link-arrow__text">Explore {card.name}</span><Arrow /></LiveLink>
              </article>
            ))}
          </div>
        </details>
        <div className="svc__bottom-row">
          <div className="svc__range" data-reveal>
            <p className="eyebrow">Full service range</p>
            <ul className="svc__range-list">{fullServiceRange.map((name) => <li key={name}>{name}</li>)}</ul>
          </div>
          <nav className="svc__links" aria-label="Browse services by category" data-reveal>
            <p className="eyebrow">View by Category</p>
            <ul>{services.map((service) => <li key={service.id}><LiveLink href={service.href}>{service.name}<ArrowUpRight /></LiveLink></li>)}</ul>
          </nav>
        </div>
      </div>
      {!staticMode && <p className="visually-hidden" role="status">Service {active + 1} of {COUNT}: {serviceCards[active].name}.</p>}
    </section>
  );
}

function ServiceCopy({ index }: { index: number }) {
  const card = serviceCards[index];
  return (
    <>
      <p className="svc__number"><span aria-hidden="true">[</span> {String(index + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")} <span aria-hidden="true">]</span></p>
      <h3 className="svc__name">{card.name}</h3>
      <p className="svc__summary">{serviceSummaries[index]}</p>
      <LiveLink className="link-arrow svc__link" href={card.href}><span className="link-arrow__text">Explore {card.name}</span><Arrow /></LiveLink>
    </>
  );
}
