import {metrics,scopedCases} from './model.js';

export function renderOverview(k){
  const {state,filters,btn,icon,esc,casesTable,filterbar,fmt}=k;
  const cases=scopedCases(state,{year:filters.year,prodi:filters.prodi,region:filters.region});
  const m=metrics(cases);
  const pending=cases.filter(c=>['Perlu tindakan','Perlu perbaikan'].includes(c.status));
  const review=cases.filter(c=>c.status==='Menunggu verifikasi');
  const ratio=m.accepted?Math.round(m.registered/m.accepted*100):null;
  const counts=[m.total,m.accepted,m.registered,m.active];
  const names=['Pendaftaran','Diterima','Daftar ulang','Mahasiswa aktif'];
  const notes=['Pada cakupan yang dipilih',`${m.final} hasil seleksi final`,`${m.accepted} pendaftaran diterima`,`${m.registered} telah daftar ulang`];
  const tickets=state.tickets.filter(t=>t.status!=='Selesai').length;
  const available=state.sessions.filter(s=>s.status==='Terjadwal'&&new Date(s.date)>new Date(state.now)).reduce((n,s)=>n+Math.max(0,s.capacity-s.bookings.length),0);
  return `
  <div class="report-masthead">
    <div><span class="eyebrow">RUANG PENGELOLA / ADMIRA ${esc(state.module).toUpperCase()}</span><h1>Ikhtisar penerimaan<span class="title-dot">.</span></h1></div>
    <div class="report-meta"><span class="live-mark">Data latihan</span><span>Periode ${esc(filters.year||'2026')} <span class="meta-divider">/</span> ${fmt(state.now,false)}</span></div>
  </div>
  <section class="editorial-hero" aria-label="Ringkasan penerimaan">
    <div class="hero-copy"><span class="hero-kicker"><span></span> SETIAP TAHAP, ADA TINDAK LANJUT.</span>
      <h2>Di balik setiap angka,<br>ada <em>masa depan.</em></h2>
      <p>Jadikan data sebagai awal pendampingan.<br class="desktop-break"> Temukan langkah yang perlu dituntaskan hari ini.</p>
      <div class="hero-actions">${btn('Mulai tindak lanjut','goto-followup','apricot','arrow')}${btn('Ekspor ringkasan','export-summary','hero-secondary','download')}</div>
    </div>
    <figure class="hero-meter" aria-label="${ratio===null?'Rasio daftar ulang belum tersedia':`${m.registered} dari ${m.accepted} pendaftaran diterima telah daftar ulang, ${ratio} persen`}">
      <span class="meter-orbit orbit-one" aria-hidden="true"></span><span class="meter-orbit orbit-two" aria-hidden="true"></span>
      <svg viewBox="0 0 240 240" class="meter-svg" aria-hidden="true"><circle class="meter-track" cx="120" cy="120" r="96"/><circle class="meter-value" cx="120" cy="120" r="96" stroke-dasharray="${ratio===null?0:ratio*6.0319} 603.19"/></svg>
      <div class="meter-label"><span class="meter-eyebrow">KELANJUTAN DAFTAR ULANG</span><strong>${ratio===null?'—':ratio+'<span>%</span>'}</strong><span class="meter-denominator">${m.registered} dari ${m.accepted} diterima</span></div>
      <figcaption><span class="meter-dot"></span> Hasil sementara · simulasi</figcaption>
    </figure>
    <div class="hero-footnote"><span>ADMIRA / PENERIMAAN MAHASISWA</span><span>${icon('shield')} Terhubung dari temuan sampai tindak lanjut</span></div>
  </section>
  <div class="context-bar"><span>${icon('info')} Data simulasi. Identitas, jadwal, dan angka adalah data latihan.</span><span class="context-version">SUMBER LATIHAN / V1.0</span></div>
  <div class="section-heading"><div><span class="section-number">01</span><h2>Perjalanan dalam angka</h2></div><span>Unit: pendaftaran <span class="meta-divider">/</span> Sementara</span></div>
  ${filterbar()}
  <section class="stats stats-editorial" aria-label="Jumlah pada setiap tahap">${names.map((name,i)=>`<article class="stat ${i===3?'active-stat':''}"><div class="stat-top"><span>${name}</span><span class="stat-index">0${i+1}</span></div><div class="stat-number">${counts[i]}<span class="stat-unit">${i===3?icon('leaf'):icon(['users','check','file'][i])}</span></div><div class="stat-foot">${notes[i]}</div><div class="stat-rule"><span style="width:${m.total?counts[i]/m.total*100:0}%"></span></div></article>`).join('')}</section>
  <div class="dashboard-grid editorial-grid">
    <section class="panel pipeline-panel"><div class="panel-head"><div><span class="eyebrow">MEMBACA KELANJUTAN</span><h2>Dari mendaftar, sampai aktif.</h2></div><span class="pill">${esc(filters.year||'Semua tahun')}</span></div>
      ${m.total?`<div class="pipeline-chart">${names.map((name,i)=>`<div class="pipeline-row"><div class="pipeline-label"><span class="pipeline-index">0${i+1}</span><span>${name}</span></div><div class="pipeline-track"><div class="pipeline-bar step-${i}" style="width:${counts[i]/m.total*100}%"></div><strong>${counts[i]}</strong></div><span class="pipeline-percent">${Math.round(counts[i]/m.total*100)}<small>%</small></span></div>`).join('')}</div><div class="pipeline-legend"><span><i></i>Proporsi terhadap ${m.total} pendaftaran pada filter</span><span>Daftar ulang ${m.registered}/${m.accepted} diterima</span></div>`:`<div class="empty"><h3>Belum ada data pada cakupan ini.</h3><p>Ubah filter untuk meninjau pendaftaran lainnya.</p></div>`}
    </section>
    <aside class="insight editorial-insight"><div class="insight-header"><span class="eyebrow">FOKUS TINDAK LANJUT</span><span class="insight-arrow">${icon('arrow')}</span></div><div class="insight-count">${pending.length}<span>pendaftaran<br>perlu tindakan</span></div><h2>${pending.length?'Saatnya hadir<br>untuk mereka.':m.total?'Setiap langkah<br>tetap terpantau.':'Mulai dari<br>cakupan datanya.'}</h2><p>${review.length} pengajuan menunggu pemeriksaan petugas. Tinjau berkas dan kendala sebelum mengirim pengingat.</p>${btn('Buka antrean','goto-followup','','arrow')}</aside>
  </div>
  <div class="section-heading queue-heading"><div><span class="section-number">02</span><h2>Langkah yang menunggu Anda</h2></div><button class="text-btn" data-page="followup">Lihat seluruh antrean ${icon('arrow')}</button></div>
  <section class="panel queue-panel editorial-queue"><div class="panel-head"><div><h2>Prioritas hari ini</h2><p>Diurutkan berdasarkan tenggat. Buka kasus untuk meninjau dan bertindak.</p></div><span class="pill orange">${pending.length+review.length} kasus</span></div>${casesTable([...pending,...review].sort((a,b)=>new Date(a.deadline||'2099-01-01')-new Date(b.deadline||'2099-01-01')),4)}<div class="table-footer"><span>${Math.min(4,pending.length+review.length)} dari ${pending.length+review.length} kasus ditampilkan</span><span>Sumber latihan ADMIRA · v1.0</span></div></section>
  <div class="service-ribbon"><button data-action="tickets"><span class="ribbon-icon">${icon('help')}</span><span><strong>${tickets} tiket terbuka</strong><small>Dengarkan kebutuhan mereka</small></span>${icon('arrow')}</button><button data-page="programs"><span class="ribbon-icon">${icon('calendar')}</span><span><strong>${available} slot konsultasi</strong><small>Hubungkan dengan layanan</small></span>${icon('arrow')}</button><button data-page="data"><span class="ribbon-icon">${icon('data')}</span><span><strong>Data yang dapat ditelusuri</strong><small>Periksa sumber dan versinya</small></span>${icon('arrow')}</button></div>
  <section class="module-showcase"><div><span class="eyebrow">SATU FONDASI. ENAM RUANG TINDAKAN.</span><h2>Pendampingan yang <em>terhubung.</em></h2></div><div class="module-chips">${[['Alur','tasks'],['Akses','users'],['Prodi','book'],['Siklus','refresh'],['Jangkauan','map'],['Mutu Data','data']].map(([name,i])=>`<button data-module="${name}" class="${state.module===name?'selected':''}">${icon(i)}${name}</button>`).join('')}</div></section>`;
}

