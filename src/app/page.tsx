import ToolCard from "@/components/ToolCard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-6">
      <ToolCard title="Welcome to Toolify" description="Five free tools. Offline-ready. No signup required.">
        <p className="mb-4 text-sm text-gray-700">
          Use the navigation above to access:
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          <li><Link href="/qr" className="underline">QR Genie</Link> – generate custom QR codes with logos.</li>
          <li><Link href="/invoice" className="underline">Invoice Pro</Link> – build and download PDF invoices.</li>
          <li><Link href="/screenshot" className="underline">Screenshot → Text</Link> – OCR images to editable text.</li>
          <li><Link href="/bg-remove" className="underline">BG Remover</Link> – remove white backgrounds from images.</li>
          <li><Link href="/pdf-ocr" className="underline">PDF → Searchable</Link> – OCR scanned PDFs into searchable PDFs.</li>
        </ul>
      </ToolCard>
    </div>
  );
}
