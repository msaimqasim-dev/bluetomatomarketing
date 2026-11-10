import { contact } from "../content/site";
import { cssVars } from "../hooks/useReveal";
import { Arrow } from "./ui/Icons";

/**
 * 11 — Final call to action. Heading and supporting copy are the live
 * homepage's closing invitation, verbatim. The single primary action is a real
 * mailto: link — no form backend is invented. The id matches the live site's
 * existing #contact-us anchor.
 */
export function CallToAction() {
  return (
    <section id="contact-us" className="cta theme-navy" aria-labelledby="cta-title">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          Contact Us
        </p>
        <h2 id="cta-title" className="cta__title" data-reveal data-split="words">
          Ready for a Fresh Approach to Brand Marketing?
        </h2>

        <div className="cta__body">
          <div className="cta__copy" data-reveal>
            <p>
              Beautiful creative is only the starting point. We focus on what matters: qualified leads, stronger
              positioning, higher conversion, and sustained growth.
            </p>
            <p>Our clients don’t just get noticed – they get chosen.</p>
          </div>

          <div className="cta__actions" data-reveal style={cssVars({ "--d": "120ms" })}>
            <a className="btn btn--light btn--lg" href={`mailto:${contact.email}`}>
              Start a Project
              <Arrow />
            </a>
            <ul className="cta__contact">
              <li>
                <span>Email</span>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              <li>
                <span>Call</span>
                <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
