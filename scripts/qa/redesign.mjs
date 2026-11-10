// QA for this round: cylinder back row, services scroll stack, founder, testimonials, motion, assets.
import { chromium } from "playwright-core";
import fs from "fs";
fs.mkdirSync("qa-output", { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ["--no-sandbox"] });
const URL = process.env.QA_URL || "http://localhost:4173/";
const log = (k, v) => console.log(k.padEnd(40), typeof v === "string" ? v : JSON.stringify(v));
const errorsOf = (page, arr) => { page.on("pageerror", e => arr.push("JS " + e.message)); page.on("console", m => m.type() === "error" && arr.push(m.text())); page.on("requestfailed", r => arr.push("REQ " + r.url())); };
const scrollThrough = async (page) => {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 450) { await page.evaluate(v => window.scrollTo({ top: v, behavior: "instant" }), y); await page.waitForTimeout(70); }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" })); await page.waitForTimeout(400);
};
const scrollTo = async (page, sel, extra = -100) => {
  await page.evaluate(([s, e]) => { const el = document.querySelector(s); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + e, behavior: "instant" }); }, [sel, extra]);
  await page.waitForTimeout(700);
};

for (const [w, h] of [[1440, 900], [768, 1024], [390, 844]]) {
  const mobile = w < 700;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "no-preference", isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage(); const errors = []; errorsOf(page, errors);
  await page.goto(URL, { waitUntil: "networkidle" });
  await scrollThrough(page);
  const base = await page.evaluate(() => ({
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && !i.closest('[aria-hidden="true"]')).map(i => i.currentSrc || i.src),
    imgs: document.images.length,
    missingAlt: [...document.images].filter(i => !i.hasAttribute("alt")).length,
    h1: document.querySelectorAll("h1").length,
    unrevealed: document.querySelectorAll("[data-reveal]:not([data-in])").length,
    words: document.querySelectorAll('[data-split="words"] .word').length,
    wordsHidden: [...document.querySelectorAll('[data-split="words"] .word > span')].filter(s => getComputedStyle(s).opacity === "0").length,
    progress: getComputedStyle(document.querySelector(".scroll-progress__bar")).transform,
  }));
  log(`base ${w}`, base);

  // Motion while scrolling
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight * 0.5, behavior: "instant" }));
  await page.waitForTimeout(500);
  log(`motion ${w}`, await page.evaluate(() => ({
    progress: getComputedStyle(document.querySelector(".scroll-progress__bar")).transform,
    parallax: document.querySelector("[data-parallax]").style.getPropertyValue("--parallax"),
  })));

  // Carousel: back row visible
  await scrollTo(page, ".cyl__viewport", -120);
  log(`carousel ${w}`, await page.evaluate(() => {
    const cards = [...document.querySelectorAll(".cyl__card")];
    return {
      backVisible: cards.filter(c => parseFloat(getComputedStyle(c).getPropertyValue("--back-opacity")) > 0.1).length,
      frontVisible: cards.filter(c => parseFloat(getComputedStyle(c).getPropertyValue("--front-opacity")) > 0.5).length,
      backImgsLoaded: [...document.querySelectorAll(".cyl__back img")].filter(i => i.complete && i.naturalWidth > 0).length,
      cards: cards.length,
    };
  }));
  await page.screenshot({ path: `qa-output/redesign-carousel-${w}.png` });

  // Services stack: scroll through steps, capture 3 states
  await scrollTo(page, ".svc__track", 10);
  const svcStates = [];
  for (const frac of [0.03, 0.34, 0.68, 0.96]) {
    await page.evaluate((f) => {
      const t = document.querySelector(".svc__track");
      const sticky = t.firstElementChild;
      const travel = t.offsetHeight - sticky.offsetHeight;
      const top = t.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + travel * f, behavior: "instant" });
    }, frac);
    await page.waitForTimeout(350);
    svcStates.push(await page.evaluate(() => {
      const images = [...document.querySelectorAll(".svc__visual")].filter(c => getComputedStyle(c).visibility !== "hidden");
      const copy = document.querySelector('.svc__copy:not([aria-hidden="true"])');
      const r = document.querySelector(".svc__focus-slot").getBoundingClientRect();
      const vp = document.querySelector(".svc__sticky").getBoundingClientRect();
      return {
        label: copy.querySelector(".svc__number").textContent.trim().replace(/\s+/g, " "),
        active: copy.querySelector(".svc__name").textContent,
        visibleImages: images.length,
        mainInsideViewport: !!r && r.top >= vp.top - 2 && r.bottom <= vp.bottom + 2 && r.left >= vp.left - 2 && r.right <= vp.right + 2,
        cardImagesLoaded: [...document.querySelectorAll(".svc__visual img")].filter(i => i.complete && i.naturalWidth > 0).length,
      };
    }));
  }
  log(`services ${w}`, svcStates);
  await page.screenshot({ path: `qa-output/redesign-services-${w}.png` });
  // all service names present
  log(`service names ${w}`, await page.evaluate(() => ({
    services: document.querySelectorAll(".svc__copy").length,
    directoryServices: document.querySelectorAll(".svc__directory-item li").length,
    range: document.querySelectorAll(".svc__range-list li").length,
  })));

  // Founder
  await scrollTo(page, ".about__stage", -80);
  log(`founder ${w}`, await page.evaluate(() => {
    const stage = document.querySelector(".about__stage").getBoundingClientRect();
    const glass = document.querySelector(".about__glass").getBoundingClientRect();
    const img = document.querySelector(".about__image img");
    return {
      stageW: Math.round(stage.width), viewportW: document.documentElement.clientWidth,
      fullBleed: Math.abs(stage.width - document.documentElement.clientWidth) < 2,
      imgLoaded: img.complete && img.naturalWidth > 0,
      glassInside: glass.left >= stage.left - 1 && glass.right <= stage.right + 1 && glass.top >= stage.top - 1,
      glassOnLeft: glass.left < stage.left + stage.width * 0.4,
      creditRight: document.querySelector(".about__credit").getBoundingClientRect().right <= stage.right + 1,
    };
  }));
  await page.screenshot({ path: `qa-output/redesign-founder-${w}.png` });

  // Testimonials: click small card, numbered card, panel
  await scrollTo(page, ".tst", -100);
  const before = await page.textContent(".tst__name");
  await page.locator(".tst__mini").first().click();
  await page.waitForTimeout(800);
  const after = await page.textContent(".tst__name");
  await page.locator(".tst__number").last().click();
  await page.waitForTimeout(500);
  const numbered = await page.textContent(".tst__name");
  await page.locator(".testimonials__toggle").click();
  await page.waitForTimeout(900);
  log(`testimonials ${w}`, {
    before, afterClick: after, changed: before !== after, afterNumber: numbered,
    panelQuotes: await page.locator(".mini-quote").count(),
    mainQuote: await page.locator(".tst__quote").count(),
    panelInert: await page.evaluate(() => document.querySelector("#more-testimonials").inert),
  });
  await page.screenshot({ path: `qa-output/redesign-testimonials-${w}.png` });

  log(`errors ${w}`, errors.slice(0, 5));
  await ctx.close();
}

// Infinite loop (autoplay) + reduced motion static services
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await scrollTo(page, ".tst", -100);
const a = await page.textContent(".tst__name");
await page.waitForTimeout(9600);
const b = await page.textContent(".tst__name");
log("autoplay advanced", { from: a, to: b, changed: a !== b });
await ctx.close();

const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const rp = await rm.newPage();
await rp.goto(URL, { waitUntil: "networkidle" });
log("reduced motion", await rp.evaluate(() => ({
  staticServices: document.querySelectorAll(".svc__static-item").length === 8,
  cardsVisible: [...document.querySelectorAll(".svc__static-item")].every(c => getComputedStyle(c).visibility === "visible"),
  wordsHidden: [...document.querySelectorAll('[data-split="words"] .word > span')].filter(s => getComputedStyle(s).opacity === "0").length,
  cylinderAnim: getComputedStyle(document.querySelector(".cyl__ring")).transform,
})));
await rm.close();
await browser.close();
