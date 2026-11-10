import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import type { ShowcaseProject } from "../content/site";
import { cssVars } from "../hooks/useReveal";
import { Arrow, ArrowBack } from "./ui/Icons";

/**
 * 3D cylindrical carousel.
 *
 * Geometry: N cards sit on the outside of a vertical cylinder — card i is
 * rotated `i * step` around Y and pushed out by the radius R, where
 * R = (cardWidth + gap) / (2·tan(π/N)) so neighbours touch with exactly `gap`
 * between them. The ring is pulled back by R so the front card renders at
 * true size, then tilted and rotated as one element.
 *
 * Motion: a single requestAnimationFrame loop owns the rotation and writes
 * transforms straight to the DOM (no React re-render per frame). States:
 *   auto  — continuous drift in `direction`, eased in/out on hover-pause
 *   drag  — pointer delta mapped to arc length on the cylinder
 *   coast — release velocity × momentum, decaying by friction
 *   snap  — springs to the nearest card, holds, then resumes drift
 * The loop stops completely when the section is offscreen.
 */

export type CylinderConfig = {
  cardWidth: number;
  gap: number;
  /** Ring tilt around X in degrees (negative = looking slightly down on it). */
  tilt: number;
  perspective: number;
  /** Drift speed (≈ degrees per second × 2). */
  speed: number;
  direction: "left" | "right";
  /** 0–1: how much release velocity carries into the coast. */
  momentum: number;
  snap: boolean;
  pauseOnHover: boolean;
  parallax: boolean;
};

const DEFAULTS: CylinderConfig = {
  cardWidth: 240,
  gap: 25,
  tilt: -5,
  perspective: 2500,
  speed: 14,
  direction: "left",
  momentum: 0.6,
  snap: true,
  pauseOnHover: true,
  parallax: true,
};

/** Responsive geometry: smaller cards and shallower perspective on small screens. */
function geometryFor(width: number, base: CylinderConfig) {
  if (width < 640) return { cardWidth: 172, perspective: 1300 };
  if (width < 1024) return { cardWidth: 210, perspective: 1900 };
  return { cardWidth: base.cardWidth, perspective: base.perspective };
}

const TAU = 360;
const norm = (deg: number) => ((((deg + 180) % TAU) + TAU) % TAU) - 180;
const DRAG_THRESHOLD = 6;
const RESUME_AFTER = 1800; // ms of stillness after a snap before drift resumes

type Props = {
  items: ShowcaseProject[];
  config?: Partial<CylinderConfig>;
  label: string;
};

