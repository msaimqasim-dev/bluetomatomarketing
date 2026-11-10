import { useEffect, useRef, useState } from "react";
import type { FocusEvent } from "react";
import { aboutUrl, industries, services } from "../content/site";
import { Arrow, ArrowUpRight, Chevron } from "./ui/Icons";
import { LiveLink } from "./ui/LiveLink";
import { Logo } from "./ui/Logo";

type Panel = "services" | "industries";

type HeaderProps = { menuOpen: boolean; onOpenMenu: () => void };

/**
 * Fixed header, floating over the hero gradient until the page scrolls, then
 * solid white. "Services" and "Industries" are disclosure buttons that open
 * full-width panels: click/Enter/Space toggles, Escape closes and returns
 * focus, clicking or tabbing outside closes. Pointer devices also open on hover.
 */
export function Header({ menuOpen, onOpenMenu }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState<Panel | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const servicesBtn = useRef<HTMLButtonElement>(null);
  const industriesBtn = useRef<HTMLButtonElement>(null);
  const openedByClick = useRef(false);
  const closeTimer = useRef<number | undefined>(undefined);

  // Transparent over the hero; solid white once the page has scrolled.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Escape + outside click while a panel is open.
  useEffect(() => {
    if (!panel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      (panel === "services" ? servicesBtn : industriesBtn).current?.focus();
      openedByClick.current = false;
      setPanel(null);
    };
    const onPointer = (event: PointerEvent) => {
      if (headerRef.current?.contains(event.target as Node)) return;
      openedByClick.current = false;
      setPanel(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [panel]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const cancelClose = () => window.clearTimeout(closeTimer.current);

  const closePanel = () => {
    cancelClose();
    openedByClick.current = false;
    setPanel(null);
  };

  const toggle = (id: Panel) => {
    cancelClose();
    if (panel === id && openedByClick.current) {
      closePanel();
      return;
    }
    openedByClick.current = true;
    setPanel(id);
  };

  const hoverOpen = (id: Panel) => {
    if (!canHover()) return;
    cancelClose();
    if (panel !== id) openedByClick.current = false;
    setPanel(id);
  };

  const hoverOther = () => {
    if (canHover() && !openedByClick.current) closePanel();
  };

  const hoverLeave = () => {
    if (!canHover() || openedByClick.current) return;
    cancelClose();
    closeTimer.current = window.setTimeout(() => setPanel(null), 160);
  };

  const onBlur = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget as Node | null;
    if (panel && next && !headerRef.current?.contains(next)) closePanel();
  };

  return (
    <header
      ref={headerRef}
      className="site-header"
      data-overlay={scrolled || panel ? undefined : ""}
      onMouseEnter={cancelClose}
      onMouseLeave={hoverLeave}
      onBlur={onBlur}
    >
      <div className="wrap site-header__bar">
        <a className="site-header__logo" href="#top" aria-label="Blue Tomato — back to top">
          <Logo decorative />
        </a>

        <nav className="site-nav" aria-label="Primary">
          <ul className="site-nav__list">
            <li onMouseEnter={hoverOther}>
              <a className="site-nav__link" href="#work" onClick={closePanel}>
                Our Work
              </a>
            </li>

            <li onMouseEnter={() => hoverOpen("services")}>
              <button
                ref={servicesBtn}
                type="button"
                className="site-nav__link"
                aria-expanded={panel === "services"}
                aria-controls="nav-panel-services"
                onClick={() => toggle("services")}
              >
                Services
                <Chevron className="site-nav__chev" />
              </button>
              <div id="nav-panel-services" className="nav-panel" data-open={panel === "services" ? "" : undefined}>
                <div className="wrap nav-panel__inner">
                  <p className="eyebrow nav-panel__label">View by Category</p>
                  <ul className="nav-panel__list nav-panel__list--cards">
                    {services.map((service) => (
                      <li key={service.id}>
                        <LiveLink className="nav-card" href={service.href} onClick={closePanel}>
                          <span className="nav-card__num">{service.number}</span>
                          <span className="nav-card__name">{service.name}</span>
                          <span className="nav-card__desc">{service.headline}</span>
                          <ArrowUpRight />
                        </LiveLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>

            <li onMouseEnter={() => hoverOpen("industries")}>
              <button
                ref={industriesBtn}
                type="button"
                className="site-nav__link"
                aria-expanded={panel === "industries"}
                aria-controls="nav-panel-industries"
                onClick={() => toggle("industries")}
              >
                Industries
                <Chevron className="site-nav__chev" />
              </button>
              <div id="nav-panel-industries" className="nav-panel" data-open={panel === "industries" ? "" : undefined}>
                <div className="wrap nav-panel__inner">
                  <p className="eyebrow nav-panel__label">View by Industry</p>
                  <ul className="nav-panel__list nav-panel__list--columns">
                    {industries.map((industry) => (
                      <li key={industry.slug}>
                        <LiveLink className="nav-plain" href={industry.href} onClick={closePanel}>
                          {industry.name}
                          <ArrowUpRight />
                        </LiveLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>

            <li onMouseEnter={hoverOther}>
              <LiveLink className="site-nav__link" href={aboutUrl}>
                About
              </LiveLink>
            </li>
          </ul>
        </nav>

        <div className="site-header__actions">
          <a className="btn btn--primary btn--sm site-header__cta" href="#contact-us" onClick={closePanel}>
            Start a Project
            <Arrow />
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={onOpenMenu}
          >
            Menu
            <span className="menu-toggle__icon" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
