import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const loadPackage = (name) => {
  try { return require(name); }
  catch { return require(path.resolve(path.dirname(process.execPath), "..", "node_modules", name)); }
};
const { chromium } = loadPackage("playwright");

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4194/#proof";
const outputDirectory = path.resolve("artifacts");
await mkdir(outputDirectory, { recursive: true });

async function verify(viewport, label) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(baseUrl, { waitUntil: "networkidle" });

  const section = page.locator("[data-video-works]");
  await section.evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY));
  const images = section.locator("img");
  for (let index = 0; index < await images.count(); index += 1) {
    await images.nth(index).scrollIntoViewIfNeeded();
    await page.waitForTimeout(80);
  }
  await section.locator(".no-scrollbar").evaluate((carousel) => { carousel.scrollLeft = 0; });
  await section.evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY));
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outputDirectory, `video-works-${label}.png`), fullPage: false });

  const metrics = await page.evaluate(() => {
    const sectionElement = document.querySelector("[data-video-works]");
    const cards = [...document.querySelectorAll("[data-video-card]")];
    const carousel = cards[0]?.parentElement?.parentElement;
    const sectionImages = sectionElement ? [...sectionElement.querySelectorAll("img")] : [];
    const cardRects = cards.map((card) => card.getBoundingClientRect());
    const links = cards.filter((card) => card instanceof HTMLAnchorElement);
    return {
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      noErrorOverlay: !document.querySelector("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay"),
      sectionHeight: Math.round(sectionElement?.getBoundingClientRect().height ?? 0),
      cardCount: cards.length,
      readyCount: cards.filter((card) => card.getAttribute("data-video-ready") === "true").length,
      pendingCount: cards.filter((card) => card.getAttribute("data-video-ready") === "false").length,
      linkCount: links.length,
      safeLinks: links.every((link) => link.getAttribute("target") === "_blank" && link.getAttribute("rel") === "noopener noreferrer"),
      pendingBadgeCount: [...(sectionElement?.querySelectorAll("span") ?? [])].filter((span) => span.textContent === "영상 준비 중").length,
      imageCount: sectionImages.length,
      loadedImages: sectionImages.filter((image) => image.complete && image.naturalWidth > 0).length,
      widths: cardRects.map((rect) => Math.round(rect.width)),
      heights: cardRects.map((rect) => Math.round(rect.height)),
      tops: cardRects.map((rect) => Math.round(rect.top + scrollY)),
      carouselScrollable: carousel ? carousel.scrollWidth > carousel.clientWidth : false,
      hasCopy: ["그리고, 영상까지", "촬영도, 편집 프로그램도 없이", "처음엔 재미로 만들었습니다.", "그런데 지금은, 자기 가게 홍보에 쓰고 있습니다."].every((text) => document.body.innerText.includes(text))
    };
  });

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
