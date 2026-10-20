// Asset pipeline (run with `npm run icons`).
//  1. Optimizes photos and client logos in public/images (same file names, smaller files).
//  2. Generates the PWA icons, Apple touch icon, favicons, OG image, and favicon.ico
//     from the brand mark (public/images/logo.webp).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const IMAGES = path.resolve("public/images");
const CLIENTS = path.join(IMAGES, "clients");
const ICONS = path.resolve("public/icons");
const MIST = { r: 240, g: 254, b: 255, alpha: 1 };

fs.mkdirSync(ICONS, { recursive: true });

async function shrinkInPlace(file, maxWidth, options = {}) {
  const ext = path.extname(file).toLowerCase();
  // Read into memory first, so no file handle stays open (Windows locks files otherwise).
  const source = fs.readFileSync(file);
  const pipeline = sharp(source).resize({ width: maxWidth, withoutEnlargement: true });
  let buffer;
  if (ext === ".webp") buffer = await pipeline.webp({ quality: options.quality ?? 82 }).toBuffer();
  else if (ext === ".png") buffer = await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer();
  else if (ext === ".jpg" || ext === ".jpeg") buffer = await pipeline.jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  else return;
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, buffer);
  fs.renameSync(temp, file);
}

// Photos used in sections (large originals)
for (const name of ["hero.webp", "services.webp", "clients.webp"]) {
  await shrinkInPlace(path.join(IMAGES, name), 1600, { quality: 80 });
}
await shrinkInPlace(path.join(IMAGES, "contact-map-2.png"), 1200);

// Client logos (shown at most ~240px wide, so 480px covers high-DPI screens)
for (const name of fs.readdirSync(CLIENTS)) {
  await shrinkInPlace(path.join(CLIENTS, name), 480);
}

// Brand mark. Trim transparent padding so scaling is predictable.
const mark = await sharp(path.join(IMAGES, "logo.webp")).trim().png().toBuffer();

async function markAt(size, scale) {
  const side = Math.round(size * scale);
  return sharp(mark).resize({ width: side, height: side, fit: "inside" }).png().toBuffer();
}

async function square(size, scale, file) {
  const input = await markAt(size, scale);
  await sharp({ create: { width: size, height: size, channels: 4, background: MIST } })
    .composite([{ input, gravity: "centre" }])
    .png()
    .toFile(path.join(ICONS, file));
}

// Header logo (transparent, small)
await sharp(mark).resize(128, 128, { fit: "inside" }).webp({ quality: 92 }).toFile(path.join(IMAGES, "logo-128.webp"));

// "any" icons keep the mark at 72% so the rounded corners never crop it.
await square(192, 0.72, "icon-192.png");
await square(512, 0.72, "icon-512.png");
// Maskable icons sit inside the 80% safe zone, so Android masks never cut the mark.
await square(512, 0.6, "icon-maskable-512.png");
await square(180, 0.72, "apple-touch-icon.png");
await square(32, 0.8, "favicon-32.png");
await square(16, 0.8, "favicon-16.png");

// Social preview (1200x630), built from the hero illustration.
await sharp(path.join(IMAGES, "hero.webp"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .png({ compressionLevel: 9, palette: true })
  .toFile(path.join(ICONS, "og-image.png"));

// favicon.ico with PNG entries at 16, 32 and 48 px (supported by all current browsers)
async function iconPng(size) {
  return sharp(mark)
    .resize({ width: Math.round(size * 0.8), height: Math.round(size * 0.8), fit: "inside" })
    .extend({
      top: Math.floor((size - Math.round(size * 0.8)) / 2),
      bottom: Math.ceil((size - Math.round(size * 0.8)) / 2),
      left: Math.floor((size - Math.round(size * 0.8)) / 2),
      right: Math.ceil((size - Math.round(size * 0.8)) / 2),
      background: MIST,
    })
    .png()
    .toBuffer();
}

function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  const directory = Buffer.alloc(16 * entries.length);
  let offset = 6 + 16 * entries.length;
  entries.forEach((entry, i) => {
    const base = i * 16;
    directory.writeUInt8(entry.size >= 256 ? 0 : entry.size, base);
    directory.writeUInt8(entry.size >= 256 ? 0 : entry.size, base + 1);
    directory.writeUInt8(0, base + 2);
    directory.writeUInt8(0, base + 3);
    directory.writeUInt16LE(1, base + 4);
    directory.writeUInt16LE(32, base + 6);
    directory.writeUInt32LE(entry.png.length, base + 8);
    directory.writeUInt32LE(offset, base + 12);
    offset += entry.png.length;
  });
  return Buffer.concat([header, directory, ...entries.map((entry) => entry.png)]);
}

const ico = buildIco(await Promise.all([16, 32, 48].map(async (size) => ({ size, png: await iconPng(size) }))));
fs.writeFileSync(path.resolve("public/favicon.ico"), ico);

console.log("Images optimized and icons generated in public/icons and public/favicon.ico.");
