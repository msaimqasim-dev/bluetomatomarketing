import { useState } from "react";
import { industries } from "../content/site";
import { cssVars } from "../hooks/useReveal";
import { Arrow, ArrowUpRight } from "./ui/Icons";
import { LiveLink } from "./ui/LiveLink";
import { Picture } from "./ui/Picture";

const featured = industries.filter((industry) => industry.image);
const more = industries.filter((industry) => !industry.image);

/**
 * Industries — NOT RENDERED on the current homepage.
 *
 * Kept intentionally, with its copy in src/content/site.ts, so the approved
 * content and structure can seed the future Industries page. The homepage
 * stylesheet for this block was removed during the strategy-section merge;
 * restyle from the design system when the page is built.
 *
 * 07 — Industries. A curated preview of six of the twelve live industry
 * categories (each with its own page headline and a genuine project image),
 * plus direct links to the remaining six, so the full coverage is reachable.
 * Desktop: hover or keyboard focus on a row swaps the preview image.
 * Mobile: each row carries its own image — no hover needed.
 */
export function Industries() {
  const [active, setActive] = useState(0);

  return (
    <section id="industries" className="section industries theme-white" aria-labelledby="industries-title">
      <div className="wrap">
        <header className="industries__head">
          <p className="eyebrow" data-reveal>
            View by Industry
          </p>
          <h2 id="industries-title" className="t-h3 industries__title" data-reveal>
            Explore our portfolio of brands across industries where clarity, perception, and presentation shape
            competitive advantage.
          </h2>
        </header>

        <div className="industries__body">
          <ol className="industries__list">
            {featured.map((industry, index) => (
              <li
                key={industry.slug}
                className="industries__item"
                data-active={index === active ? "" : undefined}
                data-reveal
                style={cssVars({ "--d": `${index * 60}ms` })}
              >
                <LiveLink
                  className="ind-row"
                  href={industry.href}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                >
                  <span className="media ind-row__thumb">
                    <Picture image={{ ...industry.image!, alt: "" }} sizes="(min-width: 640px) 45vw, 92vw" />
                  </span>
                  <span className="ind-row__index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="ind-row__name">{industry.name}</span>
                    <span className="ind-row__headline">{industry.headline}</span>
                  </span>
                  <Arrow />
                </LiveLink>
              </li>
            ))}
          </ol>

          <div className="industries__preview">
            <div className="media industries__frame">
              {featured.map((industry, index) => (
                <span
                  key={industry.slug}
                  className="industries__slide"
                  data-active={index === active ? "" : undefined}
                >
                  <Picture image={industry.image!} sizes="(min-width: 1024px) 55vw, 1px" />
                </span>
              ))}
            </div>
            <p className="industries__pictured">
              <span>Pictured: {featured[active].pictured}</span>
              <span aria-hidden="true">
                {String(active + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
              </span>
            </p>
            {/* Visual echo of the active row's headline (already in the row for assistive tech). */}
            <p className="industries__headline" aria-hidden="true">
              <span key={active}>{featured[active].headline}</span>
            </p>
          </div>
        </div>

        <div className="industries__more" data-reveal>
          {/* Transitional label (not original copy). */}
          <p className="eyebrow">More industries</p>
          <ul>
            {more.map((industry) => (
              <li key={industry.slug}>
                <LiveLink href={industry.href}>
                  {industry.name}
                  <ArrowUpRight />
                </LiveLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
