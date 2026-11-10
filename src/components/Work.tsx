import { allWorkHref, services, showcase } from "../content/site";
import { cssVars } from "../hooks/useReveal";
import { CylinderCarousel } from "./CylinderCarousel";
import { Arrow, ArrowUpRight } from "./ui/Icons";
import { LiveLink } from "./ui/LiveLink";

/**
 * 04 — Selected work. A 3D cylindrical carousel of genuine Blue Tomato
 * projects. Copy (heading, supporting line, closing statement) is from the
 * live About page; every card links to the live portfolio page the project is
 * published on — the live site has no individual case-study pages.
 */
export function Work() {
  return (
    <section id="work" className="section work theme-white" aria-labelledby="work-title">
      <div className="wrap">
        <header className="sec-head work__head">
          <div className="sec-head__main">
            <p className="eyebrow" data-reveal>
              Our Work
            </p>
            <h2 id="work-title" className="t-h2" data-reveal data-split="words">
              Built for Brands That Expect More
            </h2>
          </div>
          <p className="t-lead sec-head__aside" data-reveal style={cssVars({ "--d": "120ms" })}>
            We partner with companies and organizations where brand perception directly impacts value.
          </p>
        </header>
      </div>

      <CylinderCarousel
        items={showcase}
        label="Selected Blue Tomato projects. Drag, swipe or use the arrow keys to rotate."
        config={{
          cardWidth: 260,
          gap: 25,
          tilt: -5,
          perspective: 2500,
          speed: 14,
          direction: "left",
          momentum: 0.6,
          snap: true,
          pauseOnHover: true,
          parallax: true,
        }}
      />

      <div className="wrap">
        <div className="work__footer" data-reveal>
          <p className="work__more-statement">
            If your business operates at a higher level, your marketing should too.
          </p>
          <div className="work__actions">
            {/* "Explore All Work" is CTA wording (not original copy). */}
            <LiveLink className="btn btn--primary" href={allWorkHref}>
              Explore All Work
              <Arrow />
            </LiveLink>
            <ul className="work__cats" aria-label="Browse work by category">
              {services.map((service) => (
                <li key={service.id}>
                  <LiveLink href={service.href}>
                    {service.name}
                    <ArrowUpRight />
                  </LiveLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
