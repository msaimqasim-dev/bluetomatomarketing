# Content & Asset Audit — Blue Tomato homepage redesign

Everything on the redesigned homepage comes from the official Blue Tomato website. This document records
the source of each block, where it now appears, what was rearranged, what is new UI wording, and what was
left out — so the manager can verify nothing was invented or silently lost.

## 1. Sources inspected

| Page | URL | Used for |
|---|---|---|
| Homepage | https://bluetomatomarketing.com/ | Hero, Focus / Results / Philosophy, Core Capabilities, founder, 26 testimonials, closing invitation, footer, navigation, metadata, project slideshow |
| About | https://bluetomatomarketing.com/about-us | About section, Work intro, Industries intro |
| Marketing Systems | https://bluetomatomarketing.com/portfolio/marketing | Capability 01 copy; project category verification |
| Brand Strategy & Positioning | https://bluetomatomarketing.com/portfolio/logos | Capability 02 copy; identity work (logos) |
| Web & Digital Experience | https://bluetomatomarketing.com/portfolio/website-design-development | Capability 03 copy; project category verification |
| 12 industry pages | https://bluetomatomarketing.com/portfolio/industries/… | Industry names, URLs, page headlines; project industry verification |
| Stylesheet / logo | `/assets/css/app.css`, `/assets/img/blue-tomato.svg` | Brand colours, logo |

Reference agency sites named in the brief (Instrument, Koto, Buck) were **not** opened in a browser during
this build; no layouts, content or code were taken from them.

## 2. Original homepage content → where it appears now

| Original homepage block | Wording | Now in |
|---|---|---|
| "Marketing That Commands and Converts." | verbatim | **Hero** `<h1>` |
| "We build high-impact brands and performance-driven marketing systems for design-forward and premium businesses." | verbatim | **Hero** supporting line |
| Project slideshow (16 panels) | images | Hero gallery, Selected Work, Capabilities (12 of 16 used — see §6) |
| OUR FOCUS — "Strategy First. Always." + 3 paragraphs | verbatim | **Strategy** — intro (`#strategy`) |
| PHILOSOPHY — "Built With Intent. Backed by Results." + 3 paragraphs | verbatim; middle paragraph's four sentences set as a four-line list | **Strategy** — block 01 (`#philosophy`) |
| RESULTS — "Measured. Meaningful. Scalable." + 3 paragraphs | verbatim; the four growth drivers set as a list | **Strategy** — block 02 (`#results`) |
| "Core Capabilities" heading + 5 image labels | labels transcribed from the images into real text | **Services** image-led sequence: 3 categories + 5 core capabilities |
| Services: "Core Marketing Capabilities" (6 labels), web "Capabilities" (6 labels), About-page "Strategic Clarity / Design Discipline / Marketing Performance" (3 labels) | image-only labels on the live site, transcribed | **Services** — expandable capability directory below the sequence |
| Commented-out service list in the homepage source (17 names: Logos, Websites, SEO, Social Media, Visual Media, Content Creation, Marketing, Influencer Marketing, PR, Brand Strategy, Package Design, Tradeshow Design, Vehicle Wraps, Interior Design, Signage Design, Photography, Videography) | verbatim list, published as a compact "Full service range" index | **Services** — bottom of section. **Flagged for review:** not visible on the live page, though it is in the official source |
| Industries preview block (6 featured + 6 links) | built in the first round, then **removed from the homepage at the client's request**; content kept in `src/content/site.ts` and `components/Industries.tsx` for the future Industries page | — |
| Founder photo, "Kim Collins", "Founder \| CEO" | verbatim | **About** |
| 26 client testimonials | verbatim, generated from the live HTML | **Testimonials** (5 featured; all 26 in the expandable panel) |
| "Ready for a Fresh Approach to Brand Marketing?" + tagline | verbatim | **Final CTA** |
| Email, phone, LinkedIn, Instagram | verbatim | **Final CTA**, **Footer**, mobile menu |
| "© COPYRIGHT BLUE TOMATO LLC 2002. blue tomato® is a REGISTERED TRADEMARK." | verbatim | **Footer** |
| Navigation: Meet Blue Tomato · Our Work (View By Category / View By Industry) · Contact Us | all destinations kept | **Header**, **Footer**, mobile menu |
| `<title>`, meta description, keywords, Open Graph | verbatim | `index.html` |

## 3. Content brought in from other official pages

