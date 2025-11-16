"use client";

import { useForm, useFieldArray } from "react-hook-form";
import ToolCard from "@/components/ToolCard";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type Item = { description: string; qty: number; price: number };
type FormData = {
  client: string;
  currency: string;
  tax: number;
  discount: number;
  items: Item[];
};

export default function InvoicePage() {
  const { register, control, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      client: "",
      currency: "USD",
      tax: 0,
      discount: 0,
      items: [{ description: "", qty: 1, price: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  async function onSubmit(data: FormData) {
    const doc = await PDFDocument.create();
    const page = doc.addPage([595, 842]);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    page.setFont(font);
    page.setFontSize(14);

    let y = 800;
    page.drawText("Invoice", { x: 36, y, size: 24 });
    y -= 32;
    page.drawText(`Client: ${data.client || "N/A"}`, { x: 36, y });
    y -= 20;
    page.drawText(`Currency: ${data.currency}`, { x: 36, y });
    y -= 24;

    page.drawText("Items:", { x: 36, y, size: 16 });
    y -= 20;

    let subtotal = 0;
    for (let i = 0; i < data.items.length; i++) {
      const it = data.items[i];
      const total = it.qty * it.price;
      subtotal += total;
      page.drawText(`${i + 1}. ${it.description}  x${it.qty}  ${it.price.toFixed(2)} = ${total.toFixed(2)}`, { x: 48, y });
      y -= 18;
    }

    const taxAmount = (data.tax / 100) * subtotal;
    const discountAmount = (data.discount / 100) * subtotal;
    const grand = subtotal + taxAmount - discountAmount;

    y -= 10;
    page.drawLine({ start: { x: 36, y }, end: { x: 559, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    y -= 20;

    page.drawText(`Subtotal: ${subtotal.toFixed(2)} ${data.currency}`, { x: 36, y });
    y -= 18;
    page.drawText(`Tax (${data.tax}%): ${taxAmount.toFixed(2)} ${data.currency}`, { x: 36, y });
    y -= 18;
    page.drawText(`Discount (${data.discount}%): -${discountAmount.toFixed(2)} ${data.currency}`, { x: 36, y });
    y -= 18;
    page.drawText(`Total: ${grand.toFixed(2)} ${data.currency}`, { x: 36, y, size: 16 });

    const pdfBytes = await doc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoice.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6">
      <ToolCard title="Invoice Pro" description="Create a PDF invoice client-side.">
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="text-sm">Client</span>
              <input className="mt-1 w-full rounded border px-3 py-2 text-sm" {...register("client")} placeholder="Client name" />
            </label>
            <label className="block">
              <span className="text-sm">Currency</span>
              <select className="mt-1 w-full rounded border px-3 py-2 text-sm" {...register("currency")}>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm">Tax %</span>
              <input type="number" step="0.01" className="mt-1 w-full rounded border px-3 py-2 text-sm" {...register("tax", { valueAsNumber: true })} />
            </label>
            <label className="block">
              <span className="text-sm">Discount %</span>
              <input type="number" step="0.01" className="mt-1 w-full rounded border px-3 py-2 text-sm" {...register("discount", { valueAsNumber: true })} />
            </label>
          </div>

          <div className="rounded border p-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Items</h3>
              <button
                type="button"
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
                onClick={() => append({ description: "", qty: 1, price: 0 })}
              >
                Add Item
              </button>
            </div>
            <div className="mt-3 grid gap-3">
              {fields.map((field, idx) => (
                <div key={field.id} className="grid gap-3 md:grid-cols-4">
                  <input className="rounded border px-3 py-2 text-sm md:col-span-2" placeholder="Description" {...register(`items.${idx}.description`)} />
                  <input type="number" className="rounded border px-3 py-2 text-sm" placeholder="Qty" {...register(`items.${idx}.qty`, { valueAsNumber: true })} />
                  <input type="number" step="0.01" className="rounded border px-3 py-2 text-sm" placeholder="Price" {...register(`items.${idx}.price`, { valueAsNumber: true })} />
                  <button type="button" className="text-sm text-red-600" onClick={() => remove(idx)}>Remove</button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white">Download PDF</button>
        </form>
      </ToolCard>
    </div>
  );
}