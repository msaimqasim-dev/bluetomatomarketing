import type { Img } from "../content/types";
import { images } from "../content/images";
import { cssVars } from "../hooks/useReveal";
import { Arrow } from "./ui/Icons";
import { Picture } from "./ui/Picture";

type Tile = {
  image: Img;
  project: string;
  /** Editorial variety: each tile is cropped to its own proportion. */
  ratio: string;
  position?: string;
};

/*
 * Genuine Blue Tomato work, all from the live homepage project slideshow.
 * Names are the project names documented on the official portfolio pages
 * (see docs/CONTENT-AUDIT.md); nothing here is invented.
 */
const COLUMN_A: Tile[] = [
  { image: images.porsche911, project: "Porsche Sewickley", ratio: "4 / 5" },
  { image: images.audi, project: "Audi Sewickley", ratio: "3 / 2", position: "22% 50%" },
  { image: images.arno, project: "ARNO USA", ratio: "16 / 10" },
  { image: images.a519, project: "A519 Chocolate", ratio: "4 / 5" },
  { image: images.susanKoeppen, project: "Susan Koeppen", ratio: "4 / 5", position: "22% 32%" },
  { image: images.laGourmandine, project: "La Gourmandine", ratio: "1 / 1" },
];

const COLUMN_B: Tile[] = [
  { image: images.mrMister, project: "Mr Mister", ratio: "3 / 2", position: "55% 50%" },
  { image: images.porscheWheel, project: "Porsche Sewickley", ratio: "4 / 5" },
  { image: images.vallozzi, project: "Vallozzi", ratio: "4 / 5" },
  { image: images.ifftPalmer, project: "Ifft & Palmer", ratio: "16 / 10" },
  { image: images.atarashi, project: "Atarashi", ratio: "3 / 2" },
  { image: images.goodNGrapey, project: "Good n’ Grapey", ratio: "1 / 1" },
];

const SIZES = "(min-width: 64rem) 22vw, 46vw";

function MarqueeColumn({
  tiles,
  direction,
  duration,
  offset,
}: {
  tiles: Tile[];
  direction: "up" | "down";
  duration: string;
  offset?: boolean;
}) {
  return (
    <div className={`hero__col${offset ? " hero__col--offset" : ""}`}>
      <div className={`hero-marquee hero-marquee--${direction}`} style={cssVars({ "--dur": duration })}>
        <div className="hero-marquee__track">
          {[0, 1].map((copy) => (
            <ul className="hero-marquee__group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {tiles.map((tile, index) => (
                <li key={`${tile.project}-${tile.ratio}-${index}`}>
                  <figure className="hero-tile" style={cssVars({ "--ratio": tile.ratio })}>
                    <Picture
                      image={tile.position ? { ...tile.image, position: tile.position } : tile.image}
                      sizes={SIZES}
                      eager
                      priority={copy === 0 && index < 2}
                    />
                    <figcaption className="hero-tile__caption">{tile.project}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 02 — Hero. Full-screen brand gradient, oversized editorial type on the left,
 * and two endless columns of genuine project work moving in opposite directions
 * on the right. Copy unchanged: headline and supporting line are verbatim from
 * the live homepage; the eyebrow is the live <title> descriptor.
 */
export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">Pittsburgh Full-Service Marketing, Branding &amp; Web Agency</p>

          <h1 id="hero-title" className="hero__title">
            <span className="hero__line" style={cssVars({ "--i": 0 })}>
              <span>Marketing That</span>
            </span>{" "}
            <span className="hero__line" style={cssVars({ "--i": 1 })}>
              <span className="hero__accent">Commands</span>
            </span>{" "}
            <span className="hero__line" style={cssVars({ "--i": 2 })}>
              <span>
                and <span className="hero__accent">Converts.</span>
              </span>
            </span>
          </h1>

          <p className="hero__lead">
            We build high-impact brands and performance-driven marketing systems for design-forward and premium
            businesses.
          </p>

          <div className="hero__actions">
            <a className="btn btn--hero" href="#work">
              Explore Our Work
              <Arrow />
            </a>
            <a className="btn btn--ghost-light" href="#contact-us">
              Start a Project
            </a>
          </div>
        </div>

        <div className="hero__gallery" role="group" aria-label="Selected Blue Tomato project work">
          <MarqueeColumn tiles={COLUMN_A} direction="up" duration="78s" />
          <MarqueeColumn tiles={COLUMN_B} direction="down" duration="94s" offset />
        </div>
      </div>

      <a className="hero__scroll" href="#trust">
        <span className="hero__scroll-line" aria-hidden="true" />
        <span>Selected work</span>
      </a>

      <p className="visually-hidden">
        The gallery above shows Blue Tomato work for Porsche Sewickley, Audi Sewickley, A519 Chocolate, La
        Gourmandine, Susan Koeppen, ARNO USA, Mr Mister, Vallozzi, Good n’ Grapey, Atarashi and Ifft &amp; Palmer.
      </p>
    </section>
  );
}
