// Panduan lokal: tidak membaca profil, dokumen, atau status pendaftaran.
export const MINI_CHAT_STARTERS = ['ADMIRA itu apa?', 'Cara mulai demo', 'Cara unggah berkas', 'Hubungi petugas'];

const topics = [
  {
    id: 'cost', match: /\b(biaya|bayar|pembayaran|tarif|nominal|ukt|beasiswa|uang|lunas)\b/,
    text: 'Informasi biaya, pembayaran, dan beasiswa resmi belum tersedia di panduan ini. Cek pengumuman resmi kampus atau hubungi unit penerimaan untuk nominal dan prosedurnya.',
    more: 'Jangan melakukan pembayaran berdasarkan jawaban chatbot. Gunakan rekening, nominal, dan jadwal yang tercantum di portal resmi kampus.',
    suggestions: ['Hubungi petugas', 'Cara mulai demo']
  },
  {
    id: 'deadline', match: /\b(kapan|jadwal|tenggat|deadline|batas|tanggal|terlambat|telat|terakhir)\b/,
    text: 'Saya belum memiliki jadwal resmi penerimaan. Di demo, tenggat contoh dapat dilihat melalui Langkah saya. Untuk tanggal yang berlaku, ikuti portal atau pengumuman resmi kampus.',
    more: 'Bila tenggat sudah dekat atau terlewat, segera hubungi unit penerimaan. Chatbot tidak dapat memperpanjang tenggat atau memastikan pengajuan terlambat diterima.',
    suggestions: ['Cara daftar ulang', 'Hubungi petugas']
  },
  {
    id: 'repair', match: /\b(perbaiki|perbaikan|diperbaiki|ditolak|buram|terpotong|terbaca|revisi|salah)\b/,
    text: 'Untuk dokumen yang perlu perbaikan, buka Langkah saya dan baca catatan petugas pada persyaratan terkait. Siapkan berkas yang jelas serta sesuai catatan, lalu kirim ulang pada persyaratan tersebut.',
    more: 'Pastikan seluruh halaman terlihat, tulisan terbaca, dan dokumen tidak terpotong. Bila catatannya belum jelas, minta penjelasan melalui menu Bantuan sebelum mengirim ulang.',
    suggestions: ['Format berkas apa?', 'Hubungi petugas']
  },
  {
    id: 'waiting', match: /\b(menunggu|diperiksa|verifikasi|diverifikasi|diproses|lama|pending)\b/,
    text: 'Status Menunggu verifikasi berarti berkas demo sudah dikirim dan menunggu pemeriksaan petugas. Tidak perlu mengunggah ulang selama belum diminta perbaikan. Hasil pemeriksaan dapat dilihat di Langkah saya.',
    more: 'Chatbot tidak dapat mempercepat pemeriksaan atau memastikan waktu selesai. Jika ada kendala atau tenggat dekat, buat tiket melalui menu Bantuan.',
    suggestions: ['Dokumen perlu perbaikan', 'Hubungi petugas']
  },
  {
    id: 'formats', match: /\b(format|ukuran|maksimal|maksimum|pdf|jpg|jpeg|png|mb|besar|kompres)\b/,
    text: 'Pada demo ADMIRA, berkas yang diterima adalah PDF, JPG, atau PNG dengan ukuran maksimum 5 MB per berkas. Pastikan isinya sesuai format, jelas, dan terbaca.',
    more: 'Jika berkas terlalu besar, kurangi ukuran atau resolusinya secukupnya sambil menjaga tulisan tetap terbaca. Hanya metadata berkas contoh yang disimpan pada demo ini.',
    suggestions: ['Cara unggah berkas', 'Dokumen perlu perbaikan']
  },
  {
    id: 'upload', match: /\b(unggah|upload|mengunggah|mengirim|kirim|ngirim|kirimkan)\b/,
    text: 'Caranya: buka Demo Calon Mahasiswa → Langkah saya → pilih persyaratan → pilih berkas contoh → kirim. Setelah dikirim, statusnya menjadi Menunggu verifikasi. Gunakan berkas contoh untuk demonstrasi.',
    more: 'Untuk mencoba pemeriksaan, buka Demo Petugas, pilih kasus calon mahasiswa, lalu tinjau dokumennya. Pengiriman berkas belum berarti daftar ulang selesai; diperlukan hasil verifikasi.',
    suggestions: ['Format berkas apa?', 'Apa arti menunggu verifikasi?']
  },
  {
    id: 'help', match: /\b(petugas|hubungi|menghubungi|kontak|admin|bantuan|kendala|tiket|whatsapp|wa|email|telepon|error|gagal)\b/,
    text: 'Di Demo Calon Mahasiswa, buka Bantuan → Buat Tiket Bantuan. Pilih kategori dan tuliskan kendalamu. Respons serta penanggung jawab dapat dilihat di tiket. Untuk layanan nyata, hubungi kanal resmi kampus.',
    more: 'Tiket di website ini merupakan simulasi dan tidak mengirim pesan ke petugas nyata. Untuk mencoba balasannya, beralih ke Demo Petugas lalu buka tiket terkait.',
    suggestions: ['Cara mulai demo', 'Cara unggah berkas']
  },
  {
    id: 'status', match: /\b(status|lulus|diterima|kelulusan|kuota|hasil|pendaftaran saya|data saya|adm \d+)\b/,
    text: 'Saya tidak mengakses data atau hasil pendaftaran pribadi. Buka Beranda atau Langkah saya untuk melihat contoh status pada demo. Keputusan penerimaan yang nyata harus diperiksa di portal resmi kampus.',
    more: 'Data di ADMIRA ini adalah data latihan. Chatbot tidak bisa menetapkan kelulusan, mengubah status, atau menampilkan data peserta lain.',
    suggestions: ['Cara daftar ulang', 'Hubungi petugas']
  },
  {
    id: 'requirements', match: /\b(dokumen|berkas|syarat|persyaratan|ijazah|identitas|ktp|skl)\b/,
    text: 'Di demo, persyaratan dicontohkan dengan dokumen identitas dan kelulusan. Daftar, status, serta catatan tiap persyaratan ada di Langkah saya. Persyaratan penerimaan resmi tetap mengikuti ketentuan kampus dan jalur pendaftaran.',
    more: 'Periksa setiap persyaratan satu per satu. Dokumen yang sudah menunggu verifikasi tidak perlu dikirim ulang, sedangkan dokumen yang perlu perbaikan harus mengikuti catatan petugas.',
    suggestions: ['Cara unggah berkas', 'Format berkas apa?']
  },
  {
    id: 'registration', match: /\b(daftar|pendaftaran|registrasi|langkah|tahap)\b/,
    text: 'Untuk mencoba alurnya, pilih Demo Calon Mahasiswa lalu buka Langkah saya. Tinjau persyaratan, kirim berkas contoh, dan pantau pemeriksaan. Daftar ulang demo baru selesai setelah seluruh persyaratan yang berlaku diverifikasi petugas.',
    more: 'Di halaman pembuka tersedia juga Demo Petugas untuk mencoba pemeriksaan dan tindak lanjut. Semua alur ini memakai data simulasi, bukan pendaftaran ke kampus sebenarnya.',
    suggestions: ['Dokumen apa yang diperlukan?', 'Cara unggah berkas']
  },
  {
    id: 'clinic', match: /\b(klinik|konsultasi|kegiatan|sesi|booking|pesan|pemesanan)\b/,
    text: 'Buka Klinik & kegiatan di ruang calon mahasiswa untuk melihat sesi simulasi. Pilih sesi yang masih terbuka dan memiliki kursi, lalu lakukan pemesanan. Pemesanan dapat dibatalkan dari halaman yang sama.',
    more: 'Sesi yang penuh, dibatalkan, atau sudah ditutup tidak dapat dipesan. Jadwal pada demo tidak mewakili kegiatan resmi kampus.',
    suggestions: ['Hubungi petugas', 'Cara mulai demo']
  },
  {
    id: 'program', match: /\b(prodi|jurusan|program studi|minat)\b/,
    text: 'Coba menu Jelajahi prodi di ruang calon mahasiswa untuk melihat informasi contoh. Gunakan minat serta informasi resmi program studi sebagai pertimbangan, dan konfirmasi kurikulum maupun ketentuan penerimaan ke kampus.',
    more: 'Chatbot tidak memiliki data peluang lolos atau peringkat program studi. Kamu bisa menggunakan sesi konsultasi untuk mendiskusikan pertanyaan tentang pilihan studi.',
    suggestions: ['Klinik konsultasi', 'Hubungi petugas']
  },
  {
    id: 'demo', match: /\b(demo|mulai|mencoba|coba|login|masuk|akun|pakai|gunakan)\b/,
    text: 'Di halaman pembuka, pilih Coba Demo Calon Mahasiswa untuk melihat perjalanan pendaftaran, atau Coba Demo Petugas untuk melihat ringkasan dan tindak lanjut. Tidak perlu membuat akun untuk mencoba prototipe ini.',
    more: 'Pilihan peran di bagian atas membantu berpindah antara kedua demo. Perubahan data latihan tersimpan pada browser yang sama; ini belum memakai akun atau autentikasi sungguhan.',
    suggestions: ['Cara daftar ulang', 'ADMIRA itu apa?']
  },
  {
    id: 'about', match: /\b(admira|fitur|fungsi|kegunaan|manfaat|website|web|situs)\b/,
    text: 'ADMIRA adalah prototipe pendamping perjalanan penerimaan mahasiswa: memantau tahapan, persyaratan, bantuan, dan tindak lanjut. Pengelola juga dapat meninjau ringkasan, analisis, serta rencana evaluasi dengan data latihan.',
    more: 'Saya adalah asisten otomatis berbasis panduan lokal, belum AI generatif. Saya bisa menjelaskan fitur umum tanpa membaca profil, dokumen, atau percakapan tiketmu.',
    suggestions: ['Cara mulai demo', 'Cara daftar ulang']
  }
];

