"use client";

import { useState } from "react";
import ToolCard from "@/components/ToolCard";
import UploadZone from "@/components/UploadZone";
import { ocrImage, detectBullets } from "@/lib/ocr";

export default function ScreenshotPage() {
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);

  async function handleFile(file: File) {
    setProgress(0);
    const txt = await ocrImage(file, setProgress);
    setText(txt);
  }

  function download(type: "txt" | "docx") {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ocr.${type}`;
    a.click();
  }

  return (
    <div className="grid gap-6">
      <ToolCard title="Screenshot → Text" description="Extract text from images using Tesseract.js.">
        <div className="grid gap-4">
          <UploadZone accept="image/*" onFile={handleFile} />
          <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
            <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <label className="block">
            <span className="text-sm">Editable text</span>
            <textarea
              className="mt-2 h-64 w-full rounded border p-2 text-sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </label>
          <div className="flex gap-2">
            <button className="rounded border px-3 py-1 text-sm" onClick={() => navigator.clipboard.writeText(text)}>Copy</button>
            <button className="rounded border px-3 py-1 text-sm" onClick={() => setText(detectBullets(text).join("\n"))}>Detect bullets</button>
            <button className="rounded border px-3 py-1 text-sm" onClick={() => download("txt")}>Download .txt</button>
            <button className="rounded border px-3 py-1 text-sm" onClick={() => download("docx")}>Download .docx</button>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}