| Section | Text | Source |
|---|---|---|
| Hero eyebrow | "Pittsburgh Full-Service Marketing, Branding & Web Agency" | Homepage `<title>` |
| Trust strip | "Building brands since 2002" | The line inside the Blue Tomato logo |
| Selected Work | "Built for Brands That Expect More" · "We partner with companies and organizations where brand perception directly impacts value." · "If your business operates at a higher level, your marketing should too." | About page |
| Core Capabilities intro | "We don’t approach marketing as a series of disconnected tactics. We design cohesive ecosystems…" | Marketing Systems page |
| Capability 01 / 02 / 03 | Each page's headline ("Marketing Engineered for Performance." / "Brands Built to Command Attention – and Hold It." / "Experiences Built to Perform.") and its first two paragraphs | The three category pages |
| Industries heading | "Explore our portfolio of brands across industries where clarity, perception, and presentation shape competitive advantage." | About page |
| Industry descriptors | e.g. "Food & Beverage Brands That Build Demand Before the First Bite." | The `<h1>` of each industry page |
| About | "Boutique by Design." · "Nice to meet you. We’re blue tomato." · the strategy-led studio statement · the four body paragraphs · "Whether you’re building, evolving or repositioning your brand…" | About page |

## 4. Rearranged, split or shortened (meaning unchanged)

- **About page H1 split in two.** "Boutique by Design. Built for Brands That Expect More." → "Boutique by Design."
  heads About; "Built for Brands That Expect More" heads Selected Work (the About page also uses it as its own
  sub-heading).
- **Philosophy paragraph → list.** "Sharper strategy wins. Restraint signals confidence. Precision earns
  attention. Consistency builds trust competitors can’t replicate." — same four sentences, one per line.
- **Results sentence → stem + list.** "We focus on what actually drives growth:" then *qualified leads /
  stronger positioning / higher conversion / sustained momentum* (commas and "and" become list structure;
  capitalised by CSS only).
- **Category pages:** only the headline and opening paragraphs are used on the homepage. The remaining copy,
  capability graphics and closing statements stay on those pages.
- **Section order** follows the brief, not the live page.
- **"Our clients don’t just get noticed – they get chosen."** appears twice (Results and closing invitation),
  as it does on the live homepage.
- **Current Services revision:** each of the eight focus descriptions is now one short excerpt from the
  already verified service copy (12-21 words). Original longer headings, paragraphs and all 42 sub-service
  entries are retained in the "Explore every capability" disclosure. The 17-item service range is still
  below it. This moves content out of the animation without discarding it.
- **Founder card revision:** no wording was removed. Typography and spacing were adjusted, the card's
  internal scrolling was removed, and the full original founder photograph is now used rather than the
  earlier tighter crop. Its official source URL is unchanged.

## 5. New wording (transitional / interface only — no factual claims)

Not from the Blue Tomato site; marked with comments in the code where they are content-like.

| Wording | Where | Why |
|---|---|---|
| "Explore Our Work", "Start a Project" | Hero, header, CTA | CTA labels specified in the brief |
| "Selected work" | Hero scroll cue | Names the gallery; links to the trust strip |
| "Explore All Work", "Previous/Next project", "NN / 11" | Work carousel | CTA and control labels |
| "Services", "Full service range", "View by Category", "Included services", "Service NN of 08", "Next:", "Previous/Next service", "Show {service}" | Services stack | Section label, list label and control text |
| "Previous", "Up next", "Scroll to explore", "Explore every capability", "NN / 08" | Current Services sequence | Navigation labels, count and disclosure label; no new business claims |
| "Client Testimonials", "Select a story", "NN / 05", "Read/Hide all 26 client testimonials" | Testimonials | Section label and control text |
| "Pictured: …" | Services cards, Work carousel | Identifies the real project shown |
| Hidden gallery summary (project names) | Hero, visually hidden | Describes the moving images for assistive tech without changing visible content |
| "Services", "Industries", "About" | Navigation | Labels recommended in the brief (live: "View By Category", "View By Industry", "Meet Blue Tomato" — the live labels are kept as panel headings and in the footer) |
| "Selected identity work by Blue Tomato" | Trust strip | States what the marks are |
| "Explore more work", "More industries", "Explore" | Work, Industries, footer | List labels |
| "Explore {category}", "View … work" | Capabilities, work cards | Link text |
| "Pictured: …" | Captions | Identifies the project shown |
| "Client Testimonials", "Read / Hide 21 more client testimonials" | Testimonials | Section label and control |
| "Email", "Call", "Back to top", "Menu", "Close", "Skip to main content", "LinkedIn", "Instagram" | Various | Interface labels (live LinkedIn label is "bluetomato") |
| Image alt text | All images | Descriptions of what is visibly in each image |

## 6. Omitted or changed — for review