export function answerMiniQuestion(question, previousTopic = '') {
  const q = String(question ?? '').slice(0, 500).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
  const result = (text, topic = '', suggestions = MINI_CHAT_STARTERS) => ({text, topic, suggestions});
  if (!q) return result('Tulis pertanyaanmu atau pilih salah satu topik di bawah.');
  if (/^(siapa kamu|kamu siapa|kamu ai|ini ai|apa ini ai|apakah ini ai|apakah kamu ai|apa itu chatbot)$/.test(q)) return result('Saya asisten otomatis ADMIRA berbasis panduan lokal, belum AI generatif. Saya menjawab topik yang sudah disiapkan tanpa API key dan tanpa mengakses data pendaftaranmu.', 'about');
  if (/^(terima kasih|makasih|makasi|thanks|thank you|oke|ok|sip|baik)( ya| banyak| min)?$/.test(q)) return result('Sama-sama! Kalau ada yang ingin ditanyakan lagi, saya siap membantu.');
  if (/^(halo|hai|hi|hello|pagi|siang|sore|malam|assalamualaikum)( min| admin| kak)?$/.test(q)) return result('Halo! Saya bisa membantu menjelaskan ADMIRA, cara mencoba demo, dan panduan pendaftaran. Mau mulai dari mana?');
  if (/^(terus|lalu|selanjutnya|caranya|gimana caranya|bagaimana caranya|contohnya|lebih jelas|jelaskan lagi|jelasin lagi)( dong| ya)?$/.test(q)) {
    const previous = topics.find(t => t.id === previousTopic);
    if (previous) return result(previous.more, previous.id, previous.suggestions);
  }
  const topic = topics.find(t => t.match.test(q));
  if (topic) return result(topic.text, topic.id, topic.suggestions);
  return result('Saya belum punya jawaban untuk pertanyaan itu. Saat ini saya memahami panduan umum ADMIRA, dokumen, daftar ulang, dan bantuan. Coba tulis topiknya lebih spesifik atau pilih pertanyaan di bawah.');
}
