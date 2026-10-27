# admira-satudata

**ADMIRA · Setiap tahap, ada tindak lanjut.**

Prototipe web responsif berbahasa Indonesia berdasarkan ADMIRA PRD v2.0, 27 Oktober 2026.

## Menjalankan

Memerlukan Node.js. Tidak ada dependensi aplikasi yang perlu diinstal.

```sh
npm run dev
```

Buka http://127.0.0.1:4173. Situs hasil publikasi menggunakan isi folder `dist/`.

```sh
npm run check
npm test
```

## Deploy ke Vercel

Repositori ini memakai halaman statis siap terbit di folder `dist/`. Konfigurasi `vercel.json` menetapkan preset Other, pemeriksaan sintaks sebagai perintah build, dan `dist` sebagai Output Directory.

Hubungkan branch `main` dengan Root Directory pada akar repositori (`.`). Jangan arahkan Root Directory ke `dist`; konfigurasi sudah mengatur folder keluarannya. Setelah perubahan di-push, Vercel dapat menerbitkan ulang melalui integrasi GitHub.

Status Ready hanya menyatakan proses deployment berhasil. Halaman dapat tetap 404 bila Output Directory tidak menunjuk folder yang memuat `index.html`.

## Fitur yang berjalan

- Ruang petugas dan calon mahasiswa dengan data bersama pada browser yang sama.
- Ringkasan alur, filter tahun/prodi/wilayah, pencarian, antrean kasus, penugasan, perubahan tenggat, verifikasi, serta alasan perbaikan.
- Pengajuan berkas contoh dengan validasi format, tanda awal isi berkas, dan batas 5 MB. Hanya metadata disimpan; dokumen tidak diunggah ke server.
- Tiket bantuan, respons, perubahan status, dan pembukaan ulang. Penyelesaian tiket terpisah dari status penerimaan.
- Klinik dengan batas kapasitas, pemesanan, pembatalan, dan pengelolaan status oleh petugas.
- Pengingat simulasi dengan pemeriksaan status, tenggat, tiket, kesegaran sumber, jam tenang WIB, dan batas harian. Tidak ada pesan eksternal terkirim.
- Pemilih enam fokus modul, analisis prodi/wilayah, skenario asumsi aritmetis, register program, serta permintaan pendampingan.
- Pemeriksaan CSV pendaftaran yang dipetakan, dukungan BOM/titik koma/ID dengan nol awal, pelaporan konflik, dan publikasi batch demo terpisah.
- Ekspor agregat, ekspor skenario, serta panduan HTML yang dapat dicetak. Keluaran selalu berlabel simulasi.
- Riwayat aktivitas, penyimpanan lokal, dan pemberitahuan perubahan dari tab lain.
- Navigasi HP, tabel menjadi daftar, fokus keyboard, dialog dengan penahanan fokus dan Escape, serta dukungan pengurangan gerakan.

## Batas prototipe

Semua identitas, jadwal, dan angka adalah data latihan, bukan data universitas atau hasil dataset final. Waktu demo awal: 27 Oktober 2026 pukul 10.00 WIB, dikelola melalui Pengaturan.

Pemilih ruang bukan autentikasi. Penyimpanan menggunakan localStorage browser, bukan basis data. Tidak ada jaminan transaksi bersamaan antarperangkat, pembatasan akses server, penjadwal pesan persisten, pengiriman WhatsApp/email, atau pencadangan operasional. Jangan gunakan data pribadi nyata.

Impor satu tabel yang sudah dipetakan tersedia untuk demonstrasi. Pemetaan lima sumber, rekonsiliasi relasi, serta penggabungan ke ringkasan menunggu dataset dan kamus final. Batch impor terpisah agar tidak bercampur dengan data latihan utama. Mentor, data kapasitas institusi, keputusan pendanaan, integrasi sumber resmi, dan konten prodi terverifikasi belum tersedia.

Permintaan akses dapat diajukan dan ditinjau petugas dalam simulasi; penugasan mentor dan penyaluran bantuan belum diaktifkan. Hasil klinik tidak otomatis mengubah status penerimaan. Versi ini belum memenuhi seluruh persyaratan operasional PRD.

## Pemeriksaan

Pengujian logika mencakup hitungan dan penyebut, pembatasan perubahan status, penghentian pengingat, frekuensi harian, jam tenang, data usang, kapasitas klinik, perubahan asumsi, serta validasi impor. Halaman `/__qa` hanya tersedia melalui server lokal sebagai alat pemeriksaan tata letak dan tidak dipublikasikan di `dist/`.

Font opsional: Instrument Serif dan Manrope melalui Google Fonts, berlisensi SIL Open Font License. Jika jaringan/font tidak tersedia, aplikasi memakai Georgia dan Arial. Tidak ada framework atau aset gambar eksternal yang diwajibkan untuk fungsi dasar.