export function renderStudentHome(k){
  const {state,c,btn,icon,esc,pill,fmt,journeyMarkup}=k;
  const waiting=c.status==='Menunggu verifikasi',done=['Aktif','Daftar ulang selesai'].includes(c.source);
  return `<div class="report-masthead student-masthead"><div><span class="eyebrow">RUANG CALON MAHASISWA / PENERIMAAN ${esc(c.year)}</span><h1>Perjalananmu, Nadia<span class="title-dot">.</span></h1></div><span class="live-mark">Data latihan</span></div>
  <section class="student-editorial-hero"><div class="student-hero-copy"><span class="hero-kicker"><span></span> SETIAP TAHAP, ADA TINDAK LANJUT.</span><h2>Selangkah lebih dekat,<br>dengan <em>masa depanmu.</em></h2><p>Kamu punya tujuan. Kami bantu arahkan langkah berikutnya.</p><div class="student-identity">${icon('book')} ${esc(c.prodi)} <span>•</span> ${esc(c.id)}</div></div><div class="path-art" aria-hidden="true"><div class="path-arch arch-back"></div><div class="path-arch arch-front"></div><span class="path-star">${icon('arrow')}</span><div class="path-caption"><span>LANGKAH</span><strong>0${c.stage+1}</strong><span>${esc(['PENDAFTARAN','HASIL SELEKSI','DAFTAR ULANG','AKTIVASI'][c.stage])}</span></div><span class="path-endpoint"></span></div></section>
  <div class="context-bar"><span>${icon('info')} Ruang simulasi. Jadwal dan persyaratan berikut adalah contoh latihan.</span></div>
  <div class="student-action-grid"><section class="next-step-card"><div class="next-step-top"><span class="eyebrow">LANGKAH BERIKUTNYA UNTUKMU</span>${pill(c.status)}</div><span class="task-category">${waiting?'PENGAJUAN DITERIMA':done?'DAFTAR ULANG TERVERIFIKASI':'KESIAPAN DAFTAR ULANG'}</span><h2>${waiting?'Berkas terkirim.<br>Sedang diperiksa.':done?'Satu tahap selesai.<br>Langkahmu berlanjut.':'Lengkapi berkas.<br class="task-line-break"><span class="desktop-task-tail">Lanjutkan perjalananmu.</span>'}</h2><p>${waiting?'Petugas sedang memeriksa pengajuanmu. Kamu tidak perlu mengunggah ulang selama proses pemeriksaan.':done?'Pengajuanmu telah diverifikasi petugas. Tahap selanjutnya mengikuti pembaruan status resmi.':'Siapkan dokumen yang diperlukan, lalu kirim untuk diperiksa petugas.'}</p><div class="deadline-block"><span class="deadline-icon">${icon('calendar')}</span><span><small>TENGGAT SIMULASI</small><strong>${fmt(c.deadline)}</strong></span></div><div class="actions">${btn(waiting||done?'Lihat perjalanan saya':'Lanjutkan daftar ulang','goto-journey','','arrow')}${btn('Saya butuh bantuan','new-ticket','secondary','help')}</div><p class="task-source">${icon('shield')} Status sumber: ${esc(c.source)} · diperbarui ${fmt(state.updatedAt,false)}</p></section><section class="panel student-journey-panel"><div class="panel-head"><div><span class="eyebrow">DARI AWAL SAMPAI AKTIF</span><h2>Jejak langkahmu</h2></div><button class="text-btn" data-page="journey" aria-label="Lihat rincian perjalanan">${icon('arrow')}</button></div>${journeyMarkup(c)}<div class="journey-note">Setiap penyelesaian menunggu verifikasi resmi.</div></section></div>
  <div class="student-support-grid"><section class="support-editorial"><span class="support-symbol">${icon('users')}</span><div><span class="eyebrow">ADA PENDAMPING DI SETIAP LANGKAH</span><h2>Tak perlu mencari<br>jawabannya sendiri.</h2><p>Pilih klinik yang tersedia atau ceritakan kendalamu melalui tiket bantuan.</p><button class="text-btn" data-page="sessions">Temukan sesi konsultasi ${icon('arrow')}</button></div></section><section class="guide-editorial"><span class="eyebrow">PANDUAN YANG BISA DIBAWA</span><span class="guide-icon">${icon('file')}</span><h2>Lebih siap.<br>Lebih terarah.</h2><p>Simpan checklist dan panduan ringkas untuk menemani prosesmu.</p><button class="text-btn" data-action="print-guide">Unduh panduan cetak ${icon('download')}</button></section></div>`;
}
