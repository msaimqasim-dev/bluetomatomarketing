// Verifies every image referenced by the built page exists locally, and lists
// the official source for anything that would need the onError fallback.
// Run after: npm run build    →    node scripts/qa/check-assets.mjs
import fs from "fs";
import path from "path";

const html = fs.readFileSync("dist/index.html", "utf8");
const refs = [...new Set([...html.matchAll(/images\/[a-z0-9/_-]+\.(?:webp|png|svg)/g)].map((m) => m[0]))];
const missing = refs.filter((ref) => !fs.existsSync(path.join("dist", ref)));
const publicFiles = [];
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
  const f = path.join(dir, e.name);
  e.isDirectory() ? walk(f) : publicFiles.push(f);
});
if (fs.existsSync("public/images")) walk("public/images");
const totalKB = publicFiles.reduce((sum, f) => sum + fs.statSync(f).size, 0) / 1024;
console.log(`referenced: ${refs.length} | missing in dist: ${missing.length} | public images: ${publicFiles.length} (${Math.round(totalKB)} KB)`);
if (missing.length) {
  console.log("MISSING:\n" + missing.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All referenced images are present locally.");
}
