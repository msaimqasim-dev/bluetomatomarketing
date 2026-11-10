// QA: full-page screenshots + layout metrics of the built site at given widths.
// 1) npm run build && npx vite preview --port 4173   2) npm i --no-save playwright-core && npx playwright install chromium
// 3) node scripts/qa/screenshots.mjs 1920,1440,1280,1024,768,390,375,320 [--motion]
import { chromium } from "playwright-core";
import fs from "fs";
const widths = (process.argv[2] || "1440").split(",").map(Number);
const motion = process.argv.includes("--motion");
const hArg = process.argv.find((a) => a.startsWith("--height="));
const height = hArg ? Number(hArg.split("=")[1]) : 900;
// Uses Playwright's Chromium by default (npx playwright install chromium); set CHROME_PATH to use another binary.
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ["--no-sandbox"] });
fs.mkdirSync("qa-output", { recursive: true });
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 700 ? 780 : height }, deviceScaleFactor: 1, reducedMotion: motion ? "no-preference" : "reduce" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message));
  page.on("requestfailed", (r) => errors.push("REQFAILED " + r.url()));
  await page.goto((process.env.QA_URL || "http://localhost:4173/"), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // scroll through the page so lazy images load and reveals fire
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 500) { await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y); await page.waitForTimeout(motion ? 140 : 40); }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(motion ? 1600 : 300);
  const m = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth, height: document.documentElement.scrollHeight,
    font: getComputedStyle(document.body).fontFamily.slice(0, 30), fontLoaded: document.fonts.check('600 20px "Archivo Variable"'),
    broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && getComputedStyle(i).display !== "none").map((i) => i.currentSrc),
    unrevealed: document.querySelectorAll("[data-reveal]:not([data-in])").length, h1: document.querySelectorAll("h1").length,
    overflowers: [...document.querySelectorAll("#site *")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > document.documentElement.clientWidth + 1 || r.left < -1) && getComputedStyle(e).position !== "absolute" && !e.closest(".hero__visual") && !e.closest(".nav-panel") && !e.closest(".visually-hidden") && !e.closest(".cyl__viewport") && !e.closest(".about__stage") && !e.closest(".svc__sticky"); }).slice(0, 6).map((e) => e.className || e.tagName),
  }));
  console.log(w, JSON.stringify(m), "errors:", JSON.stringify(errors.slice(0, 5)));
  await page.screenshot({ path: `qa-output/full-${w}.png`, fullPage: true });
  await ctx.close();
}
await browser.close();
