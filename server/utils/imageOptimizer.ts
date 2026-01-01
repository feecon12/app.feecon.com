import sharp from "sharp";

export async function optimiseImage(inputPath: string, outputPath: string) {
  await sharp(inputPath)
    .webp({ quality: 80 })
    .resize({ width: 1200, withoutEnlargement: true })
    .toFile(outputPath);
}

export async function generateThumbnail(inputPath: string, outputPath: string) {
  await sharp(inputPath)
    .webp({ quality: 70 })
    .resize({ width: 300, height: 300, fit: "cover" })
    .toFile(outputPath);
}
