import { images } from "./images";
import { services } from "./site";
import type { Img } from "./types";

/**
 * CONTENT RULE: every name below is transcribed from the official Blue Tomato
 * website (bluetomatomarketing.com). See docs/CONTENT-AUDIT.md.
 *
 * - `core`: the five "Core Capabilities" labels printed inside the homepage
 *   graphics (asset-1…asset-5.png).
 * - `marketing`: the six "Core Marketing Capabilities" labels printed inside
 *   the Marketing Systems page graphics (asset-9…asset-14-at-4x.png).
 * - `web`: the six "Capabilities" labels printed inside the Web & Digital
 *   Experience page graphics (asset-20…asset-25-at-4x.png).
 * - `brand`: the three labels printed inside the About page graphics
 *   (asset-6…asset-8.png).
 * - `fullRange`: the service list present in the live homepage source.
 *
 * Paragraphs are verbatim from the three category pages. Nothing invented.
 */

export const coreCapabilities = [
  "Brand Strategy & Positioning",
  "Creative Direction & Visual Systems",
  "Performance Marketing (SEO, Paid Media)",
  "Content & Campaign Development",
  "High-End Web Design & Development",
];

export const marketingCapabilities = [
  "Performance Marketing (SEO & Paid Media)",
  "Campaign Strategy & Execution",
  "Content Development & Direction",
  "Digital & Traditional Media Planning",
  "Influencer & Partnership Strategy",
  "Creative Direction & Visual Systems",
];

export const webCapabilities = [
  "Custom Web Design & Development",
  "UX/UI Strategy & Site Architecture",
  "SEO & Performance Optimization",
  "Content Management Systems",
  "E-Commerce Development",
  "Accessibility & Mobile Optimization",
];

export const brandPrinciples = ["Strategic Clarity", "Design Discipline", "Marketing Performance"];

export const fullServiceRange = [
  "Logos",
  "Websites",
  "SEO",
  "Social Media",
  "Visual Media",
  "Content Creation",
  "Marketing",
  "Influencer Marketing",
  "PR",
  "Brand Strategy",
  "Package Design",
  "Tradeshow Design",
  "Vehicle Wraps",
  "Interior Design",
  "Signage Design",
  "Photography",
  "Videography",
];

export type ServiceCard = {
  id: string;
  /** Verified group label shown above the name. */
  group: string;
  name: string;
  headline: string;
  body: string[];
  /** Every relevant official sub-service name, shown as a compact index. */
  includes: string[];
  href: string;
  image: Img;
  pictured: string;
};

/** Short, verbatim excerpts for the image-led Services sequence. Longer copy
 * and every sub-service remain in the expandable service directory below it. */
export const serviceSummaries = [
  "Marketing isn\u2019t about visibility alone \u2013 it\u2019s about influence, positioning, and conversion.",
  "We build brands with clarity and intent \u2013 designed to position you at a higher level and create lasting competitive advantage.",
  "We design and develop custom web experiences that elevate perception, communicate with clarity, and drive measurable results.",
  "A brand is more than a logo. It\u2019s how you\u2019re perceived, remembered, and ultimately chosen.",
  "This isn\u2019t about decoration. It\u2019s about building a system that signals value instantly and reinforces it over time.",
  "Every initiative is rooted in strategy and designed to deliver measurable impact.",
  "We design cohesive ecosystems where every channel, message, and asset works together.",
  "No templates. No unnecessary complexity. Just thoughtful execution built to scale with your business.",
];

// Use the existing single-panel portfolio crops in the tall focus image,
// rather than cropping through the middle of a multi-panel banner.
const portrait = (image: Img, name: string): Img => ({
  ...image,
  src: `images/work/cards/${name}.webp`,
  srcSet: undefined,
  width: 560,
  height: 747,
});

export const serviceCards: ServiceCard[] = [
  {
    id: "marketing-systems",
    group: "Service 01 of 08 — View by Category",
    name: services[0].name,
    headline: services[0].headline,
    body: services[0].body,
    includes: marketingCapabilities,
    href: services[0].href,
    image: portrait(images.goodNGrapey, "good-n-grapey"),
    pictured: "Good n’ Grapey",
  },
  {
    id: "brand-positioning",
    group: "Service 02 of 08 — View by Category",
    name: services[1].name,
    headline: services[1].headline,
    body: services[1].body,
    includes: brandPrinciples,
    href: services[1].href,
    image: images.a519,
    pictured: "A519 Chocolate",
  },
  {
    id: "web-experience",
    group: "Service 03 of 08 — View by Category",
    name: services[2].name,
    headline: services[2].headline,
    body: services[2].body,
    includes: webCapabilities,
    href: services[2].href,
    image: images.laGourmandine,
    pictured: "La Gourmandine",
  },
  {
    id: "core-brand-strategy",
    group: "Core Capability 04 of 08",
    name: coreCapabilities[0],
    headline: "A brand is more than a logo. It’s how you’re perceived, remembered, and ultimately chosen.",
    body: [
      "We begin by defining what your brand stands for – your positioning, your audience, and the space you own in the market.",
    ],
    includes: ["Brand Strategy", "Logos", "Package Design", "Signage Design"],
    href: services[1].href,
    image: images.vallozzi,
    pictured: "Vallozzi",
  },
  {
    id: "core-creative-direction",
    group: "Core Capability 05 of 08",
    name: coreCapabilities[1],
    headline: "From there, we translate that strategy into a cohesive visual and verbal identity.",
    body: ["This isn’t about decoration. It’s about building a system that signals value instantly and reinforces it over time."],
    includes: ["Visual Media", "Interior Design", "Tradeshow Design", "Vehicle Wraps", "Photography", "Videography"],
    href: services[1].href,
    image: portrait(images.arno, "arno-usa"),
    pictured: "ARNO USA",
  },
  {
    id: "core-performance",
    group: "Core Capability 06 of 08",
    name: coreCapabilities[2],
    headline: "We build performance-driven marketing systems that move brands forward with clarity and precision.",
    body: ["Every initiative is rooted in strategy and designed to deliver measurable impact."],
    includes: marketingCapabilities,
    href: services[0].href,
    image: portrait(images.mrMister, "mr-mister"),
    pictured: "Mr Mister",
  },
  {
    id: "core-content",
    group: "Core Capability 07 of 08",
    name: coreCapabilities[3],
    headline: "We design cohesive ecosystems where every channel, message, and asset works together.",
    body: ["Our process begins with strategy – defining your audience, refining your positioning, and identifying the highest-value opportunities for growth."],
    includes: ["Content Creation", "Social Media", "Influencer Marketing", "PR", "Digital & Traditional Media Planning"],
    href: services[0].href,
    image: images.atarashi,
    pictured: "Atarashi",
  },
  {
    id: "core-web-design",
    group: "Core Capability 08 of 08",
    name: coreCapabilities[4],
    headline: "No templates. No unnecessary complexity. Just thoughtful execution built to scale with your business.",
    body: ["We prioritize clarity, usability, and performance to ensure your site not only looks exceptional – but works exactly as it should."],
    includes: webCapabilities,
    href: services[2].href,
    image: portrait(images.olistico, "olistico"),
    pictured: "Olistico",
  },
];
