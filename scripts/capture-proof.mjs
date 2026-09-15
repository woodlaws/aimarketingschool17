import { createRequire } from "node:module";
import { mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const loadPackage = (name) => {
  try {
    return require(name);
  } catch {
    return require(path.resolve(path.dirname(process.execPath), "..", "node_modules", name));
  }
};
const { chromium } = loadPackage("playwright");
const sharp = loadPackage("sharp");

const captures = [
  { file: "site-01-anjeontim.webp", url: "https://anjeontim.vercel.app/" },
  { file: "site-02-giunchan.webp", url: "https://giunchan-website.vercel.app/" },
  { file: "site-03-seasonal.webp", url: "https://seasonal-family-table-gcv6.vercel.app/" }
];

const outputDirectory = path.resolve("public/proof");
const temporaryDirectory = path.resolve(".capture-proof-temp");

await mkdir(outputDirectory, { recursive: true });
await mkdir(temporaryDirectory, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];

try {
  for (const capture of captures) {
    const context = await browser.newContext({
      viewport: { width: 1200, height: 1600 },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();
    const rawPath = path.join(temporaryDirectory, `${capture.file}.raw.png`);
    const outputPath = path.join(outputDirectory, capture.file);

    try {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(capture.url, { waitUntil: "networkidle", timeout: 60_000 });
      await page.waitForTimeout(3_000);
      await page.screenshot({ path: rawPath, fullPage: false, type: "png" });

      await sharp(rawPath)
        .resize(1200, 1600, { fit: "fill" })
        .webp({ quality: 78, effort: 6, smartSubsample: true })
        .toFile(outputPath);
      const fileStats = await stat(outputPath);
      results.push({ ...capture, status: "success", bytes: fileStats.size });
    } catch (error) {
      results.push({ ...capture, status: "failed", error: error instanceof Error ? error.message : String(error) });
    } finally {
      await context.close();
      await rm(rawPath, { force: true });
    }
  }
} finally {
  await browser.close();
  await rm(temporaryDirectory, { recursive: true, force: true });
}

console.log(JSON.stringify(results, null, 2));
if (results.some((result) => result.status === "failed")) process.exitCode = 1;
