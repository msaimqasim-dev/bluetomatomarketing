import { images } from "./images";
import type { Img } from "./types";

/**
 * CONTENT RULE: every string in this file is taken from the official Blue
 * Tomato website. Sources are noted per block. See docs/CONTENT-AUDIT.md.
 */

export const LIVE = "https://bluetomatomarketing.com";

/* ---- Contact (source: homepage footer) ---------------------------------- */
export const contact = {
  email: "hello@bluetomatomarketing.com",
  phoneDisplay: "412.445.2720",
  phoneHref: "tel:4124452720",
  linkedin: "https://www.linkedin.com/company/blue-tomato-design/",
  instagram: "https://www.instagram.com/bluetomatomarketing/",
  instagramHandle: "@bluetomatomarketing",
};

export const aboutUrl = `${LIVE}/about-us`;

/* ---- Core capabilities (source: homepage "Core Capabilities" graphics) --- */
export const coreCapabilities = [
  "Brand Strategy & Positioning",
  "Creative Direction & Visual Systems",
  "Performance Marketing (SEO, Paid Media)",
  "Content & Campaign Development",
  "High-End Web Design & Development",
];

/* ---- Three service categories (source: live nav + each category page) ---- */
export type Service = {
  id: string;
  number: string;
  name: string;
  href: string;
  headline: string;
  body: string[];
  image?: Img;
  pictured?: string;
};

export const services: Service[] = [
  {
    id: "marketing",
    number: "01",
    name: "Marketing Systems",
    href: `${LIVE}/portfolio/marketing`,
    headline: "Marketing Engineered for Performance.",
    body: [
      "Marketing isn’t about visibility alone – it’s about influence, positioning, and conversion.",
      "We build performance-driven marketing systems that move brands forward with clarity and precision. Every initiative is rooted in strategy and designed to deliver measurable impact.",
    ],
    image: images.goodNGrapey,
    pictured: "Good n’ Grapey",
  },
  {
    id: "brand",
    number: "02",
    name: "Brand Strategy & Positioning",
    href: `${LIVE}/portfolio/logos`,
    headline: "Brands Built to Command Attention – and Hold It.",
    body: [
      "A brand is more than a logo. It’s how you’re perceived, remembered, and ultimately chosen.",
      "We build brands with clarity and intent – designed to position you at a higher level and create lasting competitive advantage.",
    ],
  },
  {
    id: "web",
    number: "03",
    name: "Web & Digital Experience",
    href: `${LIVE}/portfolio/website-design-development`,
    headline: "Experiences Built to Perform.",
    body: [
      "Your website isn’t just a digital presence – it’s your most important brand and conversion asset.",
      "We design and develop custom web experiences that elevate perception, communicate with clarity, and drive measurable results.",
    ],
    image: images.laGourmandine,
    pictured: "La Gourmandine",
  },
];

/* ---- Industries (source: live nav, in original order; headline = each page's H1) */
export type Industry = {
  slug: string;
  name: string;
  href: string;
  headline?: string;
  image?: Img;
  pictured?: string;
};

const ind = (slug: string, name: string, extra: Partial<Industry> = {}): Industry => ({
  slug,
  name,
  href: `${LIVE}/portfolio/industries/${slug}`,
  ...extra,
});

export const industries: Industry[] = [
  ind("professional-services", "Professional Brands", {
    headline: "Marketing for Brands Where Perception Drives Value.",
    image: images.ifftPalmer,
    pictured: "Ifft & Palmer",
  }),
  ind("consumer-services", "Consumer Brands"),
  ind("personal-brands", "Personal Brands", {
    headline: "Personal Brands Built With Clarity and Authority.",
    image: images.susanKoeppen,
    pictured: "Susan Koeppen",
  }),
  ind("food-beverage", "Food & Beverage", {
    headline: "Food & Beverage Brands That Build Demand Before the First Bite.",
    image: images.atarashi,
    pictured: "Atarashi",
  }),
  ind("products", "Products", {
    headline: "Products Designed to Stand Out – and Sell.",
    image: images.arno,
    pictured: "ARNO USA",
  }),
  ind("industrial-equipment", "Industrial & Equipment"),
  ind("healthcare-life-sciences", "Healthcare & Life Sciences", {
    headline: "Healthcare & Life Sciences Brands Built on Trust and Clarity.",
    image: images.olistico,
    pictured: "Olistico",
  }),
  ind("technology", "Technology"),
  ind("start-ups", "Startups", {
    headline: "Startups Built to Launch With Clarity and Confidence.",
    image: images.restately,
    pictured: "Restately",
  }),
  ind("energy", "Energy"),
  ind("education", "Education"),
  ind("non-profits", "Non-Profits"),
];

