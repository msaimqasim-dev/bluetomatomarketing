// Focused QA: image-only Services choreography and non-scrolling founder card.
// npm run build && npm run preview -- --port 4173
// node scripts/qa/services-founder.mjs (Playwright Chromium required)
import { chromium } from "playwright-core";
import fs from "fs";

fs.mkdirSync("qa-output", { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--no-sandbox"],
});
const URL = process.env.QA_URL || "http://localhost:4173/";
const failures = [];
const results = [];
const check = (name, pass, data = {}) => {
  const result = { name, pass, ...data };
  results.push(result);
  if (!pass) failures.push(result);
  console.log(`${pass ? "PASS" : "FAIL"} ${name} ${JSON.stringify(data)}`);
};

async function goToService(page, position) {
  await page.evaluate((p) => {
    const track = document.querySelector(".svc__track");
    const sticky = document.querySelector(".svc__sticky");
    const top = track.getBoundingClientRect().top + scrollY;
    const offset = parseFloat(getComputedStyle(sticky).top);
    const travel = track.offsetHeight - sticky.offsetHeight;
    window.scrollTo({ top: top - offset + Math.min(1, p / 7) * travel, behavior: "instant" });
  }, position);
  await page.waitForTimeout(350);
}

for (const [width, height] of [[1920, 714], [1440, 900], [1280, 720], [1024, 768], [768, 1024], [390, 844], [320, 670]]) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "no-preference", isMobile: width < 700, hasTouch: width < 700 });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  for (const step of [0, 1, 2, 3, 4, 5, 6, 7]) {
    await goToService(page, step + (step === 7 ? 0 : 0.12));
    const m = await page.evaluate(() => {
      const rect = (s) => {
        const r = document.querySelector(s).getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height, right: r.right, bottom: r.bottom };
      };
      const focus = rect(".svc__focus-slot");
      const scene = rect(".svc__scene");
      const desc = rect('.svc__copy:not([aria-hidden="true"])');
      const active = document.querySelector('.svc__copy:not([aria-hidden="true"])');
      const overlap = Math.max(0, Math.min(desc.right, focus.right) - Math.max(desc.x, focus.x)) *
        Math.max(0, Math.min(desc.bottom, focus.bottom) - Math.max(desc.y, focus.y));
      const images = [...document.querySelectorAll(".svc__visual")].filter((el) => getComputedStyle(el).visibility !== "hidden" && Number(el.style.opacity) > 0.1);
      const focusImage = images.find((el) => Math.abs(el.getBoundingClientRect().width - focus.w) < 2);
      const summary = active.querySelector(".svc__summary").textContent;
      return {
        number: active.querySelector(".svc__number").textContent.trim(),
        visibleImages: images.length,
        focusMatchesImage: !!focusImage,
        noCopyOverlap: overlap < 1,
        copyFits: desc.x >= scene.x - 1 && desc.right <= scene.right + 1 && desc.y >= scene.y - 1 && desc.bottom <= scene.bottom + 1,
        focusFits: focus.y >= scene.y - 1 && focus.bottom <= scene.bottom + 1 && focus.w >= 70 && focus.h >= 100,
        summaryWords: summary.trim().split(/\s+/).length,
        scene: [Math.round(scene.w), Math.round(scene.h)],
        focus: [Math.round(focus.w), Math.round(focus.h)],
        copyScroll: active.scrollHeight > active.clientHeight + 1,
        overflowX: document.documentElement.scrollWidth > innerWidth,
      };
    });
    const expected = step === 0 || step === 7 ? 2 : 3;
    check(`services ${width}x${height} step ${step + 1}`, m.visibleImages === expected && m.focusMatchesImage && m.noCopyOverlap && m.copyFits && m.focusFits && m.summaryWords <= 25 && !m.copyScroll && !m.overflowX, m);
    if (step === 1) await page.screenshot({ path: `qa-output/services-${width}x${height}.png` });
  }

  // An in-between frame must grow the next image without stretching the text.
  await goToService(page, 1.72);
  const transition = await page.evaluate(() => {
    const visible = [...document.querySelectorAll(".svc__visual")].filter((e) => getComputedStyle(e).visibility !== "hidden");
    return visible.map((e) => ({ width: Math.round(e.getBoundingClientRect().width), height: Math.round(e.getBoundingClientRect().height) }));
  });
  check(`transition ${width}`, transition.length >= 3, { images: transition });
  if (width === 1440) await page.screenshot({ path: "qa-output/services-transition.png" });

  // Buttons / preview thumbnails, including reverse scroll.
  await goToService(page, 1.12);
  await page.locator(".svc__thumbnail--next").click();
  await page.waitForTimeout(1200);
  const afterNext = await page.locator('.svc__copy:not([aria-hidden="true"]) .svc__number').textContent();
  check(`next preview ${width}`, afterNext.includes("03"), { number: afterNext });
  await page.locator('.svc__controls button[aria-label="Previous service"]').click();
  await page.waitForTimeout(1200);
  const afterPrev = await page.locator('.svc__copy:not([aria-hidden="true"]) .svc__number').textContent();
  check(`reverse ${width}`, afterPrev.includes("02"), { number: afterPrev });

  await page.locator('.svc__controls button[aria-label="Next service"]').focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(1200);
  const afterKey = await page.locator('.svc__copy:not([aria-hidden="true"]) .svc__number').textContent();
  check(`keyboard ${width}`, afterKey.includes("03"), { number: afterKey });

  if (width === 390) {
    const cdp = await context.newCDPSession(page);
    const image = await page.locator(".svc__focus-slot").boundingBox();
    const beforeY = await page.evaluate(() => scrollY);
    const x = image.x + image.width / 2;
    const y = Math.min(image.y + image.height * 0.85, height - 90);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    for (let i = 1; i <= 8; i++) {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - i * 25 }] });
      await page.waitForTimeout(20);
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.waitForTimeout(350);
    const moved = await page.evaluate((y) => scrollY - y, beforeY);
    check("native mobile page scrolling", moved > 50, { moved });
  }

  // Catalogue retains all longer copy and the complete service lists.
  await page.locator(".svc__directory summary").click();
  check(`directory ${width}`, await page.locator(".svc__directory[open] .svc__directory-item").count() === 8 && await page.locator(".svc__directory-item li").count() === 42, {
    items: await page.locator(".svc__directory-item").count(),
    services: await page.locator(".svc__directory-item li").count(),
  });
  await page.locator(".svc__directory summary").click();

  await page.evaluate(() => {
    const stage = document.querySelector(".about__stage");
    window.scrollTo({ top: stage.getBoundingClientRect().top + scrollY - 85, behavior: "instant" });
  });
  await page.waitForTimeout(1100);
  const founder = await page.evaluate(() => {
    const glass = document.querySelector(".about__glass");
    const stage = document.querySelector(".about__stage");
    const card = glass.getBoundingClientRect();
    const bounds = stage.getBoundingClientRect();
    const link = glass.querySelector("a").getBoundingClientRect();
    const image = stage.querySelector("img");
    return {
      overflowY: getComputedStyle(glass).overflowY,
      extraHeight: glass.scrollHeight - glass.clientHeight,
      contentVisible: link.bottom <= card.bottom + 1,
      insideStage: card.top >= bounds.top - 1 && card.bottom <= bounds.bottom + 1,
      fullBleed: Math.abs(bounds.width - innerWidth) < 1,
      imageLoaded: image.complete && image.naturalWidth > 0,
      cardHeight: Math.round(card.height),
      stageHeight: Math.round(bounds.height),
      leadFont: getComputedStyle(glass.querySelector(".about__lead")).fontSize,
    };
  });
  check(`founder ${width}x${height}`, founder.overflowY === "visible" && founder.extraHeight <= 1 && founder.contentVisible && founder.insideStage && founder.fullBleed && founder.imageLoaded, founder);
  await page.screenshot({ path: `qa-output/founder-${width}x${height}.png` });
  check(`console ${width}`, errors.length === 0, { errors });
  await context.close();
}

for (const options of [
  { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" },
  { viewport: { width: 390, height: 568 }, reducedMotion: "no-preference" },
]) {
  const ctx = await browser.newContext(options);
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  check(`static fallback ${options.viewport.width}x${options.viewport.height} ${options.reducedMotion}`, await page.locator(".svc__static-item").count() === 8 && await page.locator(".svc__track").count() === 0);
  await page.evaluate(() => document.querySelector(".about__stage").scrollIntoView({ behavior: "instant" }));
  await page.waitForTimeout(1200);
  const cardFit = await page.evaluate(() => {
    const el = document.querySelector(".about__glass");
    const stage = document.querySelector(".about__stage");
    return getComputedStyle(el).overflowY === "visible" && el.scrollHeight <= el.clientHeight + 1 &&
      el.getBoundingClientRect().bottom <= stage.getBoundingClientRect().bottom + 1;
  });
  check(`founder fit in static layout ${options.viewport.width}x${options.viewport.height}`, cardFit);
  await ctx.close();
}

await browser.close();
fs.writeFileSync("qa-output/services-founder-results.json", JSON.stringify(results, null, 2));
console.log(`\n${results.length - failures.length}/${results.length} passed`);
if (failures.length) process.exitCode = 1;