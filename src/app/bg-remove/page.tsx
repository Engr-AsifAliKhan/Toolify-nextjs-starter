"use client";

import { useRef, useState } from "react";
import ToolCard from "@/components/ToolCard";
import UploadZone from "@/components/UploadZone";
import { removeBackground, downloadCanvasPNG } from "@/lib/image";

export default function BGRemovePage() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  async function onFile(file: File) {
    const result = await removeBackground(file);
    setCanvas(result);
    const container = containerRef.current;
    if (container) {
      container.innerHTML = "";
      container.appendChild(result);
      result.className = "max-h-[400px] w-auto";
    }
  }

  return (
    <div className="grid gap-6">
      <ToolCard title="Image Background Remover" description="Remove white backgrounds using a fast heuristic.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <UploadZone accept="image/*" onFile={onFile} />
            <div className="flex gap-2">
              <button className="rounded border px-3 py-1 text-sm" disabled={!canvas} onClick={() => canvas && downloadCanvasPNG(canvas, "clean")}>
                Download PNG
              </button>
            </div>
          </div>
          <div ref={containerRef} className="flex min-h-64 items-center justify-center rounded border bg-gray-50">
            {!canvas && <p className="text-sm text-gray-500">Upload an image to preview</p>}
          </div>
        </div>
      </ToolCard>
    </div>
  );
}