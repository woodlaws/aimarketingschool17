import { createRequire } from "node:module";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const loadPackage = (name) => {
  try { return require(name); }
  catch { return require(path.resolve(path.dirname(process.execPath), "..", "node_modules", name)); }
};
const sharp = loadPackage("sharp");

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error("원본 플라이휠 이미지 경로가 필요합니다.");

const outputDirectory = path.resolve("public/proof");
const outputPath = path.join(outputDirectory, "flywheel.webp");
await mkdir(outputDirectory, { recursive: true });
const output = await sharp(sourcePath).resize({ width: 1400 }).webp({ quality: 78, effort: 6, smartSubsample: true }).toFile(outputPath);
const fileStats = await stat(outputPath);
console.log(JSON.stringify({ file: path.basename(outputPath), width: output.width, height: output.height, bytes: fileStats.size }, null, 2));
