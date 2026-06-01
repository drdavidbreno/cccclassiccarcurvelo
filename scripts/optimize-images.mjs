import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const jobs = [
  {
    input: "img/eventos/foto1.jpg",
    baseOut: "img/eventos/foto1",
    sizes: [480, 960, 1600],
    thumb: 320
  },
  {
    input: "img/eventos/foto2.jpg",
    baseOut: "img/eventos/foto2",
    sizes: [480, 960, 1600],
    thumb: 320
  },
  {
    input: "img/eventos/foto3.jpg",
    baseOut: "img/eventos/foto3",
    sizes: [480, 960, 1600],
    thumb: 320
  },
  {
    input: "img/eventos/foto4.jpg",
    baseOut: "img/eventos/foto4",
    sizes: [480, 960, 1600],
    thumb: 320
  },
  {
    input: "img/eventos/foto5.jpg",
    baseOut: "img/eventos/foto5",
    sizes: [480, 960, 1600],
    thumb: 320
  },
  {
    input: "img/eventos/foto6.jpg",
    baseOut: "img/eventos/foto6",
    sizes: [480, 960, 1600],
    thumb: 320
  },
  {
    input: "img/eventos/foto7.jpg",
    baseOut: "img/eventos/foto7",
    sizes: [480, 960, 1600],
    thumb: 320
  },
  {
    input: "img/eventos/foto8.jpg",
    baseOut: "img/eventos/foto8",
    sizes: [480, 960, 1600],
    thumb: 320
  },
  {
    input: "img/cartaz2026.webp",
    baseOut: "img/cartaz2026",
    sizes: [480, 960, 1600],
    thumb: 320
  }
];

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

function outPath(baseOut, width) {
  if (width === 960) return `${baseOut}.webp`;
  return `${baseOut}-${width}.webp`;
}

function thumbPath(baseOut) {
  return `${baseOut}-thumb.webp`;
}

async function writeWebp(buffer, outputFile) {
  await ensureDir(outputFile);
  await fs.writeFile(outputFile, buffer);
}

async function processJob(job) {
  const inputFile = path.join(repoRoot, job.input);
  const inputBuffer = await fs.readFile(inputFile);
  const img = sharp(inputBuffer, { failOn: "none" }).rotate();

  for (const width of job.sizes) {
    const output = path.join(repoRoot, outPath(job.baseOut, width));
    const buffer = await img
      .clone()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 74, effort: 5 })
      .toBuffer();
    await writeWebp(buffer, output);
  }

  const thumbOut = path.join(repoRoot, thumbPath(job.baseOut));
  const thumbBuffer = await img
    .clone()
    .resize({ width: job.thumb, withoutEnlargement: true })
    .webp({ quality: 70, effort: 5 })
    .toBuffer();
  await writeWebp(thumbBuffer, thumbOut);
}

async function main() {
  let ok = 0;
  for (const job of jobs) {
    await processJob(job);
    ok += 1;
  }
  console.log(`Done: ${ok} sets`);
}

await main();
