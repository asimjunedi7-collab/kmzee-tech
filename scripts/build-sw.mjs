// Runs after `next build`. Writes out/sw.js with a build ID derived from the content
// of every built file, plus the list of URLs to precache.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
const TEMPLATE = path.resolve("scripts/sw.template.js");

if (!fs.existsSync(OUT)) {
  console.error("out/ not found. Run `next build` first.");
  process.exit(1);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(OUT)
  .map((file) => path.relative(OUT, file).split(path.sep).join("/"))
  .filter((file) => file !== "sw.js")
  .sort();

const urls = files
  .map((file) => {
    if (file === "index.html") return "/";
    if (file.endsWith("/index.html")) return `/${file.slice(0, -"index.html".length)}`;
    return `/${file}`;
  })
  .sort();

const hash = crypto.createHash("sha1");
for (const file of files) {
  hash.update(file);
  hash.update(fs.readFileSync(path.join(OUT, file)));
}
const buildId = hash.digest("hex").slice(0, 12);

const template = fs.readFileSync(TEMPLATE, "utf8");
const output = template
  .replace("__BUILD_ID__", () => buildId)
  .replace("__PRECACHE_MANIFEST__", () => JSON.stringify(urls));

fs.writeFileSync(path.join(OUT, "sw.js"), output);
console.log(`sw.js written: build ${buildId}, ${urls.length} URLs precached.`);
