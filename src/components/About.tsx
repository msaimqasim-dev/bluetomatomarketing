import { images } from "../content/images";
import { aboutUrl } from "../content/site";
import { cssVars } from "../hooks/useReveal";
import { Arrow } from "./ui/Icons";
import { LiveLink } from "./ui/LiveLink";
import { Picture } from "./ui/Picture";

/**
 * 08 — Founder / About. Full-bleed founder portrait (the authentic photo from
 * the live homepage: open wall on the left, Kim Collins on the right) with a
 * glass description card over the left of the image. All copy is verbatim from
 * bluetomatomarketing.com/about-us; the remaining paragraphs sit just below
 * the image so nothing is lost or crammed into the card.
 */
export function About() {
  const kim = images.kimFull;

  return (
    <section id="about" className="section about theme-white" aria-labelledby="about-title">
      <div className="about__stage" data-parallax>
        <div className="about__image">
          <Picture image={kim} sizes="100vw" eager />
        </div>

        <div className="about__glass-wrap">
          <div className="about__glass" data-reveal>
            <p className="eyebrow">Meet Blue Tomato</p>
            <h2 id="about-title" className="about__title" data-split="words" data-reveal>
              Boutique by Design.
            </h2>
            <p className="about__lead">
              A strategy-led marketing and brand studio creating elevated experiences for organizations that value
              clarity, consistency, and strong positioning.
            </p>
            <p className="about__hello">Nice to meet you. We’re blue tomato.</p>
            <p>
              Founded by Kim Collins in 2002, Blue Tomato was built with a clear intention: to move beyond
              surface-level marketing and focus on work that connects strategy, design, and performance.
            </p>
            <LiveLink className="link-arrow about__link" href={aboutUrl}>
              <span className="link-arrow__text">Meet Blue Tomato</span>
              <Arrow />
            </LiveLink>
          </div>
        </div>

        <div className="about__credit" aria-hidden="true">
          <span className="about__credit-name">Kim Collins</span>
          <span className="about__credit-role">Founder | CEO</span>
        </div>
      </div>

      <div className="wrap about__rest">
        <div className="about__text" data-reveal style={cssVars({ "--d": "100ms" })}>
          <p>
            Today, we operate as a highly focused, intentionally boutique team – bringing together senior-level
            creative direction, strategic thinking, and specialized expertise across branding, web, and marketing.
          </p>
          <p>
            We don’t believe in volume for volume’s sake. We believe in precision. Every engagement is collaborative,
            intentional, and grounded in understanding what actually drives your brand forward.
          </p>
          <p className="about__result">The result is work that doesn’t just look refined – it performs with purpose.</p>
        </div>
        <div className="about__closing" data-reveal style={cssVars({ "--d": "180ms" })}>
          <p className="t-h4">
            Whether you’re building, evolving or repositioning your brand, we partner closely with you to ensure it’s
            seen, understood, and chosen for the right reasons.
          </p>
        </div>
      </div>
    </section>
  );
}
