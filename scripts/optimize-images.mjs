/**
 * Compress large public PNGs to WebP for production.
 * Run: node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

async function toWebp(name, maxSize) {
  const input = path.join(publicDir, `${name}.png`);
  const output = path.join(publicDir, `${name}.webp`);
  if (!fs.existsSync(input)) {
    console.warn(`skip ${name}.png (missing)`);
    return;
  }
  const before = fs.statSync(input).size;
  await sharp(input)
    .resize(maxSize, maxSize, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78, effort: 6 })
    .toFile(output);
  const after = fs.statSync(output).size;
  console.log(`${name}.webp: ${(before / 1024).toFixed(1)}KiB -> ${(after / 1024).toFixed(1)}KiB`);
}

async function icon96() {
  const input = path.join(publicDir, "icon.png");
  const output = path.join(publicDir, "icon-96.webp");
  if (!fs.existsSync(input)) return;
  await sharp(input).resize(96, 96, { fit: "cover" }).webp({ quality: 82 }).toFile(output);
  console.log("icon-96.webp written");
}

await toWebp("eye", 1000);
await toWebp("eye2", 1000);
await icon96();
