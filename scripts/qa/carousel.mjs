// QA for the 3D cylindrical portfolio carousel (#work).
// Start a preview on :4173, then: node scripts/qa/carousel.mjs
import { chromium } from "playwright-core";
import fs from "fs";

fs.mkdirSync("qa-output", { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ["--no-sandbox"] });
const URL = process.env.QA_URL || "http://localhost:4173/";
const log = (k, v) => console.log(k.padEnd(34), typeof v === "string" ? v : JSON.stringify(v));
const rotOf = (page) =>
  page.evaluate(() => {
    const t = getComputedStyle(document.querySelector(".cyl__ring")).transform;
    // read rotateY back from the inline style for precision
    const m = document.querySelector(".cyl__ring").style.transform.match(/rotateY\(([-\d.e]+)deg\)/);
    return m ? +(+m[1]).toFixed(2) : t;
  });
const activeOf = (page) => page.evaluate(() => [...document.querySelectorAll(".cyl__card")].findIndex((c) => c.classList.contains("is-active")));
const toWork = async (page) => {
  await page.evaluate(() => {
    const el = document.querySelector(".cyl__viewport");
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140, behavior: "instant" });
  });
  await page.waitForTimeout(1600);
};

for (const [w, h] of [[1440, 900], [768, 1024], [390, 844]]) {
  const mobile = w < 700;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "no-preference", isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("requestfailed", (r) => errors.push("REQFAILED " + r.url()));
  await page.goto(URL, { waitUntil: "networkidle" });
  await toWork(page);

  const geo = await page.evaluate(() => {
    const vp = document.querySelector(".cyl__viewport").getBoundingClientRect();
    const cards = [...document.querySelectorAll(".cyl__card")];
    const visible = cards.filter((c) => parseFloat(getComputedStyle(c).getPropertyValue('--front-opacity')) > 0.5).map((c) => {
      const r = c.querySelector(".cyl__media").getBoundingClientRect();
      return { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom), w: Math.round(r.width) };
    });
    const front = cards.find((c) => c.classList.contains("is-active")).querySelector(".cyl__media").getBoundingClientRect();
    const imgs = [...document.querySelectorAll(".cyl__media img")];
    return {
      cards: cards.length,
      cardW: getComputedStyle(document.querySelector(".cyl__viewport")).getPropertyValue("--cyl-card-w").trim(),
      perspective: getComputedStyle(document.querySelector(".cyl__stage")).perspective,
      frontW: Math.round(front.width),
      frontInsideVertically: front.top >= vp.top && front.bottom <= vp.bottom,
      visibleCount: visible.length,
      vpHeight: Math.round(vp.height),
      clippedVertically: visible.filter((c) => c.t < vp.top - 1 || c.b > vp.bottom + 1).length,
      pageOverflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      imgsLoaded: imgs.filter((i) => i.complete && i.naturalWidth > 0).length + "/" + imgs.length,
      opacities: cards.map((c) => parseFloat(getComputedStyle(c).getPropertyValue("--front-opacity")).toFixed(2)).join(" "),
    };
  });
  log(`geometry ${w}`, geo);

  // continuous drift (left → rotateY decreasing)
  const r1 = await rotOf(page);
  await page.waitForTimeout(1500);
  const r2 = await rotOf(page);
  log(`drift ${w} (deg over 1.5s)`, { from: r1, to: r2, movingLeft: r2 < r1 });
  await page.screenshot({ path: `qa-output/carousel-${w}.png`, clip: { x: 0, y: 0, width: w, height: h } });

  if (!mobile) {
    // hover pause
    const box = await page.locator(".cyl__viewport").boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(1200);
    const h1 = await rotOf(page);
    await page.waitForTimeout(800);
    const h2 = await rotOf(page);
    log(`hover pause ${w}`, { delta: +(h2 - h1).toFixed(3), paused: Math.abs(h2 - h1) < 0.05 });

    // drag with momentum then snap
    const a0 = await activeOf(page);
    const before = await rotOf(page);
    const cx = box.x + box.width / 2, cy = box.y + box.height * 0.45;
    await page.mouse.move(cx + 200, cy);
    await page.mouse.down();
    for (let i = 1; i <= 10; i++) { await page.mouse.move(cx + 200 - i * 40, cy); await page.waitForTimeout(12); }
    await page.mouse.up();
    const afterRelease = await rotOf(page);
    await page.waitForTimeout(1500);
    const settled = await rotOf(page);
    const step = 360 / geo.cards;
    log(`drag+momentum+snap ${w}`, {
      before, afterRelease, settled,
      coastedBeyondRelease: Math.abs(settled - before) > Math.abs(afterRelease - before),
      snappedToCard: Math.abs(settled / step - Math.round(settled / step)) < 0.01,
      activeBefore: a0, activeAfter: await activeOf(page),
    });

    // click side card focuses it (no navigation)
    await page.mouse.move(10, 10);
    const pagesBefore = ctx.pages().length;
    const target = await page.evaluate(() => {
      const cards = [...document.querySelectorAll(".cyl__card")];
      const a = cards.findIndex((c) => c.classList.contains("is-active"));
      return (a + 1) % cards.length;
    });
    const tb = await page.locator(".cyl__card").nth(target).locator(".cyl__media").boundingBox();
    await page.mouse.click(tb.x + tb.width / 2, tb.y + tb.height / 2);
    await page.waitForTimeout(1300);
    log(`click side card ${w}`, { target, active: await activeOf(page), focused: (await activeOf(page)) === target, newTabsOpened: ctx.pages().length - pagesBefore });

    // keyboard
    await page.focus('.cyl__controls button[aria-label="Next project"]');
    const k0 = await activeOf(page);
    await page.locator(".cyl__card.is-active a").focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(1100);
    const k1 = await activeOf(page);
    await page.keyboard.press("Tab");
    await page.waitForTimeout(1100);
    const k2 = await activeOf(page);
    log(`keyboard ${w}`, { start: k0, arrowRight: k1, tabNext: k2, liveText: await page.textContent(".cyl__now-name") });

    // buttons
    await page.click('button[aria-label="Previous project"]');
    await page.waitForTimeout(1100);
    log(`prev button ${w}`, { active: await activeOf(page) });

    // offscreen: loop stops
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await page.waitForTimeout(600);
    const o1 = await rotOf(page);
    await page.waitForTimeout(1500);
    const o2 = await rotOf(page);
    log(`offscreen paused ${w}`, { delta: +(o2 - o1).toFixed(3), stopped: o1 === o2 });
  } else {
    // touch swipe horizontally rotates; vertical swipe scrolls the page
    const box = await page.locator(".cyl__viewport").boundingBox();
    const before = await rotOf(page);
    const cdp = await ctx.newCDPSession(page);
    const swipe = async (x0, y0, x1, y1) => {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x0, y: y0 }] });
      for (let i = 1; i <= 8; i++) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x0 + ((x1 - x0) * i) / 8, y: y0 + ((y1 - y0) * i) / 8 }] });
        await page.waitForTimeout(16);
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    };
    await swipe(box.x + box.width * 0.75, box.y + box.height * 0.4, box.x + box.width * 0.2, box.y + box.height * 0.42);
    await page.waitForTimeout(1500);
    const after = await rotOf(page);
    const step = 360 / geo.cards;
    log(`touch swipe ${w}`, { before, after, rotated: Math.abs(after - before) > 5, snapped: Math.abs(after / step - Math.round(after / step)) < 0.01 });
    const y0 = await page.evaluate(() => window.scrollY);
    await swipe(box.x + box.width * 0.5, box.y + box.height * 0.7, box.x + box.width * 0.52, box.y + box.height * 0.1);
    await page.waitForTimeout(800);
    log(`vertical swipe scrolls page ${w}`, { scrolledBy: (await page.evaluate(() => window.scrollY)) - y0 });
  }
  log(`errors ${w}`, errors);
  await ctx.close();
}

// reduced motion: no drift, no intro hide
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await toWork(page);
const a = await rotOf(page);
await page.waitForTimeout(1500);
const b = await rotOf(page);
log("reduced motion", { drift: +(b - a).toFixed(3), static: a === b, introOpacity: await page.evaluate(() => getComputedStyle(document.querySelector(".cyl__inner")).opacity) });
await page.screenshot({ path: "qa-output/carousel-1440-reduced.png" });
await ctx.close();
await browser.close();
