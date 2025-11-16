import Tesseract from "tesseract.js";

export async function ocrImage(file: File, onProgress?: (p: number) => void): Promise<string> {
  const worker = await Tesseract.createWorker("eng", 1, {
    logger: (m) => {
      if (m.status === "recognizing text" && typeof m.progress === "number") {
        onProgress?.(Math.round(m.progress * 100));
      }
    },
  });
  const res = await worker.recognize(await file.arrayBuffer());
  await worker.terminate();
  return res.data.text;
}

export function detectBullets(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length)
    .map((l) => (l.match(/^[•\-*]\s+/) ? l : `• ${l}`));
}