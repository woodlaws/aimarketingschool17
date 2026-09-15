import { createRequire } from "node:module";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const loadPackage = (name) => {
  try { return require(name); }
  catch { return require(path.resolve(path.dirname(process.execPath), "..", "node_modules", name)); }
};
const sharp = loadPackage("sharp");

const sourceDirectory = process.argv[2];
if (!sourceDirectory) throw new Error("원본 이미지 폴더 경로가 필요합니다.");

const outputDirectory = path.resolve("public/proof");
await mkdir(outputDirectory, { recursive: true });

const results = [];
for (const number of [1, 2, 3]) {
  const baseName = `drive-${String(number).padStart(2, "0")}`;
  const sourcePath = path.join(sourceDirectory, `${baseName}.png`);
  const outputPath = path.join(outputDirectory, `${baseName}.webp`);
  const output = await sharp(sourcePath)
    .resize({ width: 1000 })
    .webp({ quality: 76, effort: 6, smartSubsample: true })
    .toFile(outputPath);
  const fileStats = await stat(outputPath);
  results.push({ file: path.basename(outputPath), width: output.width, height: output.height, bytes: fileStats.size });
}

console.log(JSON.stringify(results, null, 2));
