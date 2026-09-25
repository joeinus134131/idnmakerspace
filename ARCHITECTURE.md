# IDN Maker Space v2 Architecture

Versi awal menggunakan **modular monolith**: satu service dan satu deployment, dengan batas modul yang jelas agar mudah dipisah ketika skala memang membutuhkannya.

## Modul bisnis

- `identity`: registrasi, login, OTP, profil, dan role.
- `membership`: paket, status aktif, masa berlaku, dan renewal.
- `payment`: order, Midtrans Snap, webhook, dan rekonsiliasi.
- `workshop`: katalog event, kapasitas, peserta, dan attendance.
- `equipment`: inventaris, availability, dan booking.
- `content`: learning path, artikel, FAQ, dan project showcase.
- `notification`: adapter email dan WhatsApp.
- `admin`: laporan operasional dan pengelolaan.

Setiap modul memiliki handler, use case, repository interface, dan model sendiri. Komunikasi lintas modul dilakukan melalui use case publik atau domain event in-process, bukan akses tabel lintas modul secara bebas.

```text
Browser
  -> React/Vite frontend
  -> Go/Echo modular monolith API
       -> PostgreSQL
       -> Redis
       -> Midtrans
       -> Resend / WhatsApp
       -> GCS
```

Frontend tetap menggunakan Vite agar refactor cepat dan aman. Migrasi ke Next.js dilakukan saat SSR/ISR dan CMS menjadi prioritas nyata.

## Batas MVP

1. Landing page dan informasi publik.
2. Registrasi, verifikasi, login, dan profil member.
3. Membership dan pembayaran Midtrans.
4. Daftar workshop dan registrasi peserta.
5. Admin dasar untuk member dan workshop.

Booking equipment, blog CMS, showcase, progress learning path, dan sertifikat mengikuti fase setelah MVP sesuai SDD. Payment dan notification adalah kandidat ekstraksi pertama, tetapi hanya ketika membutuhkan scaling, deployment cadence, ownership, atau reliability boundary yang berbeda.
