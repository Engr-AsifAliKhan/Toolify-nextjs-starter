export async function removeBackground(file: File): Promise<HTMLCanvasElement> {
  const img = await fileToImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  // Simple heuristic: treat near-white background as transparent
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const brightness = (r + g + b) / 3;
    if (brightness > 240) {
      data[i + 3] = 0; // alpha
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

export function downloadCanvasPNG(canvas: HTMLCanvasElement, filename = "image") {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = `${filename}.png`;
  a.click();
}

export async function fileToImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;
  await img.decode();
  URL.revokeObjectURL(url);
  return img;
}