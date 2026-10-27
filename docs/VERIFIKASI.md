# Verifikasi ADMIRA

## Pengembangan terpadu v1.2 · 28 Oktober 2026

- 23 pengujian model mencakup regresi fitur lama, migrasi data demo, pemisahan orang/aplikasi, filter jalur, penyebut hasil final, status per dokumen, alasan perbaikan, pembatasan FAQ, tiket dengan ringkasan percakapan, serta snapshot rencana dan validasi hasil evaluasi.
- Browser: landing mengarahkan ke role demo yang dipilih. Halaman tidak menyatakan autentikasi nyata telah tersedia.
- Browser: dua dokumen contoh dikirim; pengajuan berubah menjadi Menunggu verifikasi. Petugas mengesahkan identitas dan meminta perbaikan kelulusan. Alasan yang sama muncul pada dashboard dan Tanya ADMIRA. Pengiriman ulang serta pemeriksaan akhir menghasilkan Daftar ulang selesai.
- Browser: pengalihan Tanya ADMIRA membuat tiket dengan penanggung jawab dan riwayat percakapan. Status tiket terpisah dari status penerimaan.
- Browser: filter Mandiri menghasilkan empat orang/aplikasi pada data demo; angka diterima tiga dibuka ke tiga aplikasi yang sesuai.
- Browser: rekomendasi disimpan dengan pelaksana dan waktu evaluasi. Hasil dicatat sebagai Dievaluasi; dasar awal tetap tersimpan sebagai snapshot.
- Pemeriksaan 40 kombinasi: landing, beranda calon mahasiswa, persyaratan, bantuan, klinik, ringkasan, antrean, evaluasi, data, dan akun pada 360, 390, 768, serta 1366 px. Tidak ditemukan gulir horizontal halaman. Panel rekomendasi juga diperiksa pada 360 px.
- Berkas unggahan uji merupakan gambar sintetis `tests/demo-document.png`; tidak menggunakan identitas atau dokumen calon mahasiswa nyata. File dengan ekstensi dan isi yang tidak cocok ditolak.
- Batas: pengujian ukuran layar adalah emulasi browser, bukan pengujian perangkat fisik. Implementasi masih memakai localStorage, tanpa autentikasi server, AI eksternal, atau pesan eksternal.

## Pembaruan desain editorial v1.1

- Mempertahankan palet hijau gelap `#123E3A`, krem `#F7F5EF`, dan aprikot `#F2B66D`.
- Ringkasan baru menghubungkan pembuka editorial, rasio daftar ulang dari data bersama, empat tahap penerimaan, antrean, dan pintasan layanan.
- Beranda calon mahasiswa memakai panel tindakan aprikot dan perjalanan vertikal. Pada HP, pembuka dipadatkan agar tombol daftar ulang tampil tanpa menggulir layar.
- Sebanyak 52 kombinasi halaman dan ukuran layar diperiksa: enam halaman calon mahasiswa dan tujuh halaman petugas pada lebar 360, 390, 768, dan 1366 px. Tidak ditemukan luapan horizontal halaman.
- Dua belas pengujian model tetap lulus; sintaks modul aplikasi, model, dan tampilan diperiksa.
- Tombol utama petugas diuji sampai membuka detail kasus. Data operasional dan penyimpanan tetap memakai model yang sama.
- Bukti tampilan disimpan pada `docs/screenshots/editorial-laptop.png` dan `docs/screenshots/editorial-hp.png`.

Tanggal pemeriksaan: 27 Oktober 2026. Cakupan: prototipe dengan data simulasi.

## Hasil

- 12 pengujian logika lulus melalui `node --test tests/model.test.mjs`.
- Pemeriksaan sintaks modul aplikasi dan model lulus.
- Browser: tiket dibuat dari ruang calon mahasiswa, terlihat di ruang petugas, dibalas, dan ditutup. Status penerimaan tidak berubah.
- Browser: pengajuan contoh Rizky diverifikasi petugas; status tugas menjadi Selesai dan status sumber menjadi Daftar ulang selesai.
- Browser: pemesanan klinik menaikkan jumlah peserta dari 1 menjadi 2; pembatalan mengembalikannya menjadi 1.
- Browser: kalender tenggat berhasil diunduh sebagai ICS dengan zona waktu UTC yang sesuai tampilan WIB; panduan simulasi berhasil diunduh sebagai HTML siap cetak.
- Browser: 7 halaman petugas dan 8 halaman calon mahasiswa diuji pada viewport 360 × 800. Tidak ditemukan luapan horizontal pada halaman.
- Browser: Ringkasan, Tindak lanjut, Analisis, dan Mutu Data diuji pada 390 × 844, 768 × 1024, serta 1366 × 900. Tidak ditemukan luapan horizontal pada halaman.
- Tampilan laptop menggunakan empat kolom ringkasan dan navigasi samping. HP memakai satu kolom isi, ringkasan dua kolom, daftar kasus, serta navigasi bawah.

## Batas pemeriksaan

Pengujian browser memakai emulasi ukuran layar, bukan perangkat Android/iOS fisik. Perbedaan browser, keyboard virtual, kualitas jaringan nyata, serta pembaca layar masih memerlukan pemeriksaan lanjutan. Uji kapasitas adalah uji model lokal, bukan uji transaksi serentak dari beberapa perangkat. Autentikasi dan keamanan server belum tersedia pada prototipe ini.

Pengujian ini tidak menyatakan seluruh 44 kriteria penerimaan operasional PRD sudah dipenuhi. Rincian fitur dan batas implementasi ada pada README.
