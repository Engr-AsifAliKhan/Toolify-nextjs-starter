import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.mjs?worker&url";

(pdfjs as any).GlobalWorkerOptions.workerSrc = workerUrl;

export async function extractPages(file: File): Promise<ImageData[]> {
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages: ImageData[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: ctx as any, viewport }).promise;
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    pages.push(img);
  }
  return pages;
}

export async function buildSearchablePdf(textPages: string[], width = 595, height = 842): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (const text of textPages) {
    const page = doc.addPage([width, height]);
    page.setFont(font);
    page.setFontSize(12);
    page.setFillColor(rgb(0, 0, 0));
    const lines = text.split(/\r?\n/);
    let y = height - 36;
    for (const line of lines) {
      page.drawText(line, { x: 36, y });
      y -= 16;
      if (y < 36) break;
    }
  }
  return await doc.save();
}