// Builds data/land-dots.json: a grid of [lat, lon] points that fall on land.
// The hero globe draws these as dots. Run with `npm run land` after changing the grid.
import fs from "node:fs";
import { createRequire } from "node:module";
import { geoContains } from "d3-geo";
import * as topojson from "topojson-client";

const require = createRequire(import.meta.url);
const atlas = JSON.parse(fs.readFileSync(require.resolve("world-atlas/land-110m.json"), "utf8"));
const land = topojson.feature(atlas, atlas.objects.land);

// Spacing in degrees. 3 gives roughly 1,200 dots: dense enough to read as continents,
// light enough to animate smoothly on phones.
const STEP = 3;
const points = [];

for (let lat = -56; lat <= 80; lat += STEP) {
  // Fewer longitude samples near the poles, so dots stay evenly spaced on the sphere.
  const count = Math.max(1, Math.round((360 * Math.cos((lat * Math.PI) / 180)) / STEP));
  for (let i = 0; i < count; i++) {
    const lon = -180 + (i * 360) / count;
    if (geoContains(land, [lon, lat])) {
      points.push([Number(lat.toFixed(1)), Number(lon.toFixed(1))]);
    }
  }
}

fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/land-dots.json", JSON.stringify(points));
console.log(`land-dots.json written: ${points.length} land points at ${STEP}° spacing.`);
