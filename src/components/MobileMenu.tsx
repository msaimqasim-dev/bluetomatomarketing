import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { aboutUrl, contact, industries, services } from "../content/site";
import { cssVars } from "../hooks/useReveal";
import { Arrow, Plus } from "./ui/Icons";
import { LiveLink } from "./ui/LiveLink";
import { Logo } from "./ui/Logo";

type MobileMenuProps = { open: boolean; onClose: () => void };
type Section = "services" | "industries";

/**
 * Full-screen navigation for small screens. Behaves as a modal dialog:
 * focus moves in on open, Tab is trapped, Escape closes, focus returns to the
 * trigger, and the page behind is inert and scroll-locked.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [section, setSection] = useState<Section | null>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.documentElement.classList.add("is-locked");
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 80);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !rootRef.current) return;
      const focusable = Array.from(rootRef.current.querySelectorAll<HTMLElement>("a[href], button")).filter(
        (el) => el.getClientRects().length > 0 && window.getComputedStyle(el).visibility !== "hidden",
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    // Leaving the mobile breakpoint closes the menu.
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onBreakpoint = () => desktop.matches && onClose();

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
      document.documentElement.classList.remove("is-locked");
      previous?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  // In-page links: close first (releases the scroll lock), then scroll so the
  // section heading clears the fixed header (header height is measured, since
  // the bar's height differs per breakpoint).
  const goTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    onClose();
    window.setTimeout(() => {
      const target = document.getElementById(id);
      if (!target) return;
      const header = document.querySelector<HTMLElement>(".site-header");
      const offset = (header?.offsetHeight ?? 68) + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: Math.max(0, top), behavior: reduced ? "auto" : "smooth" });
    }, 120);
  };

  const toggle = (id: Section) => setSection((current) => (current === id ? null : id));

  return (
    <div
      ref={rootRef}
      id="mobile-menu"
      className="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      data-open={open ? "" : undefined}
    >
      <div className="wrap mobile-menu__bar">
        <Logo />
        <button ref={closeRef} type="button" className="menu-toggle menu-toggle--close" onClick={onClose}>
          Close
          <span className="menu-toggle__icon" aria-hidden="true" />
        </button>
      </div>

      <nav className="wrap mobile-menu__nav" aria-label="Mobile">
        <ul>
          <li className="mobile-menu__item" style={cssVars({ "--i": 0 })}>
            <a className="mobile-menu__link" href="#work" onClick={(event) => goTo(event, "work")}>
              Our Work
            </a>
          </li>

          <li className="mobile-menu__item" style={cssVars({ "--i": 1 })}>
            <button
              type="button"
              className="mobile-menu__link"
              aria-expanded={section === "services"}
              aria-controls="mobile-sub-services"
              onClick={() => toggle("services")}
            >
              Services
              <Plus />
            </button>
            <div id="mobile-sub-services" className="mobile-menu__sub" data-open={section === "services" ? "" : undefined}>
              <div>
                <ul className="mobile-menu__sublist">
                  {services.map((service) => (
                    <li key={service.id}>
                      <LiveLink href={service.href}>{service.name}</LiveLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>

          <li className="mobile-menu__item" style={cssVars({ "--i": 2 })}>
            <button
              type="button"
              className="mobile-menu__link"
              aria-expanded={section === "industries"}
              aria-controls="mobile-sub-industries"
              onClick={() => toggle("industries")}
            >
              Industries
              <Plus />
            </button>
            <div
              id="mobile-sub-industries"
              className="mobile-menu__sub"
              data-open={section === "industries" ? "" : undefined}
            >
              <div>
                <ul className="mobile-menu__sublist mobile-menu__sublist--two">
                  {industries.map((industry) => (
                    <li key={industry.slug}>
                      <LiveLink href={industry.href}>{industry.name}</LiveLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>

          <li className="mobile-menu__item" style={cssVars({ "--i": 3 })}>
            <LiveLink className="mobile-menu__link" href={aboutUrl}>
              About
            </LiveLink>
          </li>
        </ul>
      </nav>

      <div className="wrap mobile-menu__foot">
        <a className="btn btn--light btn--block" href="#contact-us" onClick={(event) => goTo(event, "contact-us")}>
          Start a Project
          <Arrow />
        </a>
        <div className="mobile-menu__contact">
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
        </div>
      </div>
    </div>
  );
}