| Item | Decision |
|---|---|
| Live `<h1>` is "OUR FOCUS" | The positioning line becomes the H1, as briefed. "Our Focus" is kept as the eyebrow above "Strategy First. Always." |
| Slideshow panels not used: **Fuku Tea, Sitko Bruno, Sushi Fuku** | Fuku Tea and Sitko Bruno exist only at 1600×677; Sushi Fuku is a logo on white. Left out for quality and balance, available for inner pages |
| Slideshow as an auto-rotating banner | Replaced by the art-directed hero and Selected Work |
| Commented-out code on the live homepage | Contact form and Expertise.com award badges are not used. The service-name list was subsequently included at the client's request and is flagged for review above. No award badges or claims were added. |
| Google Analytics / Ads tags, reCAPTCHA | Not included in staging |
| Viewport meta `maximum-scale=1, user-scalable=0` | Not carried over (blocks zoom — an accessibility problem) |
| Meta description email `kim@bluetomatodesign.com` vs footer `hello@bluetomatomarketing.com` | Both preserved as published; **client to confirm** |
| Typeface Montserrat | Replaced by Archivo — design decision for review |
| Industry-page banner strips (1600×400 website collages) | Evaluated, not used: lower resolution and busier than the homepage panels |

## 7. Projects shown and how each label was verified

Names come from the homepage slideshow alt text and the lockups inside the artwork. Tags are the live
portfolio pages each project is published on.

| Shown as | Section | Verified on |
|---|---|---|
| Porsche Sewickley — Marketing Systems | Hero | Marketing Systems page; Consumer Brands page; testimonials (Porsche Sewickley) |
| **Carousel (current Selected Work):** Porsche Sewickley, A519 Chocolate, ARNO USA (Products · Industrial & Equipment), Olistico (Healthcare & Life Sciences · Professional Brands), Mr Mister, Good n’ Grapey, Audi Sewickley, Fuku Tea (Food & Beverage · Brand Strategy & Positioning), Vallozzi, Restately (Startups · Brand Strategy & Positioning), Ifft & Palmer (Professional Brands · Web & Digital Experience) | Selected Work | Each project's categories are the live category/industry pages it appears on (see rows below and the research notes); Fuku Tea also appears in the logo portfolio |
| Audi Sewickley — Marketing Systems · Consumer Brands | Selected Work (previous grid) | Marketing Systems page; Consumer Brands page |
| A519 Chocolate — Food & Beverage · Consumer Brands | Selected Work | Food & Beverage page; Consumer Brands page |
| Mr Mister — Marketing Systems · Food & Beverage | Selected Work | Marketing Systems page; Food & Beverage page |
| Vallozzi — Food & Beverage · Brand Strategy & Positioning | Selected Work | Food & Beverage page; logo portfolio |
| Good n’ Grapey | Capability 01 (Marketing Systems) | Marketing Systems page ("Juice Just Got Good") |
| Identity mosaic: Curis, SpiralGen, Head Right, Vista Energy Resources, Carmell Therapeutics, WPTS Radio, FirstInsight, Brighton Resources Inc. | Capability 02 (Brand) | Logo portfolio |
| La Gourmandine | Capability 03 (Web) | Web & Digital Experience page; testimonial (online store) |
| Ifft & Palmer | Industries → Professional Brands | Professional Brands page |
| Susan Koeppen | Industries → Personal Brands | Personal Brands page |
| Atarashi | Industries → Food & Beverage | Food & Beverage page |
| ARNO USA | Industries → Products | Products page |
| Olistico | Industries → Healthcare & Life Sciences | Healthcare & Life Sciences page |
| Restately | Industries → Startups | Startups page |
| Hero gallery (12 tiles): Porsche Sewickley (911 + wheel), Audi Sewickley, A519 Chocolate, La Gourmandine, Susan Koeppen, ARNO USA, Mr Mister, Vallozzi, Good n’ Grapey, Atarashi, Ifft & Palmer | Hero | Homepage slideshow; each project also verified on its category/industry page |
| Services stack (8 cards): Good n’ Grapey, A519 Chocolate, La Gourmandine, Vallozzi, ARNO USA, Mr Mister, Atarashi, Olistico | Services | Homepage slideshow originals; each also verified on its category/industry page |
| Trust strip: VirtualMGR, CLWARD, NeuroInterventions, GeoNetix, M3 Creative Media, Flat Iron Energy Partners, PRO FLO, Esquire Legal Services | Trust | Logo portfolio (first five are also testimonial clients) |

**Industries:** all 12 live categories are linked from the header, mobile menu and footer. The homepage
section features six (Professional Brands, Personal Brands, Food & Beverage, Products, Healthcare & Life
Sciences, Startups) and links the other six (Consumer Brands, Industrial & Equipment, Technology, Energy,
Education, Non-Profits) directly beside them.

**Testimonials featured** (verbatim, in full): Michael Arnold (Porsche Sewickley), Eric Wolff (Pittsburgh
Pirates), Mark Villella (Porsche | Audi Sewickley), John Ifft (Ifft & Palmer), Jamie Rogers (Rice Energy).
The other 21 keep their original order in the expandable panel.

