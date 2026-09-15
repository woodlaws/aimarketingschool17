import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const loadPackage = (name) => {
  try { return require(name); }
  catch { return require(path.resolve(path.dirname(process.execPath), "..", "node_modules", name)); }
};
const { chromium } = loadPackage("playwright");

const outputDirectory = path.resolve("artifacts");
await mkdir(outputDirectory, { recursive: true });

async function verify(viewport, label) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:4190/#proof", { waitUntil: "networkidle" });

  const badge = page.getByText("네이버 카페 실제 후기", { exact: true });
  await badge.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outputDirectory, `reviews-${label}.png`), fullPage: false });

  const section = badge.locator("xpath=ancestor::div[contains(@class,'bg-white')][1]");
  const initialImages = section.locator("img");
  for (let index = 0; index < await initialImages.count(); index += 1) {
    await initialImages.nth(index).scrollIntoViewIfNeeded();
  }
  const collapsed = await page.evaluate(() => {
    const badgeElement = [...document.querySelectorAll("span")].find((node) => node.textContent === "네이버 카페 실제 후기");
    const sectionElement = badgeElement?.closest("div.bg-white");
    const images = sectionElement ? [...sectionElement.querySelectorAll("img")] : [];
    return {
      documentHeight: document.documentElement.scrollHeight,
      sectionHeight: Math.round(sectionElement?.getBoundingClientRect().height ?? 0),
      proofHeight: Math.round(document.querySelector("#proof")?.getBoundingClientRect().height ?? 0),
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      imageCount: images.length,
      loadedImages: images.filter((image) => image.complete && image.naturalWidth > 0).length
    };
  });

  const firstOriginal = page.getByRole("button", { name: /원본 보기/ }).first();
  await firstOriginal.click();
  const dialog = page.getByRole("dialog");
  const lightbox = {
    opened: await dialog.isVisible(),
    bodyLocked: await page.evaluate(() => document.body.style.overflow === "hidden")
  };
  await page.keyboard.press("Escape");
  lightbox.closedWithEscape = !(await dialog.isVisible());
  lightbox.focusReturned = await firstOriginal.evaluate((element) => document.activeElement === element);

  await page.getByRole("button", { name: "후기 5개 더 보기 ▾" }).click();
  const allImages = section.locator("img");
  for (let index = 0; index < await allImages.count(); index += 1) {
    await allImages.nth(index).scrollIntoViewIfNeeded();
  }
  const expanded = await page.evaluate(() => {
    const badgeElement = [...document.querySelectorAll("span")].find((node) => node.textContent === "네이버 카페 실제 후기");
    const sectionElement = badgeElement?.closest("div.bg-white");
    const images = sectionElement ? [...sectionElement.querySelectorAll("img")] : [];
    const cafeLinks = sectionElement ? [...sectionElement.querySelectorAll('a[href="https://cafe.naver.com/shopmanagement"]')] : [];
    return {
      documentHeight: document.documentElement.scrollHeight,
      sectionHeight: Math.round(sectionElement?.getBoundingClientRect().height ?? 0),
      proofHeight: Math.round(document.querySelector("#proof")?.getBoundingClientRect().height ?? 0),
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      imageCount: images.length,
      loadedImages: images.filter((image) => image.complete && image.naturalWidth > 0).length,
      cafeLinksSafe: cafeLinks.length === 2 && cafeLinks.every((link) => link.target === "_blank" && link.rel.includes("noopener") && link.rel.includes("noreferrer"))
    };
  });

  const errors = (await page.evaluate(() => performance.getEntriesByType("resource").filter((entry) => entry.name.includes("/proof/reviews/")).map((entry) => entry.name))).length;
  await context.close();
  return { label, viewport, collapsed, expanded, lightbox, reviewResourceCount: errors };
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const results = [];
  results.push(await verify({ width: 1440, height: 1000 }, "desktop-1440"));
  results.push(await verify({ width: 400, height: 900 }, "mobile-400"));
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
