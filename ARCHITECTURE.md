# IDN Maker Space v2 Architecture

Versi awal menggunakan **modular monolith multi-city**: satu service, satu deployment, dan satu database, dengan batas modul yang jelas serta `location_id` pada setiap data yang spesifik lokasi.

## Modul bisnis

- `identity`: registrasi, login, OTP, profil, dan role.
- `membership`: paket, status aktif, masa berlaku, dan renewal.
- `payment`: order, Midtrans Snap, webhook, dan rekonsiliasi.
- `workshop`: katalog event, kapasitas, peserta, dan attendance.
- `equipment`: inventaris, availability, dan booking.
- `content`: learning path, artikel, FAQ, dan project showcase.
- `notification`: adapter email dan WhatsApp.
- `admin`: laporan operasional dan pengelolaan.
- `location`: lokasi, status operasional, jam buka, kontak, dan konfigurasi cabang.

Setiap modul memiliki handler, use case, repository interface, dan model sendiri. Komunikasi lintas modul dilakukan melalui use case publik atau domain event in-process, bukan akses tabel lintas modul secara bebas. Context lokasi dikirim melalui `?location=jakarta|lampung` atau header `X-Location`, kemudian divalidasi di application layer.

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

Tabel `memberships`, `workshops`, `equipment`, dan `equipment_bookings` menyimpan `location_id`. Membership Jakarta dan waiting list Lampung dapat berjalan dalam deployment yang sama tanpa membuat service per kota.

Frontend tetap menggunakan Vite agar refactor cepat dan aman. Migrasi ke Next.js dilakukan saat SSR/ISR dan CMS menjadi prioritas nyata.

## Batas MVP

1. Landing page dan informasi publik.
2. Registrasi, verifikasi, login, dan profil member.
3. Membership dan pembayaran Midtrans.
4. Daftar workshop dan registrasi peserta.
5. Admin dasar untuk member dan workshop.

Booking equipment, blog CMS, showcase, progress learning path, dan sertifikat mengikuti fase setelah MVP sesuai SDD. Payment dan notification adalah kandidat ekstraksi pertama, tetapi hanya ketika membutuhkan scaling, deployment cadence, ownership, atau reliability boundary yang berbeda.
