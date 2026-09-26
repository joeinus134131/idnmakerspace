# IDN Makerspace

> Website publik IDN Maker Space untuk memperkenalkan fasilitas, learning path, workshop, membership, komunitas, prototyping, dan software development.

[Live demo](https://idnmakerspace.vercel.app) · [Discord Community](https://discord.gg/vwmCHN78H) · [GitHub Lab](https://github.com/idnmakerspace-lab) · [Request a reservation](https://wa.me/6283802436288)

## Overview

IDN Maker Space adalah landing page responsif untuk ekosistem maker lintas kota. Halaman ini mempertemukan kebutuhan hardware dan software dalam satu alur informasi yang ringkas, dengan WhatsApp sebagai jalur konfirmasi manusia pada fase MVP.

The current MVP intentionally uses a human-in-the-loop reservation and payment workflow. Every request is sent to the Makerspace admin through WhatsApp, where availability, final pricing, payment instructions, and booking status are confirmed manually.

## Highlights

- Landing page untuk lokasi, fasilitas, learning path, workshop, membership, dan komunitas.
- Layanan prototyping, software development, academy, serta dukungan tim dan inovasi.
- Ringkasan katalog/reservasi alat, safety badging, billing material, dan kesiapan multi-location.
- CTA WhatsApp kontekstual untuk membership, kunjungan, workshop, fasilitas, dan konsultasi software.
- Animasi scroll berbasis Intersection Observer dengan dukungan `prefers-reduced-motion`.
- Aset raster WebP, metadata sosial, JSON-LD organisasi dan layanan, serta layout responsif.

## Current operational flow

```text
Visitor memilih kebutuhan → membuka CTA yang relevan
→ mengirim permintaan melalui WhatsApp
→ admin mengonfirmasi cakupan, jadwal, ketersediaan, dan biaya
→ layanan atau kunjungan berjalan setelah konfirmasi manual
```

No payment, stored balance, QR check-in, or reservation is automatically processed by the website at this stage. This prevents the interface from promising automation that the operation has not yet implemented.

## Tech stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- [Lucide React](https://lucide.dev/)
- Plain CSS design system—no external UI framework

## Local development

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer

### Run locally

```bash
git clone https://github.com/joeinus134131/idnmakerspace.git
cd idnmakerspace
npm install
npm run dev
```

Open the local URL printed by Vite in a browser.

### Quality checks

```bash
npm run lint
npm run build
```

`build` creates the production-ready static output in `dist/`.

## Project structure

```text
.
├── public/images/       # Makerspace hero and showcase assets
├── src/
│   ├── App.jsx          # Page content, interactions, and WhatsApp request flow
│   ├── App.css          # Industrial design system and responsive styling
│   ├── index.css        # Global reset and typography base
│   └── main.jsx         # React entry point
├── package.json
└── vite.config.js
```

## WhatsApp configuration

The current admin number is defined near the top of [`src/App.jsx`](src/App.jsx):

```js
const WHATSAPP_NUMBER = '6283802436288';
```

Use the international number format without `+`, spaces, or dashes when changing it.

## Roadmap

- [ ] Persistent booking records and availability management
- [ ] Admin dashboard for confirming, rescheduling, and cancelling requests
- [ ] Authentication and member profiles
- [ ] Payment gateway and transaction reconciliation
- [ ] Digital K3 credentials and location check-in
- [ ] Project portfolio submissions and community-channel invitations

## Contributing

The `main` branch is protected. Create a feature branch, open a pull request, and request a review before merging.

```bash
git checkout -b feat/your-change
git commit -am "Describe your change"
git push origin feat/your-change
```

Please keep the language welcoming, accurate to the current operation, and accessible for first-time makers.

## Community & Contact
 
- Reservations & Admin inquiries: [IDN Makerspace via WhatsApp](https://wa.me/6283802436288)
- Discord Community: [Join our Discord server](https://discord.gg/vwmCHN78H)
- GitHub Organization: [github.com/idnmakerspace-lab](https://github.com/idnmakerspace-lab)
- Instagram: [@idnmakerspace](https://www.instagram.com/idnmakerspace)
- TikTok: [@idn_makerspace](https://www.tiktok.com/@idn_makerspace)
- YouTube: [@idnmakerspace](https://www.youtube.com/@idnmakerspace)

---

Built for makers who turn ideas into tangible experiments.
