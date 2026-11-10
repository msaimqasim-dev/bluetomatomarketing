// QA: scripted interaction + accessibility checks (dropdowns, mobile menu focus trap, carousel, reveals, reduced motion).
// Same setup as screenshots.mjs, then:  node scripts/qa/interactions.mjs
import { chromium } from "playwright-core";
import fs from "fs"; // Uses Playwright's Chromium by default (npx playwright install chromium); set CHROME_PATH to use another binary.
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ["--no-sandbox"] });
const log = (k, v) => console.log(k.padEnd(34), typeof v === "string" ? v : JSON.stringify(v));
const URL = (process.env.QA_URL || "http://localhost:4173/");
const active = (p) => p.evaluate(() => { const e = document.activeElement; return (e?.tagName || "") + "." + (e?.className?.baseVal ?? e?.className ?? "").toString().split(" ")[0] + ":" + (e?.textContent || "").trim().slice(0, 22); });

// ---------- Desktop, motion ON ----------
let ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
let page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(e.message)); page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await page.goto(URL, { waitUntil: "networkidle" }); await page.waitForTimeout(2300);
await page.screenshot({ path: "qa-output/i-hero-1440.png" });
log("hero h1 text", await page.evaluate(() => document.querySelector("h1").textContent.replace(/\s+/g, " ")));
await page.keyboard.press("Tab"); log("1st Tab focus", await active(page));
await page.keyboard.press("Tab"); log("2nd Tab focus", await active(page));
await page.click('button[aria-controls="nav-panel-services"]'); await page.waitForTimeout(700);
log("services expanded", await page.getAttribute('button[aria-controls="nav-panel-services"]', "aria-expanded"));
await page.screenshot({ path: "qa-output/i-nav-services.png", clip: { x: 0, y: 0, width: 1440, height: 420 } });
await page.keyboard.press("Tab"); log("Tab into panel", await active(page));
await page.keyboard.press("Escape"); await page.waitForTimeout(100);
log("after Esc expanded/focus", [await page.getAttribute('button[aria-controls="nav-panel-services"]', "aria-expanded"), await active(page)]);
await page.click('button[aria-controls="nav-panel-industries"]'); await page.waitForTimeout(700);
await page.screenshot({ path: "qa-output/i-nav-industries.png", clip: { x: 0, y: 0, width: 1440, height: 420 } });
await page.mouse.click(700, 760); await page.waitForTimeout(150);
log("outside click closes", await page.getAttribute('button[aria-controls="nav-panel-industries"]', "aria-expanded"));
await page.mouse.move(700, 800); await page.hover('button[aria-controls="nav-panel-services"]'); await page.waitForTimeout(300);
log("hover opens services", await page.getAttribute('button[aria-controls="nav-panel-services"]', "aria-expanded"));
await page.mouse.move(700, 850); await page.waitForTimeout(500);
log("mouse leave closes", await page.getAttribute('button[aria-controls="nav-panel-services"]', "aria-expanded"));
// reveal on scroll
const total = await page.evaluate(() => document.documentElement.scrollHeight);
log("unrevealed before scroll", await page.evaluate(() => document.querySelectorAll("[data-reveal]:not([data-in])").length));
for (let y = 0; y < total; y += 450) { await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y); await page.waitForTimeout(120); }
await page.waitForTimeout(400);
log("unrevealed after scroll", await page.evaluate(() => document.querySelectorAll("[data-reveal]:not([data-in])").length));
log("header overlay off after scroll", await page.evaluate(() => !document.querySelector(".site-header").hasAttribute("data-overlay") && getComputedStyle(document.querySelector(".site-header")).backgroundColor === "rgb(255, 255, 255)"));
// Industries preview is intentionally absent from the homepage (saved for the future page).
log("industries section absent", await page.evaluate(() => !document.querySelector("#industries")));
// testimonials
await page.evaluate(() => document.querySelector("#testimonials").scrollIntoView()); await page.waitForTimeout(400);
await page.click('.tst__controls button[aria-label="Next testimonial"]'); await page.waitForTimeout(900);
log("testimonial slide 2", await page.evaluate(() => document.querySelector(".tst__name").textContent + " | cards=" + document.querySelectorAll(".tst__card").length));
await page.focus('.tst__controls button[aria-label="Next testimonial"]'); await page.keyboard.press("ArrowLeft"); await page.waitForTimeout(400);
log("ArrowLeft → slide", await page.evaluate(() => document.querySelector(".tst__name").textContent));
log("panel inert (closed)", await page.evaluate(() => document.querySelector("#more-testimonials").inert));
await page.click(".testimonials__toggle"); await page.waitForTimeout(1000);
log("expanded: quotes/height/inert", await page.evaluate(() => [document.querySelectorAll(".mini-quote").length, Math.round(document.querySelector("#more-testimonials").getBoundingClientRect().height), document.querySelector("#more-testimonials").inert]));
log("total blockquotes in DOM", await page.evaluate(() => document.querySelectorAll("blockquote").length));
await page.locator("#testimonials").screenshot({ path: "qa-output/i-testimonials.png" });
// links audit
log("links", await page.evaluate(() => { const a = [...document.querySelectorAll("a[href]")]; const ext = a.filter((x) => /^https?:/.test(x.getAttribute("href"))); return { total: a.length, external: ext.length, missingRel: ext.filter((x) => x.target === "_blank" && !/noopener/.test(x.rel)).length, hash: [...new Set(a.map((x) => x.getAttribute("href")).filter((h) => h.startsWith("#")))].map((h) => h + (document.querySelector(h) ? "✓" : "✗")), mailto: [...new Set(a.map((x) => x.getAttribute("href")).filter((h) => /^(mailto|tel):/.test(h)))], hosts: [...new Set(ext.map((x) => new URL(x.href).host))] }; }));
log("headings", await page.evaluate(() => [...document.querySelectorAll("h1,h2,h3")].map((h) => h.tagName[1] + ":" + h.textContent.replace(/\s+/g, " ").trim().slice(0, 26)).join(" | ")));
log("imgs missing alt attr", await page.evaluate(() => [...document.images].filter((i) => !i.hasAttribute("alt")).length));
log("desktop errors", errs);
await ctx.close();

