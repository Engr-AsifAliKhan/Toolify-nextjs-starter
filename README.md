# Toolify

Toolify is a production-ready, offline-capable Next.js 15 (App Router) + TypeScript web app with five free tools:
- QR Genie
- Invoice Pro
- Screenshot → Text (OCR)
- Image Background Remover
- PDF → Searchable (OCR)

English-only. Optional login via NextAuth (Google + Email). 10 MB upload limit enforced.

## Tech Stack
- Next.js 15 + React 19 + TypeScript
- Tailwind CSS v4
- Tesseract.js, pdf.js (pdfjs-dist), pdf-lib, qrcode
- Zod, React Hook Form, localforage
- Workbox (PWA) via service worker
- NextAuth.js (Google + Email)

## Local Development

1) Install dependencies
```bash
npm i
```

2) Set environment variables
Create `.env.local`:
```
NEXTAUTH_SECRET=replace-with-strong-secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=Toolify <no-reply@yourdomain.com>
```

3) Run the app
```bash
npm run dev
```
Open http://localhost:3000

## Deploy to Vercel

1) Push to GitHub
```bash
git init
git add -A
git commit -m "Toolify initial release"
git branch -M main
git remote add origin https://github.com/you/toolify.git
git push -u origin main
```

2) Import to Vercel
- Go to https://vercel.com/import
- Add the same env vars in Vercel project settings (Environment Variables)

3) Deploy
- Vercel will auto-detect Next.js and deploy.
- App will be available (e.g., https://toolify.vercel.app)

## PWA

- Manifest: `public/manifest.json`
- Service worker: `public/sw.js` (Workbox CDN)
- Registers in Header component; app works offline after first load.

## Security

- Middleware rate-limits 1 req/sec per IP.
- CSP headers configured in `next.config.ts`.
- File type and size validation client-side (10 MB max).

## Notes

- All processing is client-side. No server load for tools.
- Optional analytics (add Umami script to `src/app/layout.tsx` if desired).
