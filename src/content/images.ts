import type { Img } from "./types";

/**
 * All imagery is original Blue Tomato work taken from the homepage project
 * slideshow on https://bluetomatomarketing.com/ (full-resolution originals),
 * then cropped/optimised by scripts/process-assets.mjs.
 */
const PAGES = "https://bluetomatomarketing.com/uploads/pages/";
const RATIO = 812 / 1920;

function wide(name: string, widths: [number, number], file: string, alt: string): Img {
  const [small, large] = widths;
  const base = `images/work/${name}`;
  return {
    src: `${base}-${large}.webp`,
    srcSet: `${base}-${small}.webp ${small}w, ${base}-${large}.webp ${large}w`,
    width: large,
    height: Math.round(large * RATIO),
    alt,
    origin: PAGES + file,
  };
}

const PORSCHE = PAGES + "porsche-sewickley-2-blue-tomato-pittsburgh-69f3a7f6ea2e5.png";

export const images = {
  /* Hero */
  porsche911: {
    src: "images/work/porsche-sewickley-911.webp",
    width: 650,
    height: 812,
    alt: "A blue Porsche 911 in the Porsche Sewickley showroom",
    origin: PORSCHE,
    position: "50% 50%",
  },
  porscheWheel: {
    src: "images/work/porsche-sewickley-wheel.webp",
    width: 580,
    height: 725,
    alt: "Porsche wheel and crest with the Porsche Sewickley logo",
    origin: PORSCHE,
    position: "100% 50%",
  },

  /* Selected work */
  audi: wide(
    "audi-sewickley",
    [960, 1920],
    "audi-sewickley-3-blue-tomato-pittsburgh-69f3a97187829.png",
    "Audi Sewickley: headlight detail, quilted tan leather interior and alloy wheel, with the Audi Sewickley logo",
  ),
  a519: {
    src: "images/work/a519-chocolate.webp",
    width: 650,
    height: 812,
    alt: "A519 Chocolate: hand-painted geometric chocolates in deep blue and magenta",
    origin: PAGES + "a-519-chocolates-blue-tomato-pittsburgh.png",
    position: "15% 50%",
  },
  mrMister: {
    src: "images/work/mr-mister.webp",
    width: 1218,
    height: 812,
    alt: "Mr Mister: plated dishes photographed from the table, with the Mr Mister signature logo",
    origin: PAGES + "mr-mister-3-pgh-blue-tomato-pittsburgh-69f3ab7d91048.png",
    position: "100% 50%",
  },
  vallozzi: wide(
    "vallozzi",
    [960, 1920],
    "vallozzi-blue-tomato-pittsburgh.png",
    "Vallozzi: raised metal lettering on the restaurant’s green steel facade",
  ),

  /* Core capabilities */
  goodNGrapey: wide(
    "good-n-grapey",
    [720, 1440],
    "good-n-grapey-3-blue-tomato-pittsburgh-copy.png",
    "Good n’ Grapey campaign artwork: a purple juice pouch beside the line “Juice Just Got Good for you!”",
  ),
  laGourmandine: wide(
    "la-gourmandine",
    [720, 1440],
    "untitled-2la-gourmandine-blue-tomato-pittsburgh.png",
    "La Gourmandine website banner: golden baguettes behind the La Gourmandine wordmark and a “Same day pick-up” label",
  ),

  /* Industries */
  ifftPalmer: wide(
    "ifft-palmer",
    [720, 1440],
    "ifft-palmer-blue-tomato-pittsburgh.png",
    "Ifft & Palmer Wealth Management: a warm, book-lined living room with the line “Protect & Elevate Your Legacy”",
  ),
  susanKoeppen: wide(
    "susan-koeppen",
    [720, 1440],
    "susan-koeppen-2-blue-tomato-pittsburgh-mobile.png",
    "Susan Koeppen Media: portraits of Susan Koeppen with the words “Speaker, Survivor, Storyteller”",
  ),
  atarashi: wide(
    "atarashi",
    [720, 1440],
    "atarashi-blue-tomato-pittsburgh-r.png",
    "Atarashi promotional artwork: “Build Your Own Bento” and “Build Your Own Bowl”",
  ),
  arno: wide(
    "arno-usa",
    [720, 1440],
    "arno-usa-blue-tomato-pittsburgh.png",
    "ARNO USA: white ARNO logo on red beside the line “We are all things Swiss”",
  ),
  olistico: wide(
    "olistico",
    [720, 1440],
    "olistico-blue-tomato-pittsburgh-69f3af284b24c.png",
    "Olistico Whole Person Care: website design headed “A Unique Approach to Cancer” beside the Olistico logo",
  ),
  restately: wide(
    "restately",
    [720, 1440],
    "restately-blue-tomato-pittsburgh.png",
    "restately.com: mobile screens with a “Get Offer” call to action",
  ),

  /* Founder */
  kimFull: {
    src: "images/about/kim-collins-founder-full.webp",
    width: 1600,
    height: 648,
    alt: "Kim Collins, Founder and CEO of Blue Tomato",
    origin: "https://bluetomatodesign.com/uploads/pages/kim-collins-blue-tomato-pittsburgh-founder-ceo.jpg",
    position: "100% 50%",
  },
  kim: {
    src: "images/about/kim-collins-founder-ceo.webp",
    width: 1130,
    height: 648,
    alt: "Kim Collins, Founder and CEO of Blue Tomato",
    origin: "https://bluetomatodesign.com/uploads/pages/kim-collins-blue-tomato-pittsburgh-founder-ceo.jpg",
    position: "100% 50%",
  },
  kimPortrait: {
    src: "images/about/kim-collins-founder-ceo-portrait.webp",
    width: 810,
    height: 648,
    alt: "Kim Collins, Founder and CEO of Blue Tomato",
    origin: "https://bluetomatodesign.com/uploads/pages/kim-collins-blue-tomato-pittsburgh-founder-ceo.jpg",
    position: "100% 50%",
  },
} satisfies Record<string, Img>;
