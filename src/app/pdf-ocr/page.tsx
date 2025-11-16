"use client";

import { useState } from "react";
import ToolCard from "@/components/ToolCard";
import UploadZone from "@/components/UploadZone";
import { extractPages, buildSearchablePdf } from "@/lib/pdf";
import Tesseract from "tesseract.js";

export default function PdfOcrPage() {
  const [pagesText, setPagesText] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  async function handlePdf(file: File) {
    setPagesText([]);
    setProgress(0);
    const images = await extractPages(file);
    const worker = await Tesseract.createWorker("eng", 1, {
      logger: (m) => {
        if (m.status === "recognizing text" && typeof m.progress === "number") {
          setProgress((prev) => Math.min(100, Math.round(m.progress * 100)));
        }
      },
    });

    const texts: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const canvas = document.createElement("canvas");
      canvas.width = images[i].width;
      canvas.height = images[i].height;
      const ctx = canvas.getContext("2d")!;
      ctx.putImageData(images[i], 0, 0);
      const res = await worker.recognize(canvas);
      texts.push(res.data.text);
      setPagesText([...texts]);
    }

    await worker.terminate();
  }

  async function downloadSearchable() {
    const bytes = await buildSearchablePdf(pagesText);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "searchable.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6">
      <ToolCard title="PDF → Searchable" description="Convert scanned PDFs into searchable PDFs via OCR.">
        <div className="grid gap-4">
          <UploadZone accept="application/pdf" onFile={handlePdf} />
          <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
            <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="grid gap-3">
            {pagesText.map((t, i) => (
              <div key={i} className="rounded border p-3">
                <p className="mb-2 text-xs text-gray-500">Page {i + 1}</p>
                <pre className="whitespace-pre-wrap text-sm">{t}</pre>
              </div>
            ))}
          </div>
          <button className="rounded bg-green-600 px-4 py-2 text-white" disabled={!pagesText.length} onClick={downloadSearchable}>
            Download Searchable PDF
          </button>
        </div>
      </ToolCard>
    </div>
  );
}