"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Workbox } from "workbox-window";

export default function Header() {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const wb = new Workbox("/sw.js");
      wb.register();
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <nav className="w-full sticky top-0 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-lg">Toolify</Link>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/qr" className="hover:underline">QR Genie</Link>
            <Link href="/invoice" className="hover:underline">Invoice Pro</Link>
            <Link href="/screenshot" className="hover:underline">Screenshot → Text</Link>
            <Link href="/bg-remove" className="hover:underline">BG Remover</Link>
            <Link href="/pdf-ocr" className="hover:underline">PDF → Searchable</Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle theme"
            className="rounded bg-white/10 px-3 py-1 text-sm hover:bg-white/20"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <Link href="/api/auth/signin" className="rounded bg-white text-blue-700 px-3 py-1 text-sm font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}