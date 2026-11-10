# Blue Tomato Marketing — Homepage Redesign (Phase 1)

A complete visual redesign of the **homepage only** of <https://bluetomatomarketing.com/>, built as a
staging prototype for manager / client review. No inner pages are built, nothing is deployed, and the
live site is untouched.

- **Content:** 100% from the official Blue Tomato website — see [`docs/CONTENT-AUDIT.md`](docs/CONTENT-AUDIT.md)
  for where every block came from and where it now lives.
- **Refinement round:** new full-screen animated hero, transparent→solid navbar, Industries preview removed
  from the homepage (content kept for the future page), and the three strategy blocks merged into one
  section. Details in §4a and the audit.
- **Imagery:** only genuine Blue Tomato work and brand assets, downloaded, optimised and hosted locally.
- **No invented** clients, projects, statistics, awards, testimonials or claims.

---

## 1. Run it locally

```bash
npm install
npm run dev        # development server with hot reload
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

Deploy/preview the **whole `dist/` folder** (`index.html`, `images/`, `favicon.ico`). All asset paths are
relative, so it works from a domain root or a sub-folder.

## 2. Stack — and why

The brief prefers plain HTML/CSS/JS, but also says to respect an established repo stack. This repository
already ships **React + Vite + Tailwind**, so that tooling is kept. To stay close to the brief's intent:

- All styling is **plain, token-driven CSS** (`src/styles/*.css`, custom properties, Grid/Flexbox, `clamp()`).
  Tailwind only supplies its reset. The stylesheets port to a static build unchanged.
- **No animation or UI libraries.** Motion is CSS; behaviour lives in a handful of small React components
  plus one `IntersectionObserver`.
- Content is separated from markup (`src/content/`), so the approved design system can be reused for inner pages.

```
index.html                  SEO metadata (preserved from live), staging noindex, canonical
src/
  App.tsx                   Section order
  components/               One file per homepage section (+ ui/ primitives)
  content/                  All copy, links, image definitions (generated/ = produced from live HTML)
  hooks/useReveal.ts        Scroll-reveal controller
  styles/                   tokens · base · header · hero · sections · footer
public/images/              Optimised local assets (work, logos, about, brand)
scripts/                    fetch-sources → process-assets → generate-content, and qa/
docs/CONTENT-AUDIT.md       Content map, asset register, transitional copy, omissions
```

## 3. Design system

### Colour (`src/styles/tokens.css`)

| Token | Value | Origin | Use |
|---|---|---|---|
| `--blue-500` | `#0081c3` | **Live site** (stylesheet + logo SVG fill) | Brand blue: logo, large type, colour fields |
| `--blue-600` | `#0073ae` | Derived shade | Small blue text and button fills (AA-safe, see below) |
| `--blue-300` | `#80c0e1` | **Live site** | Accents on navy |
| `--blue-50` | `#f0f7fb` | Derived tint | Very light blue background |
| `--navy-900` | `#071a2b` | Derived from brand hue | Dark sections, headings |
| `--off-white` | `#f7f7f8` | **Live site** | Alternating background |
| `--gray-700` / `--gray-500` | `#4e4e4e` / `#626166` | **Live site** | Body / supporting copy |
| `--gray-200` | `#e2e2e2` | **Live site** | Hairlines |

**Why two blues?** White on the exact brand blue is 4.26:1 — fine for large type, just under WCAG AA (4.5:1)
for small text. So `#0081c3` is used wherever blue is *seen* (logo, headline words, the hero field, the Results
section — which uses large type only), and the near-identical `#0073ae` (5.17:1) only where small text needs it.

Measured contrast (WCAG formula): body grey on white 8.32 · muted grey on white 6.14 / off-white 5.73 ·
`#0073ae` on white 5.17 / off-white 4.83 / light blue 4.77 · white on navy 17.62 · body on navy 10.45 ·
muted on navy 7.32 · light-blue accent on navy 8.85.

### Typography

One family: **Archivo Variable** (SIL OFL, bundled locally, latin subset, weight + width axes).
Headlines use weight 600 at 86–88% width with tight tracking; body copy is regular width.
Fluid scale: display 44→136px · h2 36→80 · h3 28→52 · h4 20→28 · lead 18→24 · body 16→18.
*This replaces the live site's Montserrat — a design decision for review.*

### Layout & motion

- 12-column grid, 1440px max content width, gutters `clamp(20px, 4vw, 48px)`, section spacing 72→144px.
- 2px corner radius, hairline rules, no shadows, gradients, glass effects or decorative icons.
- Motion: hovers 220ms, panels 450ms, reveals 700ms, one easing curve. Hero plays a single load sequence
  (masked headline lines → copy → CTAs → image wipe). Everything else reveals once on scroll.
- `prefers-reduced-motion`: all content shown immediately, animations and smooth scrolling disabled.

## 4. Key design decisions

1. **Hero as a full-screen editorial split.** Oversized three-line headline on the left; on the right, two
   vertical columns of Blue Tomato's own project work moving in opposite directions, edge-masked, at
   different crops and speeds. The background is a single gradient built from the brand blue through a light
   cyan to white — three stops of the same hue, no unrelated colours. Layout is a 7/5 split at desktop and
   stacks with the gallery beneath the CTAs below 1024px.
2. **Blue used sparingly, at scale.** Two blue moments only (hero field, Results section), so each lands.
   Navy carries the philosophy and closing sections; white/off-white carry the work.
3. **The work is shown at its native proportions.** Blue Tomato's project panels are designed as wide
   compositions with client lockups. They are not chopped into identical cards: one full-width feature, a
   portrait + landscape pair on a shared baseline, and a large feature beside the "more work" links.
4. **Typography instead of statistics.** Blue Tomato publishes no numbers, so none appear. Results and
   Philosophy are carried by the brand's own sentences set large — e.g. the four-sentence philosophy
   paragraph becomes four ruled lines.
5. **Image-only content became real text.** The live "Core Capabilities" are five PNGs with `alt="image-1"`.
   They are now indexable text.
6. **Nothing dropped silently.** All 26 testimonials are on the page (5 featured, 21 in an accessible
   expandable panel). Six industries are featured; the other six are linked directly beside them.
7. **Credibility without claims.** The trust strip uses the line from the Blue Tomato logo ("Building brands
   since 2002") and real identity work — five of the eight marks belong to clients quoted further down.

## 5. Interactive elements

| Element | Behaviour |
|---|---|
| Header | Fixed overlay: transparent over the hero, solid white with hairline + lift after 24px; no layout shift |
| Services / Industries menus | Disclosure buttons → full-width panels. Click / Enter / Space toggle, hover opens on pointer devices, `Esc` closes and returns focus, outside click or tabbing away closes |
| Mobile menu | Full-screen dialog: focus moves in, Tab is trapped, `Esc` closes, focus returns to the trigger, page behind is inert and scroll-locked; accordions for Services / Industries |
| Hero gallery | Two counter-moving columns (78s / 94s, seamless −50% loop); pauses and scales the hovered tile on pointer devices with motion enabled; static under reduced motion |
| Hero | One-off load animation (masked headline → copy → CTAs → gallery) |
| Work carousel | 3D cylinder with visible back row: drift, hover-pause, drag/swipe with momentum + snap, click-to-focus, ←/→ keys, Prev/Next, live announcement, pointer parallax; stops offscreen; static under reduced motion |
| Services stack | Native page scroll advances 8 cards through previous / focused / next positions; click a small card or use Prev/Next; static list under reduced motion |
| Testimonials | 5 featured quotes in a 9s infinite loop, small cards + numbered gradient buttons promote a quote, ←/→ keys, Prev/Next, panel with all 26; pauses on hover/focus and offscreen |
| Site-wide motion | Masked word reveals, line reveals, scroll-progress bar, founder-image parallax |
| Capability rows | Image scale + title/arrow emphasis on hover and focus |
| ~~Industries~~ | Not rendered on the homepage; content preserved for the future Industries page |
| Testimonials | Manual carousel (buttons, ←/→ keys, no autoplay, polite live announcement) + expandable panel with the remaining 21 |
| In-page links | Smooth scroll with header offset (instant under reduced motion) |

### 4a. What changed in the refinement round

- **Hero.** Rebuilt as described above. Headline and supporting copy are untouched. The gallery uses 12
  genuine projects (Porsche Sewickley ×2 crops, Audi Sewickley, A519 Chocolate, La Gourmandine, Susan
  Koeppen, ARNO USA, Mr Mister, Vallozzi, Good n’ Grapey, Atarashi, Ifft & Palmer). Each column renders its
  tiles twice and translates exactly −50%, so the loop is seamless; duplicates are `aria-hidden`. Columns run
  78s (up) and 94s (down). Tiles are `eager` (a lazy image in a moving column would pop in half-visible),
  hover pauses both columns and scales the hovered image, and project names appear as captions. Under
  `prefers-reduced-motion` the columns are static, offset to show a spread of work, with no animation.
  A visually hidden summary lists the projects so the gallery is not image-only for assistive tech.
  The reference (creativcurrent.com) was reviewed for its animated portfolio presentation; no layout,
  copy, imagery or code was taken from it.
- **Navbar.** One fixed bar, no reserved space: transparent with white logo/links/CTA over the gradient, and
  a 400ms fade to solid white with blue logo, navy links, a hairline border and a soft lift after 24px of
  scrolling. It returns to transparent at the top. Because it floats, the hero can run to the top edge and
  nothing shifts when the state changes (document height measured identical before/after).
- **Strategy section.** "Strategy First. Always.", "Built With Intent. Backed by Results." and "Measured.
  Meaningful. Scalable." now form one navy section. Every sentence is preserved word for word; the four
  philosophy sentences and the four growth drivers are set as lists, which is why the copy reads exactly as
  published. Keywords retained: strategy, positioning, perception, precision, consistency, trust,
  measurable growth, qualified leads, conversion, momentum, results. `#philosophy` and `#results` anchors
  are kept on the two sub-blocks.
- **Industries preview removed from the homepage** as requested. The canonical content (all 12 real
  categories, URLs and page headlines) stays in `src/content/site.ts`, and the component is kept unrendered
  in `components/Industries.tsx` for the future page. Header, mobile menu and footer industry links still
  point at the live pages, so nothing is orphaned. The homepage-only styles for that block were removed
  with the old Philosophy/Results CSS.
- **Anchors** now clear the floating bar: `scroll-padding-top` covers in-page links (works with the
  reduced-motion "auto" path), and the mobile menu measures the live header height before scrolling.
- **Regression fixes.** Restored the asset set after the environment wiped `public/images` (the pipeline
  regenerates all 53 files), re-cropped the hero Porsche image to sit tightly on the car body, and replaced
  the auto-generated mono logo treatment's use of `src` overrides with a documented path.

### 4b. Featured Work — 3D cylindrical carousel

The static grid in "Built for Brands That Expect More" is replaced by `components/CylinderCarousel.tsx`
(native React; this repo's existing stack — no new dependency). Heading, supporting line and the closing
statement are unchanged.

- **Reference.** The brief mentioned a supplied `CircularCarousel` component + CSS; no such file was
  attached or present in the repository, so the carousel was built from the written specification. If the
  file is provided, timings/curves can be matched to it exactly.
- **Geometry.** 11 cards on the outside of a vertical cylinder: card *i* is `rotateY(i·step) translateZ(R)`
  with `R = (cardWidth + gap) / (2·tan(π/N))`; the ring is pushed back by `R` so the front card renders at
  true size, then tilted −5°. Perspective 2500px / card 260px (≥1024px), 1900px / 210px (640–1023px),
  1300px / 172px (<640px); gap 25px; 2px corner radius.
- **Motion.** One `requestAnimationFrame` loop writes a single transform to the ring and `opacity` / `--shade`
  to each card (compositor-friendly; no React render per frame). States: drift (≈7°/s to the left, "speed
  14"), drag (pointer distance mapped to arc length), coast (release velocity × momentum 0.6 with friction),
  snap (spring to the nearest card, hold 1.8s, ease back into drift). Hover pauses the drift with an eased
  stop; subtle pointer parallax (±3° tilt, ±14px). Cards rise into place once when the section first appears.
- **Depth.** Cards are visible through ~100° and hidden behind; side cards are shaded at most ~22% with a
  navy overlay, so they never go dark. The viewport fades its outer 9% (5% on phones) so cards curving out of
  view never look cut off.
- **Interaction & accessibility.** Clicking a side card brings it to the front; clicking the front card opens
  its live portfolio page (new tab). Drag/swipe never triggers a click. ←/→ keys, Prev/Next buttons and
  tabbing through the cards all rotate to the focused project; a polite live region announces
  "NN / 11 — name — categories". Touch uses `touch-action: pan-y` plus a direction lock, so vertical swipes
  scroll the page. The loop stops entirely when the section is offscreen. Reduced motion: no drift, no
  intro, no parallax; buttons/keys/drag still work.
- **Content.** 11 genuine projects as 3:4 single-panel crops of the homepage slideshow originals (Porsche
  Sewickley, A519 Chocolate, ARNO USA, Olistico, Mr Mister, Good n’ Grapey, Audi Sewickley, Fuku Tea,
  Vallozzi, Restately, Ifft & Palmer). Atarashi, La Gourmandine, Susan Koeppen and Sitko Bruno were tried
  and left out because every 3:4 window cut through their headline type. Categories are the live
  category/industry pages each project appears on; each card links to its first category's page.
- **"Explore All Work"** → the live Marketing Systems portfolio (the site has no `/portfolio` index — it
  returns 404 — and Marketing Systems is its broadest portfolio page), with the three category pages linked
  beside it.
- **Fix found while doing this:** last round's hero crop asked for a region taller than the 812px original;
  that run failed silently and kept the older crop. The crop is now valid and `images.ts` matches it.

### 4c. This round — cylinder back row, services stack, founder, testimonials, site-wide motion

**Honest note on the attachments.** The supplied code screenshot was a very tall, low-resolution image;
the code itself was not legible, so exact variable names/timings could not be read from it. The preview
screenshot was clear and became the visual target: a cylinder whose **back row of cards is visible above
the front row**, with cards travelling from front to back. METRIC's "FULL-SCOPE CIVIL CONSTRUCTION"
section was reviewed from its published page markup for the scroll-card concept; no code, copy or imagery
was copied.

1. **Cylinder now reads as a full circle.** Each card has a mirrored rear face whose opacity is driven by
   the same animation frame as the front face. Cards on the far side fade in dimly, so you can follow one
   as it leaves the front row, curves around the side and travels across the back — the effect in the
   reference preview. Front faces remain at most ~22% shaded; the rear faces are darker purely for depth.
   Perspective origin was lifted slightly (36%) so the back row peeks above the front.
2. **Services → scroll-driven card stack** (`components/ServicesStack.tsx`). One sticky viewport with
   three states: previous service small at top-left, focused service centred with its description on the
   right, next service small at bottom-right. Scrolling normally (no hijack) moves cards through those
   states using one `requestAnimationFrame` loop. On desktop the focused card is 900px wide, leaving room
   for the two smaller cards; on phones only the focused card is shown and the rail names the next one.
   Off-stage cards are `visibility:hidden`, so they leave the tab order.
   **Every published service name is on the page**: 8 cards (3 categories + 5 core capabilities), 59
   in-card service chips, and a 17-item "Full service range" from the live homepage source. Names were
   transcribed from the official capability graphics (`asset-1…5`, `asset-9…14-at-4x`,
   `asset-20…25-at-4x`, `asset-6…8`), which were previously image-only. All card copy is verbatim from
   the three category pages. Official project photography was strong enough that **no stock/Pexels
   imagery was needed**. Reduced motion renders all 8 cards as a normal static list.
3. **Founder** (`components/About.tsx`). Full-bleed authentic Kim Collins portrait from the live site,
   with a navy glass card (blur + hairline border) over the left and the face clear on the right. The
   remaining About paragraphs sit below the image so none of the original copy is lost. Subtle scroll
   parallax on the image. On phones the image is a wide crop with the glass card overlapping it.
4. **Testimonials** (`components/Testimonials.tsx`). Left: four small gradient cards for the other
   featured clients plus five numbered gradient buttons; right: one large focus card. Clicking a small
   card or number promotes it into the focus card with a 720ms rise/scale. The five featured quotes
   advance in a **continuous 9s loop** (paused on hover/focus, stopped offscreen and under reduced
   motion). **All 26 verbatim quotes, names, titles and companies** remain in the DOM in the expandable
   panel (`scripts/generate-content.mjs` generates them from the live HTML — they are never retyped).
5. **Site-wide motion** (`hooks/useMotion.ts`, `ui/ScrollProgress.tsx`). One shared IntersectionObserver
   reveals sections; plain headings are split into masked words (25 words) that rise in sequence; the
   three composed strategy headlines animate line-by-line (7 lines); a thin brand-blue scroll-progress
   line fills under the fixed header; the founder image gets scroll parallax. All of it is off under
   `prefers-reduced-motion`, and text stays real text (DOM-built spans) for SEO and screen readers.
6. **Why some images were not loading — fixed.** Four separate causes:
   - this sandbox had again removed the binary files in `public/images` (only the brand SVG survived), so
     the previous build pointed at files that no longer existed. Regenerated all **63 official assets**
     with `scripts/fetch-sources.sh` + `scripts/process-assets.mjs` (verified with
     `node scripts/qa/check-assets.mjs` — 21 referenced paths, 0 missing).
   - the old About `<picture>` `<source>` could bypass the fallback; it now uses the shared `<Picture>`
     component on every breakpoint.
   - the cylinder's raw `<img>` elements had no fallback; front and rear faces now both fall back to the
     documented original URL on the live site, and `index.html` preconnects those hosts.
   - the **About CSS had been dropped** in an earlier section merge, so that section was effectively
     unstyled. It was restored with the new full-bleed design.
   The local optimised WebP files remain the primary source; the remote URL is a one-shot `onError`
   fallback, not a hotlink dependency.

### 4d. Current revision: content-fit founder card and image-only Services sequence

This revision supersedes the Services layout described in 4c. Only Services and About were redesigned;
the hero, header, work carousel, strategy, testimonials, CTA and footer components were not changed.

- **Founder scrollbar removed at the source.** The glass card no longer has a height cap or
  `overflow-y: auto`. It participates in normal layout, and the full-bleed image section grows with its
  content. Heading size, leading and spacing are fluid; no original paragraph was removed or clipped.
  The portrait uses a locally optimised version of the full original 1600x648 photo, keeping Kim on the
  right rather than enlarging the older crop. Below 1024px, the image and overlapping glass card stack
  so the text cannot cover her face. There is no inner scrollbar at any tested size.
- **Reference studied in the browser.** METRIC's live "FULL-SCOPE CIVIL CONSTRUCTION" scene was inspected
  at several scroll positions. The key distinction is that only images travel: the current image shrinks
  into an upper-left thumbnail while the lower-right thumbnail grows into the large image. Its description
  remains separate. The new implementation follows that interaction, not the former all-in-one card stack.
- **Services rebuilt.** `src/components/ServicesStack.tsx` now measures three image slots using
  `ResizeObserver`; a scroll-scheduled animation frame interpolates the image bounds. The description
  has its own column with a step counter, heading, one short summary and live-page link. Copy fades out
  before an image crosses the text column. The first/last steps correctly disable their unavailable
  previews; scrolling, clicking previews, buttons and arrow keys work forward and backward. Phones keep
  the small previews and move the description below the main image. The new styles are isolated in
  `src/styles/services.css`.
- **Descriptions shortened, content retained.** Each of the eight summaries is a 12-21-word excerpt from
  the existing verified content (`serviceSummaries` in `src/content/services.ts`). Full paragraphs and
  all 42 sub-service entries remain in the native "Explore every capability" disclosure below the scene.
  The existing 17-item full service range and three category links remain alongside it. No business
  claim, service or project was invented. Existing single-panel crops are used where they avoid cutting
  across a multi-panel banner.
- **Fallbacks.** Reduced motion or a viewport at most 600px tall shows an ordinary, readable eight-item
  list instead of pinning the scene. Neither the founder card nor the service descriptions need an
  internal scrolling area.

**Verification for this revision:** `scripts/qa/services-founder.mjs` passed **110/110 assertions** across
1920x714, 1440x900, 1280x720, 1024x768, 768x1024, 390x844 and 320x670, plus reduced-motion and short-phone
fallbacks. Checked all eight steps: correct image count, no text/image overlap, image and copy inside the
scene, concise summaries, forward/reverse preview controls, arrow-key controls, directory entries and
founder content fit. A touch swipe over Services scrolled the native page. Screenshots were reviewed at
desktop, tablet and mobile sizes. Whole-page regression at 1440/768/390 with both motion preferences found
no horizontal overflow, broken images, unrevealed content or console errors. Existing navigation, focus
trap and testimonial controls also passed. Build and TypeScript checks pass. Safari, Firefox, real-device
testing, screen-reader testing and Lighthouse remain unverified.

**Links.** Pages that are not part of this phase link to their **verified existing URLs on the live site**
and open in a new tab (with a screen-reader hint) so reviewers keep the prototype open — see
`src/components/ui/LiveLink.tsx`; swap it for internal links when inner pages exist. `/portfolio` and
`/contact` return 404 on the live site, so nothing links to them. "Start a Project" scrolls to the closing
section, whose primary action is a real `mailto:`; no form backend is invented.

## 6. SEO notes

- `<title>`, meta description, keywords and Open Graph tags are **verbatim from the live homepage**.
- `rel="canonical"` → the live homepage, plus `noindex, nofollow` so staging cannot compete with production.
  **Remove the robots tag at launch.** No production URLs are changed.
- One `<h1>` ("Marketing That Commands and Converts."), then a clean h2/h3 outline; semantic landmarks;
  descriptive alt text; meaningful link text; the live `#contact-us` anchor is preserved.
- No structured data added (nothing verified to put in it). Analytics/ads tags from the live site are
  deliberately **not** included in staging.

## 7. QA summary

### Tested (headless Chromium 131 via Playwright; scripts in `scripts/qa/`)

- `npm run build` succeeds; `tsc --noEmit` reports 0 errors.
- **Widths 1920, 1440, 1280, 1024, 768, 390, 375, 320:** no horizontal overflow, no element outside the
  viewport, no broken images, no failed requests, no console errors, exactly one `<h1>`, web font loaded.
- **Screenshots reviewed by eye:** 1440 and 390 (full page), 1920 (hero), 1024, 768 and 320 (upper part of
  the page; 320 also lower part), plus open navigation panels, mobile menu states, the industries interaction
  and expanded testimonials.
- **Keyboard / navigation:** skip link is the first tab stop; menus open, accept Tab into the panel, close on
  `Esc` with focus restored, close on outside click and on pointer leave.
- **Mobile menu:** focus moves to Close, page is inert and scroll-locked, focus stays trapped (14 tab
  presses), `Esc` closes and restores focus, in-menu links close the menu and land below the header.
- **Scroll reveals (motion on):** 69 hidden → 0 hidden after scrolling. This run caught and fixed a real bug —
  image frames hidden by their own `clip-path` were never reported as intersecting.
- **Reduced motion:** all content visible at load; animations effectively 0s; smooth scroll off.
- **Testimonials:** one visible slide at a time; arrows and ←/→ work; closed panel is inert; 21 quotes on
  expand; 26 `<blockquote>`s in the DOM.
- **Hero/navbar (this round), 1440 + 768 + 390:** hero is exactly viewport height at 1440 (900px) with copy
  and gallery side by side and no overlap; stacked at 768 (1243px) and 390 (1051px) with copy above the
  gallery; no horizontal overflow. Navbar overlay state measured transparent with white logo/links at the
  top, solid white with border + shadow and blue/navy type after scrolling, and transparent again at the
  top; document height identical before/after. Two marquee tracks with durations 78s/94s, equal duplicate
  group heights (seamless), both moving, both paused on hover. Reduced motion: `animation-name: none` on
  both tracks. Mobile menu over the hero still traps focus, locks scroll and closes on Escape.
- **Carousel (this round), 1440 / 768 / 390:** 11/11 card images load (lazy until the section nears the
  viewport, then all at once so rotating cards never pop in); front card fully inside the viewport, no
  card clipped vertically, no page overflow. Drift measured moving left (~10.5° per 1.5s); hover pause
  holds rotation (Δ ≈ 0.02° from the eased stop); a mouse drag coasted beyond the release point and settled
  exactly on a card; clicking a side card focused it without opening a tab; ArrowRight and Prev step one
  card; the loop stops when offscreen (Δ 0). At 390 a touch swipe rotated and snapped, and a vertical swipe
  over the carousel still scrolled the page (~300px). Reduced motion: zero drift, cards visible. No console
  errors at any width. Full-page regression at 1440/768/390 unchanged elsewhere.
- **This round (`scripts/qa/redesign.mjs`), 1440 / 768 / 390:** 63 images on the page, 0 broken,
  0 missing `alt`, no horizontal overflow, one H1, 0 unrevealed elements after scrolling. Carousel rear
  faces visible on 4 cards with 11/11 rear images loading. Services: 8 cards, 59 chips, 17 full-range
  names, 8/8 card images loading, focused card fully inside its viewport at four different scroll
  positions, labels advancing 01→03→06→08. Founder: stage width equals viewport at all three widths,
  portrait loads, glass card inside and on the left, credit on the right. Testimonials: clicking a small
  card changes the focus quote, a numbered button jumps, panel holds all 26 quotes and is inert when
  closed; autoplay advanced by itself after 9s. Reduced motion: services render a static list, no hidden
  words/lines, cylinder static. No console errors at any width.
- **Regressions fixed during QA:** a stale `ease` variable broke the services loop (caught as
  `JS ease is not defined`); hidden service cards were still focusable at 19px (now `visibility:hidden`);
  reduced motion produced a 0.01° cylinder drift (now exactly 0); the QA scripts were updated for the new
  `--front-opacity` and testimonial markup.
- **Anchor offsets:** `#work` and `#contact-us` land 1px under the header edge at 1440; `#work` lands 9px
  under it from the mobile menu at 390.
- **Full regression at 1920/1440/1280/1024/768/390/375/320:** no overflow, no broken images, no console
  errors, one H1, no unrevealed elements; 52 hidden → 0 after scrolling; 80 links, all in-page anchors
  resolve, no `target=_blank` without `rel=noopener`; no visible touch target under 44px at 390.
- **Links:** 91 links; external hosts limited to bluetomatomarketing.com, linkedin.com, instagram.com; every
  in-page anchor resolves; all 16 linked live pages returned HTTP 200 when fetched during research.
- **Touch targets:** no visible link or button under 44px tall at 390px. **Images:** every `<img>` has `alt`.
- **Contrast:** ratios computed for every text/background pairing (section 3).

### Not tested — unverified

- **Lighthouse / Core Web Vitals:** not run; no scores are claimed. (The hero now paints up to 12 eager
  WebP tiles; total hero image weight should be watched when measuring LCP.)
- **Safari, Firefox, and real iOS/Android devices.**
- **Screen readers** (VoiceOver, NVDA, JAWS) — semantics follow WAI-ARIA patterns but were not listened to.
- 1280 and 375 were checked by automated metrics only, not by eye. The lower part of the page at 1024 and
  768 was checked by metrics only.
- The LinkedIn and Instagram URLs are copied from the live footer but were not requested.

## 8. Known limitations and points for review

1. **Client-side rendering.** With the repo's React stack the content is rendered by JavaScript. Fine for a
   review prototype; for launch either pre-render it or port to static HTML (the CSS carries over as is).
2. **The H1 changes.** The live homepage's `<h1>` is "OUR FOCUS" and the positioning line is an `<h2>`. The
   redesign makes "Marketing That Commands and Converts." the H1, as briefed — flag for SEO sign-off.
3. **Font weight in the HTML.** The repo's single-file build plugin inlines the font, giving a 430 KB
   `index.html` (184 KB gzipped). In production, serve the font as its own cached file.
4. **Image resolution.** The largest originals on the live site are 1920×812 (founder portrait 1600×648).
   Crops are never upscaled, but the hero and portrait fall slightly short of full 2× density on retina
   screens. Higher-resolution masters from the client would improve them.
5. **Email inconsistency on the live site.** The meta description says `kim@bluetomatodesign.com`; the footer
   says `hello@bluetomatomarketing.com`. Both are preserved as published — the client should confirm.
6. **Project tags** (e.g. "Marketing Systems · Consumer Brands") are the live portfolio pages each project
   appears on. The live site has no individual case studies, so cards link to those pages.
7. Three homepage slideshow projects are not used (Fuku Tea, Sitko Bruno, Sushi Fuku) — see the audit.
8. **Transitional copy added this round:** the hero's "Selected work" scroll cue and the hidden gallery
   summary; project captions use the documented project names.
10. **Transitional copy added this round:** "Services", "Full service range", "View by Category",
    "Select a story", "Next:", "Client Testimonials", "Show {service}", "Previous/Next service",
    "Service NN of 08", "Pictured: …". None of these make a business claim.
11. **Sticky track length.** The services section holds a card in a sticky viewport for ~4 screens of
    scrolling. A full-page screenshot therefore shows blank space below the first card — that is expected
    for sticky scroll, and the card remains visible throughout. It is not broken layout.
12. **Service labels from graphics.** Names such as "UX/UI Strategy & Site Architecture" were read from
    the official capability PNGs (they are not text on the live site). They should be checked against the
    client's canonical service list before launch. The 17 "Full service range" names come from a
    commented-out block in the live homepage source, not from visible page content — flagged for review.
13. **Client-side rendering + font inlining**: unchanged from earlier rounds; see §8 items 1 and 3.

9. **Mobile hero length.** With the gallery beneath the CTAs, the hero is ~1.25 viewports tall at 390px by
   design (the columns need room to read). It is not a single screen on phones.

## 9. Regenerating assets and content

```bash
bash scripts/fetch-sources.sh                        # official sources → ./research
npm i --no-save sharp && node scripts/process-assets.mjs   # crops + WebP → public/images
node scripts/generate-content.mjs                    # logo, 26 testimonials, identity manifest → src/content/generated

# QA (needs a running preview on :4173)
npm i --no-save playwright-core && npx playwright install chromium
node scripts/qa/screenshots.mjs 1920,1440,1280,1024,768,390,375,320
node scripts/qa/interactions.mjs
```

Testimonials, attributions and the logo are generated from the live HTML/SVG, so they are never retyped.
