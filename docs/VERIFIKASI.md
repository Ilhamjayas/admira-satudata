# Verifikasi ADMIRA

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
