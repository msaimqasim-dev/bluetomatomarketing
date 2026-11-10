import { identity } from "../content/generated/identity";
import { cssVars } from "../hooks/useReveal";
import { Picture } from "./ui/Picture";

/** Identity marks created by Blue Tomato (logo portfolio). The first five are also quoted in the testimonials. */
const STRIP = [
  "virtualmgr",
  "clward",
  "neurointerventions",
  "geonetix",
  "m3-creative-media",
  "flat-iron-energy-partners",
  "pro-flo",
  "esquire-legal-services",
];

/**
 * 03 — Credibility strip. No invented awards or numbers: the heading is the
 * line from the Blue Tomato logo, and the marks are real identity work.
 */
export function Trust() {
  return (
    <section id="trust" className="trust theme-tint" aria-labelledby="trust-title">
      <div className="wrap trust__inner">
        <div data-reveal>
          <h2 id="trust-title" className="trust__title" data-reveal data-split="words">
            Building brands since 2002
          </h2>
          {/* Transitional label (not original copy) — describes what the marks are. */}
          <p className="trust__note">Selected identity work by Blue Tomato</p>
        </div>

        <ul className="trust__logos">
          {STRIP.map((key, index) => (
            <li key={key} className="trust__logo" data-reveal style={cssVars({ "--d": `${index * 55}ms` })}>
              <Picture image={{ ...identity[key], src: `images/logos/mono/${key}.webp` }} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