/* ---- Selected work (3D carousel) ----------------------------------------
   Names: homepage slideshow alt text / artwork lockups.
   Categories: the live category or industry portfolio pages each project is
   published on (verified during research — see docs/CONTENT-AUDIT.md §7).
   Links: the first category's live page (the site has no case-study pages).
   Images: 3:4 single-panel crops of the homepage slideshow originals. */
export type ShowcaseProject = {
  id: string;
  name: string;
  categories: string[];
  href: string;
  image: Img;
};

const CARD = (file: string) => `images/work/cards/${file}.webp`;
const SLIDE = "https://bluetomatomarketing.com/uploads/pages/";
const PAGE = (path: string) => `${LIVE}/portfolio/${path}`;

const card = (
  id: string,
  name: string,
  categories: string[],
  href: string,
  origin: string,
  alt: string,
  size: [number, number] = [560, 747],
): ShowcaseProject => ({
  id,
  name,
  categories,
  href,
  image: { src: CARD(id), width: size[0], height: size[1], alt, origin: SLIDE + origin },
});

export const showcase: ShowcaseProject[] = [
  card("porsche-sewickley", "Porsche Sewickley", ["Marketing Systems", "Consumer Brands"], PAGE("marketing"),
    "porsche-sewickley-2-blue-tomato-pittsburgh-69f3a7f6ea2e5.png", "A blue Porsche 911 in the Porsche Sewickley showroom"),
  card("a519-chocolate", "A519 Chocolate", ["Food & Beverage", "Consumer Brands"], PAGE("industries/food-beverage"),
    "a-519-chocolates-blue-tomato-pittsburgh.png", "Hand-painted geometric chocolates in deep blue and magenta"),
  card("arno-usa", "ARNO USA", ["Products", "Industrial & Equipment"], PAGE("industries/products"),
    "arno-usa-blue-tomato-pittsburgh.png", "ARNO campaign artwork reading “We are all things Swiss” on red"),
  card("olistico", "Olistico", ["Healthcare & Life Sciences", "Professional Brands"], PAGE("industries/healthcare-life-sciences"),
    "olistico-blue-tomato-pittsburgh-69f3af284b24c.png", "Olistico website design featuring Dr. Lanie Francis"),
  card("mr-mister", "Mr Mister", ["Marketing Systems", "Food & Beverage"], PAGE("marketing"),
    "mr-mister-3-pgh-blue-tomato-pittsburgh-69f3ab7d91048.png", "Plated dishes on a restaurant table with the Mr Mister signature logo"),
  card("good-n-grapey", "Good n’ Grapey", ["Marketing Systems", "Food & Beverage"], PAGE("marketing"),
    "good-n-grapey-3-blue-tomato-pittsburgh-copy.png", "Good n’ Grapey juice pouch packaging on a purple background"),
  card("audi-sewickley", "Audi Sewickley", ["Marketing Systems", "Consumer Brands"], PAGE("marketing"),
    "audi-sewickley-3-blue-tomato-pittsburgh-69f3a97187829.png", "Audi alloy wheel with the Audi Sewickley logo"),
  card("fuku-tea", "Fuku Tea", ["Food & Beverage", "Brand Strategy & Positioning"], PAGE("industries/food-beverage"),
    "fuku-tea-blue-tomato-pittsburgh-mobile-bowl.png", "Fuku Tea logo beside a fruit tea and a bubble tea", [508, 677]),
  card("vallozzi", "Vallozzi", ["Food & Beverage", "Brand Strategy & Positioning"], PAGE("industries/food-beverage"),
    "vallozzi-blue-tomato-pittsburgh.png", "Raised Vallozzi lettering on the restaurant’s green steel facade"),
  card("restately", "Restately", ["Startups", "Brand Strategy & Positioning"], PAGE("industries/start-ups"),
    "restately-blue-tomato-pittsburgh.png", "Restately mobile app held up by a smiling woman"),
  card("ifft-palmer", "Ifft & Palmer", ["Professional Brands", "Web & Digital Experience"], PAGE("industries/professional-services"),
    "ifft-palmer-blue-tomato-pittsburgh.png", "Ifft & Palmer Wealth Management: a warm, book-lined living room"),
];

/** "Explore All Work": the live site has no /portfolio index (404). Marketing
 *  Systems is its broadest portfolio page, so it is the primary destination;
 *  the other two categories are linked alongside it. */
export const allWorkHref = PAGE("marketing");