export function CylinderCarousel({ items, config, label }: Props) {
  const cfg = { ...DEFAULTS, ...config };
  const count = items.length;
  const step = TAU / count;

  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

  const [geo, setGeo] = useState(() => ({ cardWidth: cfg.cardWidth, perspective: cfg.perspective }));
  const [active, setActive] = useState(0);
  const [introduced, setIntroduced] = useState(false);

  const radius = (geo.cardWidth + cfg.gap) / (2 * Math.tan(Math.PI / count));

  // Mutable animation state (never triggers renders).
  const sim = useRef({
    rot: 0,
    vel: 0,
    mode: "auto" as "auto" | "drag" | "coast" | "snap",
    target: 0,
    driftFactor: 1, // eased 0..1 for smooth hover pause/resume
    hovered: false,
    focusWithin: false,
    visible: false,
    reduced: false,
    resumeAt: 0,
    active: 0,
    px: 0,
    py: 0,
    tpx: 0,
    tpy: 0,
    radius,
    drag: { id: -1, startX: 0, startY: 0, lastX: 0, lastT: 0, moved: false, rotAtStart: 0 },
    suppressClick: false,
  });
  sim.current.radius = radius;

  /* ---------- responsive geometry ---------- */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const update = () => {
      const next = geometryFor(window.innerWidth, cfg);
      setGeo((prev) => (prev.cardWidth === next.cardWidth && prev.perspective === next.perspective ? prev : next));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(root);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- render one frame of state to the DOM ---------- */
  const paint = useCallback(() => {
    const s = sim.current;
    const ring = ringRef.current;
    if (!ring) return;
    const tiltX = cfg.tilt - s.py * 3;
    const shiftX = s.px * 14;
    ring.style.transform = `translate3d(${shiftX}px, 0, ${-s.radius}px) rotateX(${tiltX}deg) rotateY(${s.rot}deg)`;

    let nearest = 0;
    let nearestAbs = 999;
    for (let i = 0; i < count; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const rel = norm(i * step + s.rot);
      const abs = Math.abs(rel);
      if (abs < nearestAbs) {
        nearestAbs = abs;
        nearest = i;
      }
      const c = Math.cos((rel * Math.PI) / 180);
      // Front face is visible through ~100°. The BACK face of cards on the far
      // side of the cylinder fades in faintly, so the eye can follow a card
      // travelling from the front row, over the curve, and around the back —
      // exactly the "front then moves to back" cylinder reading.
      const front = Math.min(1, Math.max(0, (c + 0.16) / 0.5));
      const back = Math.min(1, Math.max(0, (-c - 0.42) / 0.4)) * 0.62;
      const shade = (1 - Math.max(0, c)) * 0.22;
      el.style.setProperty("--front-opacity", front.toFixed(3));
      el.style.setProperty("--back-opacity", back.toFixed(3));
      el.style.setProperty("--shade", shade.toFixed(3));
      el.style.pointerEvents = front < 0.8 || back > 0.1 ? "none" : "";
      el.style.zIndex = String(Math.round(c * 100) + 100);
    }
    if (nearest !== s.active) {
      s.active = nearest;
      setActive(nearest);
    }
  }, [cfg.tilt, count, step]);

  /* ---------- the loop ---------- */
  useEffect(() => {
    const s = sim.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    s.reduced = media.matches;
    const onMedia = () => (s.reduced = media.matches);
    media.addEventListener("change", onMedia);

    let raf = 0;
    let last = performance.now();
    const dirSign = cfg.direction === "left" ? -1 : 1;
    const driftDegPerSec = cfg.speed * 0.5;
    const friction = 3.2; // per second, for the coast

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (s.reduced) {
        s.rot = Math.round(s.rot / step) * step;
        s.vel = 0;
        if (s.mode !== "snap") s.mode = "auto";
      }

      const wantsDrift =
        !s.reduced && !(cfg.pauseOnHover && s.hovered) && !s.focusWithin && s.mode === "auto" && now >= s.resumeAt;
      s.driftFactor += ((wantsDrift ? 1 : 0) - s.driftFactor) * (1 - Math.exp(-dt * 3.5));

      switch (s.mode) {
        case "auto":
          s.rot += dirSign * driftDegPerSec * s.driftFactor * dt;
          break;
        case "coast": {
          s.rot += s.vel * dt;
          s.vel *= Math.exp(-friction * dt);
          if (Math.abs(s.vel) < 18) {
            if (cfg.snap) {
              s.mode = "snap";
              s.target = Math.round(s.rot / step) * step;
            } else {
              s.mode = "auto";
              s.resumeAt = now + RESUME_AFTER;
            }
          }
          break;
        }
        case "snap": {
          const k = s.reduced ? 18 : 9;
          s.rot += (s.target - s.rot) * (1 - Math.exp(-dt * k));
          if (Math.abs(s.target - s.rot) < 0.02) {
            s.rot = s.target;
            s.mode = "auto";
            s.driftFactor = 0;
            s.resumeAt = now + RESUME_AFTER;
          }
          break;
        }
        case "drag":
          break;
      }

      // Pointer parallax, eased.
      const pe = 1 - Math.exp(-dt * 4);
      s.px += (s.tpx - s.px) * pe;
      s.py += (s.tpy - s.py) * pe;

      paint();
      raf = s.visible ? requestAnimationFrame(frame) : 0;
    };

    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    // Run only while on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        s.visible = entry.isIntersecting;
        if (entry.isIntersecting) {
          setIntroduced(true);
          start();
        }
      },
      { rootMargin: "120px 0px" },
    );
    if (rootRef.current) io.observe(rootRef.current);
    paint();

    // Expose a kick so user input can restart the loop if it was idle.
    (s as unknown as { kick: () => void }).kick = () => s.visible && start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      media.removeEventListener("change", onMedia);
    };
  }, [cfg.direction, cfg.pauseOnHover, cfg.snap, cfg.speed, paint, step]);

  // Repaint immediately when geometry changes.
  useLayoutEffect(() => paint(), [radius, paint]);

  /* ---------- navigation ---------- */
  const goTo = useCallback(
    (index: number) => {
      const s = sim.current;
      // Front means i*step + rot ≡ 0 → choose the equivalent target nearest to now.
      const base = -index * step;
      const target = s.rot + norm(base - s.rot);
      s.mode = "snap";
      s.target = target;
      s.vel = 0;
      (s as unknown as { kick?: () => void }).kick?.();
    },
    [step],
  );

  const stepBy = useCallback((delta: number) => goTo((sim.current.active + delta + count) % count), [count, goTo]);

  /* ---------- pointer: drag, momentum, parallax ---------- */
  const degPerPx = () => (180 / Math.PI) / sim.current.radius;

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const s = sim.current;
    s.drag = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastT: performance.now(),
      moved: false,
      rotAtStart: s.rot,
    };
    s.suppressClick = false;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    // Parallax (mouse only).
    if (cfg.parallax && event.pointerType === "mouse" && !s.reduced && rootRef.current) {
      const r = rootRef.current.getBoundingClientRect();
      s.tpx = ((event.clientX - r.left) / r.width - 0.5) * 2;
      s.tpy = ((event.clientY - r.top) / r.height - 0.5) * 2;
    }
    if (s.drag.id !== event.pointerId) return;
    const dx = event.clientX - s.drag.startX;
    const dy = event.clientY - s.drag.startY;
    if (!s.drag.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      // Vertical intent on touch: let the page scroll.
      if (Math.abs(dy) > Math.abs(dx)) {
        s.drag.id = -1;
        return;
      }
      s.drag.moved = true;
      s.mode = "drag";
      s.vel = 0;
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    }
    const now = performance.now();
    const dtMs = Math.max(1, now - s.drag.lastT);
    const instVel = ((event.clientX - s.drag.lastX) * degPerPx() * 1000) / dtMs;
    s.vel = s.vel * 0.7 + instVel * 0.3;
    s.drag.lastX = event.clientX;
    s.drag.lastT = now;
    s.rot = s.drag.rotAtStart + dx * degPerPx();
    (s as unknown as { kick?: () => void }).kick?.();
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    if (s.drag.id !== event.pointerId) return;
    if (s.drag.moved) {
      s.suppressClick = true;
      // Stale velocity (pointer held still before release) carries nothing.
      if (performance.now() - s.drag.lastT > 90) s.vel = 0;
      s.vel *= cfg.momentum * 1.6;
      s.mode = "coast";
      (s as unknown as { kick?: () => void }).kick?.();
    }
    s.drag.id = -1;
  };

  const onPointerLeave = () => {
    const s = sim.current;
    s.hovered = false;
    s.tpx = 0;
    s.tpy = 0;
  };

  /* ---------- clicks + keyboard ---------- */
  const onCardClick = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    const s = sim.current;
    if (s.suppressClick) {
      event.preventDefault();
      s.suppressClick = false;
      return;
    }
    // First click on a side card brings it to the front; clicking the front card follows its link.
    if (index !== s.active) {
      event.preventDefault();
      goTo(index);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepBy(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepBy(-1);
    }
  };

  const current = items[active];

  return (
    <div className="cyl">
      <div
        ref={rootRef}
        className={`cyl__viewport${introduced ? " is-in" : ""}`}
        style={cssVars({
          "--cyl-card-w": `${geo.cardWidth}px`,
          "--cyl-perspective": `${geo.perspective}px`,
        })}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={() => (sim.current.hovered = true)}
        onPointerLeave={onPointerLeave}
        onFocus={() => (sim.current.focusWithin = true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) sim.current.focusWithin = false;
        }}
      >
        <div className="cyl__stage">
          <div ref={ringRef} className="cyl__ring">
            <ul className="cyl__list">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={`cyl__card${index === active ? " is-active" : ""}`}
                  style={{
                    transform: `rotateY(${index * step}deg) translateZ(${radius}px)`,
                    ...cssVars({ "--i": index }),
                  }}
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}: ${item.name}`}
                >
                  <a
                    className="cyl__link"
                    href={item.href}
                    target="_blank"
                    rel="noopener"
                    draggable={false}
                    onClick={(event) => onCardClick(event, index)}
                    onFocus={() => goTo(index)}
                  >
                    <span className="cyl__inner">
                      <span className="cyl__media">
                        <img
                          src={item.image.src}
                          width={item.image.width}
                          height={item.image.height}
                          alt={item.image.alt}
                          /* lazy until the section nears the viewport, then all at once:
                             back cards rotate into view and must not pop in */
                          loading={introduced ? "eager" : "lazy"}
                          decoding="async"
                          draggable={false}
                          onError={(event) => {
                            const img = event.currentTarget;
                            if (img.src !== item.image.origin) img.src = item.image.origin;
                          }}
                        />
                        <span className="cyl__shade" aria-hidden="true" />
                      </span>
                      <span className="cyl__meta">
                        <span className="cyl__name">{item.name}</span>
                        <span className="cyl__cat">{item.categories[0]}</span>
                      </span>
                    </span>
                    <span className="visually-hidden">
                      {" "}
                      — {item.categories.join(", ")}. Opens the live portfolio page in a new tab.
                    </span>
                  </a>
                  {/* Mirrored rear face: visible only while this card is on the
                      back of the cylinder, so the ring reads as a full circle. */}
                  <span className="cyl__back" aria-hidden="true">
                    <img
                      src={item.image.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      onError={(event) => {
                        const img = event.currentTarget;
                        if (img.src !== item.image.origin) img.src = item.image.origin;
                      }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="cyl__bar">
        <div className="cyl__now" aria-live="polite">
          <span className="cyl__count">
            <b>{String(active + 1).padStart(2, "0")}</b> / {String(count).padStart(2, "0")}
          </span>
          <span className="cyl__now-text">
            <span className="cyl__now-name">{current.name}</span>
            <span className="cyl__now-cats">{current.categories.join(" · ")}</span>
          </span>
        </div>
        <div className="cyl__controls">
          <button type="button" className="icon-btn" aria-label="Previous project" onClick={() => stepBy(-1)}>
            <ArrowBack />
          </button>
          <button type="button" className="icon-btn" aria-label="Next project" onClick={() => stepBy(1)}>
            <Arrow />
          </button>
        </div>
      </div>
    </div>
  );
}
