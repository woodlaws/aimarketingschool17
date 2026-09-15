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
  const consoleErrors = [];
  const failedRequests = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("requestfailed", (request) => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on("response", (response) => { if (response.status() >= 400) failedRequests.push({ url: response.url(), status: response.status() }); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:4191/#proof", { waitUntil: "networkidle" });

  const notionBadge = page.getByText("1주차 수업 결과물", { exact: true });
  await notionBadge.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(outputDirectory, `notion-proof-${label}.png`), fullPage: false });

  const notionImages = page.locator('img[alt^="수강생이 만든 노션 업무 대시보드"]');
  for (let index = 0; index < await notionImages.count(); index += 1) {
    await notionImages.nth(index).evaluate((element) => element.scrollIntoView({ block: "center", inline: "center" }));
    await page.waitForTimeout(180);
  }

  const metrics = await page.evaluate(() => {
    const badges = [...document.querySelectorAll("span")];
    const notion = badges.find((node) => node.textContent === "1주차 수업 결과물");
    const next = badges.find((node) => node.textContent === "실제 수강생 결과물");
    const notionCards = [...document.querySelectorAll("[data-notion-card]")];
    const imageAreas = notionCards.map((card) => card.querySelector("button")?.getBoundingClientRect());
    const carousel = notionCards[0]?.parentElement?.parentElement;
    const images = [...document.querySelectorAll('img[alt^="수강생이 만든 노션 업무 대시보드"]')];
    return {
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      noErrorOverlay: !document.querySelector("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay"),
      firstInProof: Boolean(notion && next && notion.getBoundingClientRect().top < next.getBoundingClientRect().top),
      imageCount: images.length,
      loadedImages: images.filter((image) => image.complete && image.naturalWidth > 0).length,
      aspectRatios: imageAreas.map((rect) => rect ? Number((rect.width / rect.height).toFixed(2)) : 0),
      cardTops: notionCards.map((card) => Math.round(card.getBoundingClientRect().top + scrollY)),
      carouselScrolls: carousel ? carousel.scrollWidth > carousel.clientWidth : false,
      proofHeightCollapsed: Math.round(document.querySelector("#proof")?.getBoundingClientRect().height ?? 0),
      separatorsPresent: ["그리고, 이런 것들도 만듭니다", "그리고, 홈페이지까지", "직접 쓴 후기입니다"].every((text) => document.body.innerText.includes(text))
    };
  });

  const firstCardButton = page.getByRole("button", { name: "멍멍앤코 대시보드 크게 보기" });
  await firstCardButton.click();
  const dialog = page.getByRole("dialog");
  metrics.lightbox = {
    opened: await dialog.isVisible(),
    bodyLocked: await page.evaluate(() => document.body.style.overflow === "hidden"),
    width: Math.round((await dialog.locator("div.mx-auto").boundingBox())?.width ?? 0)
  };
  await page.keyboard.press("Escape");
  metrics.lightbox.closedWithEscape = !(await dialog.isVisible());
  metrics.lightbox.focusReturned = await firstCardButton.evaluate((element) => document.activeElement === element);

  await page.getByRole("button", { name: "후기 5개 더 보기 ▾" }).click();
  metrics.proofHeightExpanded = await page.evaluate(() => Math.round(document.querySelector("#proof")?.getBoundingClientRect().height ?? 0));
  metrics.consoleErrors = consoleErrors;
  metrics.failedRequests = failedRequests;
  await context.close();
  return { label, viewport, ...metrics };
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  console.log(JSON.stringify([
    await verify({ width: 1440, height: 1000 }, "desktop-1440"),
    await verify({ width: 900, height: 1000 }, "tablet-900"),
    await verify({ width: 400, height: 900 }, "mobile-400")
  ], null, 2));
} finally {
  await browser.close();
}
