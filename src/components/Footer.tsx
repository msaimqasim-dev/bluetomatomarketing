import { aboutUrl, contact, industries, services } from "../content/site";
import { Arrow } from "./ui/Icons";
import { LiveLink } from "./ui/LiveLink";
import { Logo } from "./ui/Logo";

/**
 * 12 — Footer. Contact details, social links and the legal line are exactly
 * as published on the live site. All navigation points at verified URLs.
 */
export function Footer() {
  return (
    <footer className="site-footer theme-navy">
      <div className="wrap">
        <nav className="site-footer__grid" aria-label="Footer">
          <div className="footer-col footer-col--explore">
            <p className="footer-col__title" id="footer-explore">
              Explore
            </p>
            <ul aria-labelledby="footer-explore">
              <li>
                <a href="#work">Our Work</a>
              </li>
              <li>
                <LiveLink href={aboutUrl}>Meet Blue Tomato</LiveLink>
              </li>
              <li>
                <a href="#contact-us">Contact Us</a>
              </li>
            </ul>
          </div>

          <div className="footer-col footer-col--services">
            <p className="footer-col__title" id="footer-services">
              View by Category
            </p>
            <ul aria-labelledby="footer-services">
              {services.map((service) => (
                <li key={service.id}>
                  <LiveLink href={service.href}>{service.name}</LiveLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col footer-col--industries">
            <p className="footer-col__title" id="footer-industries">
              View by Industry
            </p>
            <ul aria-labelledby="footer-industries">
              {industries.map((industry) => (
                <li key={industry.slug}>
                  <LiveLink href={industry.href}>{industry.name}</LiveLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col footer-col--contact">
            <p className="footer-col__title" id="footer-contact">
              Contact Us
            </p>
            <ul aria-labelledby="footer-contact">
              <li>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              <li>
                <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
              </li>
              <li>
                <a href={contact.linkedin} target="_blank" rel="noopener">
                  LinkedIn<span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={contact.instagram} target="_blank" rel="noopener">
                  Instagram {contact.instagramHandle}
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="site-footer__wordmark" data-reveal="wordmark">
          <Logo />
        </div>

        <div className="site-footer__legal">
          <p>© COPYRIGHT BLUE TOMATO LLC 2002. blue tomato® is a REGISTERED TRADEMARK.</p>
          <a href="#top">
            Back to top
            <Arrow />
          </a>
        </div>
      </div>
    </footer>
  );
}
