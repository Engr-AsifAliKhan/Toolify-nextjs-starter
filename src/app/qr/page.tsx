"use client";

import { useRef, useState } from "react";
import ToolCard from "@/components/ToolCard";
import UploadZone from "@/components/UploadZone";
import { generateQR, downloadCanvas } from "@/lib/qr";

export default function QRPage() {
  const [text, setText] = useState("https://toolify.vercel.app");
  const [color, setColor] = useState("#000000");
  const [scans] = useState(() => Math.floor(100 + Math.random() * 300));
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  async function build() {
    let logoImg: HTMLImageElement | undefined;
    if (logoFile) {
      const url = URL.createObjectURL(logoFile);
      logoImg = new Image();
      logoImg.src = url;
      await logoImg.decode();
      URL.revokeObjectURL(url);
    }
    const canvas = await generateQR(text, color, logoImg);
    canvasRef.current?.replaceWith(canvas);
    canvasRef.current = canvas;
    document.getElementById("qr-container")?.appendChild(canvas);
  }

  return (
    <div className="grid gap-6">
      <ToolCard title="QR Genie" description="Generate a custom QR code with color and optional logo.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm">Text or URL</span>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                placeholder="Enter text or URL"
              />
            </label>
            <label className="block">
              <span className="text-sm">Color</span>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-1 h-10 w-16" />
            </label>
            <UploadZone accept="image/*" label="Optional logo" onFile={setLogoFile} />
            <button onClick={build} className="rounded bg-blue-600 px-4 py-2 text-white">Generate</button>
            <p className="text-xs text-gray-500">Mock stats: {scans} scans</p>
            <div className="flex gap-2">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => canvasRef.current && downloadCanvas(canvasRef.current, "png", "qr")}>
                Download PNG
              </button>
            </div>
          </div>
          <div id="qr-container" className="flex items-center justify-center rounded border bg-gray-50 min-h-64">
            {!canvasRef.current && <p className="text-sm text-gray-500">Your QR preview will appear here</p>}
          </div>
        </div>
      </ToolCard>
    </div>
  );
}