## 8. Asset register

All files live in `public/images/` and are produced by `scripts/process-assets.mjs` from originals fetched by
`scripts/fetch-sources.sh`. Format: WebP, never upscaled.

| Local file(s) | Original on the official site | Treatment |
|---|---|---|
| Logo (inline SVG, `src/content/generated/logo.ts`; copy in `brand/blue-tomato-logo.svg`) | `/assets/img/blue-tomato.svg` | Paths unchanged; fill removed so it inherits colour (brand blue in header/footer, white in mobile menu) |
| `favicon.ico`, `brand/open-graph.png` | `/favicon.ico`, `/assets/img/open-graph.png` | As supplied |
| `work/porsche-sewickley-911.webp`, `-wheel.webp` | `/uploads/pages/porsche-sewickley-2-…png` (1920×812) | Two crops: centre and right panels |
| `work/audi-sewickley-{960,1920}.webp` | `/uploads/pages/audi-sewickley-3-…png` | Full panel |
| `work/a519-chocolate.webp` | `/uploads/pages/a-519-chocolates-…png` | Portrait crop (4:5) |
| `work/mr-mister.webp` | `/uploads/pages/mr-mister-3-pgh-…png` | Crop of two panels (3:2) |
| `work/vallozzi-{960,1920}.webp` | `/uploads/pages/vallozzi-…png` | Full panel |
| `work/good-n-grapey`, `la-gourmandine`, `ifft-palmer`, `arno-usa`, `olistico`, `restately` `-{720,1440}.webp` | matching `/uploads/pages/…png` (1920×812) | Full panels |
| `work/atarashi`, `susan-koeppen` `-{720,1440}.webp` | matching `/uploads/pages/…png` (1600×677) | Full panels |
| `about/kim-collins-founder-ceo.webp`, `-portrait.webp` | `bluetomatodesign.com/uploads/pages/kim-collins-blue-tomato-pittsburgh-founder-ceo.jpg` (1600×648) | Earlier crops retained as local assets |
| `about/kim-collins-founder-full.webp` | same official founder photograph (1600×648) | Full original composition, locally optimised to WebP, used by the current content-fit founder section |
| `work/cards/*.webp` (11) | the same homepage slideshow originals | 3:4 single-panel crops, ≤560px wide, for the carousel |
| `logos/*.webp` (16) | `/uploads/projects/800-800/fit/…` tiles from the logo portfolio | Padding trimmed, background set to pure white |
| `logos/mono/*.webp` (8) | same tiles | Single-ink navy version (luminance → alpha) for the trust strip |

Exact source URLs for every image are recorded next to each definition in `src/content/images.ts` and
`src/content/generated/identity.ts` (`origin` field). If a local file ever fails to load, the `<Picture>`
component falls back once to that official URL.

### Motion, assets and verification notes (this round)

- **Motion changes are presentation only.** Headlines split into words/lines keep their exact text in the
  DOM; no copy was added, removed or rewritten to make an animation work.
- **Testimonials.** All 26 original quotations are present in the expandable panel, verbatim, with their
  original names, titles and companies. Five of them also appear in the animated focus loop. The small
  gradient cards and numbered buttons are UI elements, not new claims or statistics.
- **Founder.** "Kim Collins / Founder | CEO" and every About paragraph remain on the page; only the
  layout changed. The portrait is the authentic file from the live homepage.
- **Images.** No stock or Pexels imagery was used: the official Blue Tomato project panels were strong
  enough for every service card. No other agency's work was used as a portfolio example.
- **Image-loading fix.** The sandbox had removed the binary assets, the About CSS, and the fallback paths
  for the cylinder's raw `<img>` elements. All 63 assets were regenerated from the official sources; every
  image now uses a local optimised WebP with a documented one-shot fallback to its original URL. See
  README §4c and `scripts/qa/check-assets.mjs`.
- **Reference material.** The attached code screenshot was not legible at the supplied resolution, so the
  cylinder was matched to the attached preview screenshot (visible rear row). METRIC Civil was reviewed
  for the scroll-card concept only; no METRIC copy, images or code were used.

### Not obtained / not used

- **Third-party client logos** (Porsche, Audi, Pittsburgh Pirates, Rice Energy…) are not on the Blue Tomato
  site as standalone assets and were not sourced elsewhere or recreated. The trust strip uses identity work
  Blue Tomato itself designed and published.
- **Higher-resolution masters** than 1920×812 are not available on the live site.
- **Individual case-study pages, `/portfolio` and `/contact`** do not exist on the live site (404), so
  nothing links to them and none were invented.
- **Client photos / headshots** for testimonials: none published, none added.
