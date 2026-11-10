// Asset pipeline: converts the original Blue Tomato source images (downloaded
// into research/ by scripts/fetch-sources.sh) into optimised, sensibly named
// WebP files in public/images.
// Run from project root:
//   npm i --no-save sharp && node scripts/process-assets.mjs
import fs from "fs";
import sharp from "sharp";

const O = "research/orig/";
const out = "public/images/";
const manifest = [];
for (const dir of ["work", "work/cards", "about", "brand", "logos/mono"]) fs.mkdirSync(out + dir, { recursive: true });

async function wide(src, name, widths = [1440, 720]) {
  for (const w of widths) {
    const file = `${out}work/${name}-${w}.webp`;
    const info = await sharp(O + src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(file);
    manifest.push({ file, w: info.width, h: info.height, kb: Math.round(info.size / 1024), src });
  }
}
async function crop(src, name, box, dir = "work", q = 82, resize) {
  const file = `${out}${dir}/${name}.webp`;
  let p = sharp(src.startsWith("research") ? src : O + src).extract(box);
  if (resize) p = p.resize(resize);
  const info = await p.webp({ quality: q }).toFile(file);
  manifest.push({ file, w: info.width, h: info.height, kb: Math.round(info.size / 1024), src });
}

// ---- Project imagery (homepage slides, originals 1920x812 / 1600x677) ----
await wide("audi-sewickley-3-blue-tomato-pittsburgh-69f3a97187829.png", "audi-sewickley", [1920, 960]);
await wide("vallozzi-blue-tomato-pittsburgh.png", "vallozzi", [1920, 960]);
await wide("untitled-2la-gourmandine-blue-tomato-pittsburgh.png", "la-gourmandine");
await wide("good-n-grapey-3-blue-tomato-pittsburgh-copy.png", "good-n-grapey");
await wide("atarashi-blue-tomato-pittsburgh-r.png", "atarashi");
await wide("ifft-palmer-blue-tomato-pittsburgh.png", "ifft-palmer");
await wide("susan-koeppen-2-blue-tomato-pittsburgh-mobile.png", "susan-koeppen");
await wide("arno-usa-blue-tomato-pittsburgh.png", "arno-usa");
await wide("olistico-blue-tomato-pittsburgh-69f3af284b24c.png", "olistico");
await wide("restately-blue-tomato-pittsburgh.png", "restately");

// Art-directed crops
const P = "porsche-sewickley-2-blue-tomato-pittsburgh-69f3a7f6ea2e5.png";
await crop(P, "porsche-sewickley-911", { left: 760, top: 0, width: 650, height: 812 });
await crop(P, "porsche-sewickley-wheel", { left: 1340, top: 0, width: 580, height: 725 });
await crop("a-519-chocolates-blue-tomato-pittsburgh.png", "a519-chocolate", { left: 150, top: 0, width: 650, height: 812 });
await crop("mr-mister-3-pgh-blue-tomato-pittsburgh-69f3ab7d91048.png", "mr-mister", { left: 702, top: 0, width: 1218, height: 812 });

// ---- Carousel cards: 3:4 portrait crops of a single panel from each slide ----
// Left offset chosen per artwork so each card shows one coherent image or
// lockup. Atarashi, La Gourmandine, Susan Koeppen and Sitko Bruno were
// evaluated and left out: every 3:4 window cuts through their headline type.
const CARDS = [
  ["porsche-sewickley-2-blue-tomato-pittsburgh-69f3a7f6ea2e5.png", "porsche-sewickley", 680],
  ["audi-sewickley-3-blue-tomato-pittsburgh-69f3a97187829.png", "audi-sewickley", 1311],
  ["a-519-chocolates-blue-tomato-pittsburgh.png", "a519-chocolate", 120],
  ["mr-mister-3-pgh-blue-tomato-pittsburgh-69f3ab7d91048.png", "mr-mister", 1311],
  ["vallozzi-blue-tomato-pittsburgh.png", "vallozzi", 655],
  ["good-n-grapey-3-blue-tomato-pittsburgh-copy.png", "good-n-grapey", 160],
  ["arno-usa-blue-tomato-pittsburgh.png", "arno-usa", 1150],
  ["olistico-blue-tomato-pittsburgh-69f3af284b24c.png", "olistico", 760],
  ["restately-blue-tomato-pittsburgh.png", "restately", 900],
  ["ifft-palmer-blue-tomato-pittsburgh.png", "ifft-palmer", 1311],
  ["fuku-tea-blue-tomato-pittsburgh-mobile-bowl.png", "fuku-tea", 860],
];
fs.mkdirSync(out + "work/cards", { recursive: true });
for (const [src, name, left] of CARDS) {
  const meta = await sharp(O + src).metadata();
  const h = meta.height;
  const w = Math.round((h * 3) / 4);
  const l = Math.min(Math.max(0, left), meta.width - w);
  const file = `${out}work/cards/${name}.webp`;
  const info = await sharp(O + src).extract({ left: l, top: 0, width: w, height: h })
    .resize({ width: 560, withoutEnlargement: true }).webp({ quality: 80 }).toFile(file);
  manifest.push({ file, w: info.width, h: info.height, kb: Math.round(info.size / 1024), src });
}

// ---- Founder portrait (original 1600x648) ----
const fullFounderFile = out + "about/kim-collins-founder-full.webp";
const fullFounder = await sharp("research/raw/misc/kim.jpg").webp({ quality: 84 }).toFile(fullFounderFile);
manifest.push({ file: fullFounderFile, w: fullFounder.width, h: fullFounder.height, kb: Math.round(fullFounder.size / 1024), src: "research/raw/misc/kim.jpg" });
await crop("research/raw/misc/kim.jpg", "kim-collins-founder-ceo", { left: 470, top: 0, width: 1130, height: 648 }, "about", 84);
await crop("research/raw/misc/kim.jpg", "kim-collins-founder-ceo-portrait", { left: 790, top: 0, width: 810, height: 648 }, "about", 84);

// ---- Identity work (logo portfolio tiles, 800x800) ----
const logos = {
  "virtualmgr": "virtual-mgr", "clward": "clward", "neurointerventions": "neuro", "geonetix": "geonetix",
  "m3-creative-media": "m3", "flat-iron-energy-partners": "flat", "pro-flo": "pro-flo", "esquire-legal-services": "esquire",
  "curis": "curis", "spiralgen": "spiralgen", "head-right": "head", "vista-energy-resources": "vista",
  "brighton-resources": "brighton", "carmell-therapeutics": "carmell", "wpts-radio": "wpts", "firstinsight": "first",
};
const MONO = ["virtualmgr", "clward", "neurointerventions", "geonetix", "m3-creative-media", "flat-iron-energy-partners", "pro-flo", "esquire-legal-services"];
fs.mkdirSync(out + "logos/mono", { recursive: true });
const all = fs.readdirSync("research/raw/logos");
for (const [name, key] of Object.entries(logos)) {
  const f = all.find((x) => x.toLowerCase().includes(key));
  if (!f) { console.log("MISSING LOGO", name); continue; }
  const file = `${out}logos/${name}.webp`;
  // push near-white tile backgrounds to pure white, trim the padding, keep colour
  const trimmed = await sharp("research/raw/logos/" + f).flatten({ background: "#fff" }).linear(1.07, 0).trim({ threshold: 14 }).toBuffer();
  const info = await sharp(trimmed).resize({ width: 520, height: 300, fit: "inside", withoutEnlargement: true }).webp({ quality: 90 }).toFile(file);
  manifest.push({ file, w: info.width, h: info.height, kb: Math.round(info.size / 1024), src: f });

  // Single-ink version for the credibility strip: luminance becomes alpha on
  // a navy fill, so every mark reads at a consistent weight on any background.
  if (MONO.includes(name)) {
    const { data, info: g } = await sharp(trimmed)
      .resize({ width: 520, height: 300, fit: "inside", withoutEnlargement: true })
      .greyscale().raw().toBuffer({ resolveWithObject: true });
    const px = g.width * g.height;
    const rgba = Buffer.alloc(px * 4);
    for (let i = 0; i < px; i++) {
      const lum = data[i * g.channels];
      const t = Math.max(0, (255 - lum - 10) / 245);
      rgba[i * 4] = 7; rgba[i * 4 + 1] = 26; rgba[i * 4 + 2] = 43;
      rgba[i * 4 + 3] = Math.round(255 * Math.min(1, Math.sqrt(t) * 1.08));
    }
    const monoFile = `${out}logos/mono/${name}.webp`;
    const m = await sharp(rgba, { raw: { width: g.width, height: g.height, channels: 4 } }).webp({ quality: 90, alphaQuality: 95 }).toFile(monoFile);
    manifest.push({ file: monoFile, w: m.width, h: m.height, kb: Math.round(m.size / 1024), src: f });
  }
}

// ---- Brand files kept as supplied ----
fs.copyFileSync("research/raw/misc/og.png", out + "brand/open-graph.png");
fs.copyFileSync("research/raw/misc/favicon.ico", "public/favicon.ico");
fs.copyFileSync("research/logo.svg", out + "brand/blue-tomato-logo.svg");

fs.writeFileSync("research/manifest.json", JSON.stringify(manifest, null, 1));
console.log(manifest.map((m) => `${m.file.replace(out, "")} ${m.w}x${m.h} ${m.kb}KB`).join("\n"));
console.log("TOTAL KB", manifest.reduce((a, m) => a + m.kb, 0));
