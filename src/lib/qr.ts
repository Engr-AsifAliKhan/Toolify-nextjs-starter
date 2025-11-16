import QRCode from "qrcode";

export async function generateQR(data: string, color = "#000000", logo?: HTMLImageElement): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, data, {
    errorCorrectionLevel: "H",
    color: { dark: color, light: "#ffffff" },
    margin: 2,
    scale: 8,
  });

  if (logo) {
    const ctx = canvas.getContext("2d")!;
    const size = Math.floor(Math.min(canvas.width, canvas.height) * 0.2);
    const x = (canvas.width - size) / 2;
    const y = (canvas.height - size) / 2;
    ctx.save();
    ctx.beginPath();
    const r = 8;
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + size - r, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + r);
    ctx.lineTo(x + size, y + size - r);
    ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
    ctx.lineTo(x + r, y + size);
    ctx.quadraticCurveTo(x, y + size, x, y + size - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.clip();
    ctx.drawImage(logo, x, y, size, size);
    ctx.restore();
  }

  return canvas;
}

export function downloadCanvas(canvas: HTMLCanvasElement, type: "png" | "svg" = "png", filename = "qr") {
  if (type === "png") {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${filename}.png`;
    a.click();
  }
}