// ---------- Mobile, motion ON ----------
ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, reducedMotion: "no-preference", hasTouch: true, isMobile: true });
page = await ctx.newPage(); const merrs = []; page.on("pageerror", (e) => merrs.push(e.message));
await page.goto(URL, { waitUntil: "networkidle" }); await page.waitForTimeout(2300);
await page.screenshot({ path: "qa-output/i-hero-390.png" });
await page.click(".site-header .menu-toggle"); await page.waitForTimeout(1000);
await page.screenshot({ path: "qa-output/i-menu-390.png" });
log("menu: focus / site inert / lock", [await active(page), await page.evaluate(() => document.querySelector("#site").inert), await page.evaluate(() => document.documentElement.classList.contains("is-locked"))]);
let inside = true; for (let i = 0; i < 14; i++) { await page.keyboard.press("Tab"); inside = inside && (await page.evaluate(() => !!document.activeElement.closest("#mobile-menu"))); }
log("focus trapped (14 tabs)", inside);
await page.click('button[aria-controls="mobile-sub-industries"]'); await page.waitForTimeout(700);
await page.screenshot({ path: "qa-output/i-menu-390-open.png" });
log("accordion links visible", await page.evaluate(() => [...document.querySelectorAll("#mobile-sub-industries a")].filter((a) => getComputedStyle(a).visibility === "visible").length));
await page.keyboard.press("Escape"); await page.waitForTimeout(700);
log("Esc: open? / focus / lock", [await page.evaluate(() => document.querySelector("#mobile-menu").hasAttribute("data-open")), await active(page), await page.evaluate(() => document.documentElement.classList.contains("is-locked"))]);
await page.click(".site-header .menu-toggle"); await page.waitForTimeout(800);
await page.click('#mobile-menu a[href="#work"]'); await page.waitForTimeout(1600);
log("menu link → #work top (px)", await page.evaluate(() => Math.round(document.querySelector("#work").getBoundingClientRect().top)));
log("touch targets < 44px", await page.evaluate(() => [...document.querySelectorAll("#site a, #site button")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 43.5 && getComputedStyle(e).visibility !== "hidden"; }).map((e) => (e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 18) + "=" + Math.round(e.getBoundingClientRect().height)).slice(0, 10)));
log("mobile errors", merrs);
await ctx.close();

// ---------- Reduced motion ----------
ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
page = await ctx.newPage(); await page.goto(URL, { waitUntil: "networkidle" }); await page.waitForTimeout(200);
log("reduced: unrevealed / anim-dur", await page.evaluate(() => [document.querySelectorAll("[data-reveal]:not([data-in])").length, getComputedStyle(document.querySelector(".hero__line > span")).animationDuration, getComputedStyle(document.documentElement).scrollBehavior]));
await ctx.close(); await browser.close();
