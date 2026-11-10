// QA for the hero redesign, overlay navbar and merged strategy section.
// Start a preview on :4173, then: node scripts/qa/hero-nav.mjs
// Requires playwright-core + its Chromium (see README).
import { chromium } from "playwright-core";
import fs from "fs";

fs.mkdirSync("qa-output", { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ["--no-sandbox"] });
const URL = process.env.QA_URL || "http://localhost:4173/";
const log = (k, v) => console.log(k.padEnd(38), typeof v === "string" ? v : JSON.stringify(v));

const shoot = async (page, width, motion) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("requestfailed", (r) => errors.push("REQFAILED " + r.url()));
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 500) {
    await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(motion ? 1800 : 300);
  const metrics = await page.evaluate(() => {
    const hero = document.querySelector(".hero").getBoundingClientRect();
    const copy = document.querySelector(".hero__copy").getBoundingClientRect();
    const gallery = document.querySelector(".hero__gallery").getBoundingClientRect();
    return {
      viewport: [document.documentElement.clientWidth, document.documentElement.clientHeight],
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      heroHeight: Math.round(hero.height),
      heroTop: Math.round(hero.top),
      heroFitsViewport: Math.abs(hero.height - window.innerHeight) < 2,
      copyAboveGallery: copy.bottom <= gallery.top + 1,
      copyRightOfGallery: copy.right <= gallery.left + 1,
      gallery: [Math.round(gallery.width), Math.round(gallery.height)],
      broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
      unrevealed: document.querySelectorAll("[data-reveal]:not([data-in])").length,
      errors: 0,
      strategy: !!document.querySelector("#strategy"),
      industries: !!document.querySelector("#industries"),
      founder: !!document.querySelector("#about"),
      testimonials: !!document.querySelector("#testimonials"),
      cta: !!document.querySelector("#contact-us"),
      sections: [...document.querySelectorAll("main > section")].map((s) => s.id || s.className.split(" ")[0]),
    };
  });
  metrics.errors = errors.length;
  log(`metrics ${width}${motion ? " (motion)" : ""}`, metrics);
  if (errors.length) log("errors", errors.slice(0, 4));
  await page.screenshot({ path: `qa-output/hero-${width}${motion ? "-motion" : ""}.png` });
  await page.screenshot({ path: `qa-output/full-${width}${motion ? "-motion" : ""}.png`, fullPage: true });
  return errors;
};

// ---- Desktop: layout + navbar behaviour --------------------------------
let ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
let page = await ctx.newPage();
await shoot(page, 1440, true);

const headerState = () =>
  page.evaluate(() => {
    const h = document.querySelector(".site-header");
    const cs = getComputedStyle(h);
    const logo = getComputedStyle(document.querySelector(".site-header__logo"));
    const link = getComputedStyle(document.querySelector(".site-nav__link"));
    return {
      overlay: h.hasAttribute("data-overlay"),
      bg: cs.backgroundColor,
      border: cs.borderBottomColor,
      shadow: cs.boxShadow === "none" ? "none" : "present",
      logo: logo.color,
      link: link.color,
      headerH: Math.round(h.getBoundingClientRect().height),
      docH: document.documentElement.scrollHeight,
      y: Math.round(window.scrollY),
    };
  });
log("nav @ top", await headerState());
await page.evaluate(() => window.scrollTo({ top: 1200, behavior: "instant" }));
await page.waitForTimeout(700);
log("nav @ 1200px", await headerState());
await page.screenshot({ path: "qa-output/nav-solid-1440.png", clip: { x: 0, y: 0, width: 1440, height: 260 } });
log("layout shift on sticky", await page.evaluate(() => {
  window.scrollTo({ top: 0, behavior: "instant" });
  return new Promise((r) => setTimeout(() => r(document.documentElement.scrollHeight), 600));
}));
await page.waitForTimeout(600);
log("nav @ top again", await headerState());
await page.screenshot({ path: "qa-output/nav-overlay-1440.png", clip: { x: 0, y: 0, width: 1440, height: 260 } });

// Marquee behaviour
const marquee = () =>
  page.evaluate(() => {
    const tracks = [...document.querySelectorAll(".hero-marquee__track")];
    const matrix = (el) => getComputedStyle(el).transform;
    const groups = [...document.querySelectorAll(".hero-marquee__group")].map((g) => Math.round(g.getBoundingClientRect().height));
    return {
      tracks: tracks.length,
      names: tracks.map((t) => getComputedStyle(t).animationName),
      durations: tracks.map((t) => getComputedStyle(t).animationDuration),
      transforms: tracks.map(matrix),
      groups,
      seamless: groups.length === 4 && groups[0] === groups[1] && groups[2] === groups[3],
      hiddenDuplicates: document.querySelectorAll('.hero-marquee__group[aria-hidden="true"]').length,
      galleryOverflow: getComputedStyle(document.querySelector(".hero__gallery")).overflow,
    };
  });
const m1 = await marquee();
await page.waitForTimeout(1500);
const m2 = await marquee();
log("marquee", m1);
log("marquee moving after 1.5s", [m1.transforms[0] !== m2.transforms[0], m1.transforms[1] !== m2.transforms[1]]);
const box = await page.locator(".hero__gallery").boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.waitForTimeout(400);
log("hover pauses columns", await page.evaluate(() => [...document.querySelectorAll(".hero-marquee__track")].map((t) => getComputedStyle(t).animationPlayState)));
await ctx.close();

// ---- Reduced motion ----------------------------------------------------
ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
log("reduced motion marquee", await page.evaluate(() => [...document.querySelectorAll(".hero-marquee__track")].map((t) => getComputedStyle(t).animationName)));
await page.screenshot({ path: "qa-output/hero-1440-reduced.png" });
await ctx.close();

// ---- Required widths ---------------------------------------------------
for (const [w, h] of [[768, 1024], [390, 844]]) {
  ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "no-preference", isMobile: w < 700, hasTouch: w < 700, deviceScaleFactor: 1 });
  page = await ctx.newPage();
  await shoot(page, w, true);
  if (w === 390) {
    // mobile menu still works over the transparent hero
    await page.click(".site-header .menu-toggle");
    await page.waitForTimeout(800);
    log("mobile menu open/site inert", await page.evaluate(() => [!!document.querySelector(".mobile-menu[data-open]"), document.querySelector("#site").inert]));
    await page.screenshot({ path: "qa-output/menu-390.png" });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    log("mobile menu escaped", await page.evaluate(() => !document.querySelector(".mobile-menu[data-open]")));
  }
  await ctx.close();
}
await browser.close();
