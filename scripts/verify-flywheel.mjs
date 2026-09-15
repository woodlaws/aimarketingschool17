import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const loadPackage = (name) => {
  try { return require(name); }
  catch { return require(path.resolve(path.dirname(process.execPath), "..", "node_modules", name)); }
};
const { chromium } = loadPackage("playwright");

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4197/";
const outputDirectory = path.resolve("artifacts");
await mkdir(outputDirectory, { recursive: true });

async function verify(viewport, label) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const section = page.locator("[data-flywheel-section]");
  await section.evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY));
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(outputDirectory, `flywheel-${label}.png`), fullPage: false });

  if (viewport.width < 1024) {
    await page.locator("[data-mobile-flywheel]").screenshot({ path: path.join(outputDirectory, `flywheel-cards-${label}.png`) });
  }

  const metrics = await page.evaluate(() => {
    const flywheel = document.querySelector("[data-flywheel-section]");
    const desktop = document.querySelector("[data-desktop-flywheel]");
    const mobile = document.querySelector("[data-mobile-flywheel]");
    const flow = document.querySelector("[data-flywheel-flow]");
    const desktopVisible = desktop ? getComputedStyle(desktop).display !== "none" : false;
    const mobileVisible = mobile ? getComputedStyle(mobile).display !== "none" : false;
    const visibleSteps = [...(desktopVisible ? desktop?.querySelectorAll("[data-flywheel-step]") ?? [] : mobile?.querySelectorAll("[data-flywheel-step]") ?? [])];
    const dissonance = [...document.querySelectorAll("section")].find((item) => item.textContent?.includes("낱개의 도구를 배웠을 뿐"));
    const curriculumBadges = [...document.querySelectorAll('[aria-label^="플라이휠 "]')];
    const descriptionsReadable = visibleSteps.every((card) => {
      const description = card.querySelector("p");
      return description && Number.parseFloat(getComputedStyle(description).fontSize) >= 15 && description.scrollWidth <= description.clientWidth;
    });
    return {
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      noErrorOverlay: !document.querySelector("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay"),
      sectionHeight: Math.round(flywheel?.getBoundingClientRect().height ?? 0),
      desktopVisible,
      mobileVisible,
      visibleStepCount: visibleSteps.length,
      liveStepCount: visibleSteps.filter((step) => step.textContent?.includes("오늘 밤 공개")).length,
      descriptionsReadable,
      flowScrollable: flow ? flow.scrollWidth > flow.clientWidth : false,
      s6DirectlyBeforeS7: dissonance?.nextElementSibling === flywheel,
      s10BadgeCount: curriculumBadges.length,
      s10BadgeSequence: curriculumBadges.map((badge) => badge.textContent),
      hasRequiredCopy: ["AI 수익화 엔진", "이미 정해져 있습니다.", "오늘 밤에는, 이 중", "도구가 아닙니다", "수익화 시스템", "이 구조, 9월 18일 밤에 직접 보여드립니다"].every((text) => document.body.innerText.includes(text))
    };
  });

  const visibleButton = page.locator("[data-flywheel-image-button]:visible").first();
  await visibleButton.click();
  const dialog = page.getByRole("dialog");
  await dialog.locator("img").waitFor({ state: "visible" });
  await page.waitForFunction(() => {
    const image = document.querySelector('[role="dialog"] img');
    return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
  });
  metrics.lightbox = {
    opened: await dialog.isVisible(),
    imageLoaded: await dialog.locator("img").evaluate((image) => image.complete && image.naturalWidth > 0),
    bodyLocked: await page.evaluate(() => document.body.style.overflow === "hidden")
  };
  await page.keyboard.press("Escape");
  metrics.lightbox.closedWithEscape = !(await dialog.isVisible());
  metrics.lightbox.focusReturned = await visibleButton.evaluate((element) => document.activeElement === element);

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
