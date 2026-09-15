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
  await page.goto("http://127.0.0.1:4193/#proof", { waitUntil: "networkidle" });

  const strip = page.locator("[data-drive-strip]");
  await strip.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(outputDirectory, `drive-strip-${label}.png`), fullPage: false });

  const images = strip.locator("img");
  for (let index = 0; index < await images.count(); index += 1) {
    await images.nth(index).scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
  }

  const metrics = await page.evaluate(() => {
    const stripElement = document.querySelector("[data-drive-strip]");
    const notionElement = document.querySelector("[data-notion-proof]");
    const buttons = [...document.querySelectorAll("[data-drive-image]")];
    const stripImages = stripElement ? [...stripElement.querySelectorAll("img")] : [];
    const rects = buttons.map((button) => button.getBoundingClientRect());
    return {
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      noErrorOverlay: !document.querySelector("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay"),
      stripHeight: Math.round(stripElement?.getBoundingClientRect().height ?? 0),
      notionBlockHeight: Math.round(notionElement?.getBoundingClientRect().height ?? 0),
      imageCount: stripImages.length,
      loadedImages: stripImages.filter((image) => image.complete && image.naturalWidth > 0).length,
      aspectRatios: rects.map((rect) => Number((rect.width / rect.height).toFixed(2))),
      widths: rects.map((rect) => Math.round(rect.width)),
      tops: rects.map((rect) => Math.round(rect.top + scrollY)),
      objectPositions: stripImages.map((image) => getComputedStyle(image).objectPosition),
      hasCopy: ["그리고, 파일까지", "화면만 정리되는 게 아닙니다.", "파일 찾는 시간이 사라집니다", "화면도, 파일도, 1주차에 끝냅니다.", "12주차 결과물이 아니라, 첫 수업 결과물입니다."].every((text) => document.body.innerText.includes(text))
    };
  });

  const firstButton = page.locator('[data-drive-image="/proof/drive-03.webp"]');
  await firstButton.click();
  const dialog = page.getByRole("dialog");
  metrics.lightbox = {
    opened: await dialog.isVisible(),
    bodyLocked: await page.evaluate(() => document.body.style.overflow === "hidden")
  };
  await page.keyboard.press("Escape");
  metrics.lightbox.closedWithEscape = !(await dialog.isVisible());
  metrics.lightbox.focusReturned = await firstButton.evaluate((element) => document.activeElement === element);

  await context.close();
  return { label, viewport, ...metrics };
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  console.log(JSON.stringify([
    await verify({ width: 1440, height: 1000 }, "desktop-1440"),
    await verify({ width: 400, height: 900 }, "mobile-400")
  ], null, 2));
} finally {
  await browser.close();
}
