import {audit,scopedCases} from './model.js';

export const DEMO_CANDIDATE='ADM-0001';
export const DOCUMENTS=[{id:'identity',name:'Identitas calon mahasiswa'},{id:'graduation',name:'Dokumen kelulusan'}];
export const ACCEPTED=['Diterima','Daftar ulang selesai','Aktif'];
export const REGISTERED=['Daftar ulang selesai','Aktif'];
export const OPEN_TASKS=['Perlu tindakan','Perlu perbaikan','Menunggu verifikasi'];

/** Add versioned demo fields while preserving earlier work on this browser. */
export function hydrate(s){
  if(!s||!Array.isArray(s.cases)||!s.cases.some(c=>c.id===DEMO_CANDIDATE))throw Error('Data latihan tidak lengkap.');
  const migrating=!s.workflowVersion;
  s.workflowVersion=2;s.actionPlans??=[];s.chats??={student:[],staff:[],public:[]};
  for(const c of s.cases){
    if(migrating){c.personId??='DEMO-PERSON-'+c.id;c.route??=Number(c.id.slice(-1))%2?'Reguler':'Mandiri';}
    c.lastFollowup??=null;c.history??=[];
    if(!c.requirements){
      c.requirements=DOCUMENTS.map(d=>({...d,status:REGISTERED.includes(c.source)?'Selesai':c.status==='Menunggu verifikasi'?'Menunggu verifikasi':c.status==='Perlu perbaikan'?(d.id==='identity'?'Selesai':'Perlu perbaikan'):'Perlu tindakan',applicable:ACCEPTED.includes(c.source),deadline:c.deadline,reason:c.status==='Perlu perbaikan'&&d.id==='graduation'?(c.reason||'Foto ijazah belum terbaca. Unggah ulang dokumen yang lebih jelas.'):'',reasonCode:c.status==='Perlu perbaikan'&&d.id==='graduation'&&!c.reason?'unreadable':null,history:[],file:c.documents?.[0]||null}));
      for(const r of c.requirements){if(r.status==='Perlu perbaikan')r.history.push({actor:'Petugas',time:s.updatedAt,status:r.status,reason:r.reason,reasonCode:r.reasonCode});}
    }
    if(!c.lastFollowup){const prior=c.requirements.flatMap(r=>r.history).filter(h=>h.actor==='Petugas').sort((a,b)=>new Date(b.time)-new Date(a.time))[0];if(prior)c.lastFollowup=prior.time;}
  }
  for(const t of s.tickets){t.owner??=s.cases.find(c=>c.id===t.caseId)?.owner!=='Belum ditugaskan'?s.cases.find(c=>c.id===t.caseId)?.owner:'Koordinator layanan';t.owner||='Koordinator layanan';t.unit??='Unit penerimaan';}
  return s;
}

export function scope(s,f={}){return scopedCases(s,f);}
export function uniquePeople(rows){return rows.every(c=>!!c.personId)?new Set(rows.map(c=>c.personId)).size:null;}
export function openRequirements(c){return (c.requirements||[]).filter(r=>r.applicable&&['Perlu tindakan','Perlu perbaikan'].includes(r.status));}
export function taskOpen(c){return OPEN_TASKS.includes(c.status)&&ACCEPTED.includes(c.source);}
export function metricCases(s,f,key){
  const rows=scope(s,f);
  if(key==='accepted')return rows.filter(c=>ACCEPTED.includes(c.source));
  if(key==='registered')return rows.filter(c=>REGISTERED.includes(c.source));
  if(key==='active')return rows.filter(c=>c.source==='Aktif');
  if(key==='open')return rows.filter(taskOpen);
  if(key==='review')return rows.filter(c=>c.status==='Menunggu verifikasi'||c.requirements?.some(r=>r.applicable&&r.status==='Menunggu verifikasi'));
  if(key==='overdue')return rows.filter(c=>openRequirements(c).length&&c.deadline&&new Date(c.deadline)<new Date(s.now));
  if(key==='tickets'){const ids=new Set(s.tickets.filter(t=>t.status!=='Selesai').map(t=>t.caseId));return rows.filter(c=>ids.has(c.id));}
  return rows;
}
export function filteredWorkCases(s,f){return metricCases(s,f,f.metric);}
export function summary(s,f={}){
  const rows=scope(s,f),ids=new Set(rows.map(c=>c.id));
  const counts={total:rows.length,accepted:metricCases(s,f,'accepted').length,registered:metricCases(s,f,'registered').length,active:metricCases(s,f,'active').length,final:rows.filter(c=>['Diterima','Ditolak','Daftar ulang selesai','Aktif'].includes(c.source)).length};
  const tiles=[['total','Pendaftar unik'],['accepted','Dinyatakan diterima'],['registered','Daftar ulang selesai'],['active','Mahasiswa aktif'],['open','Kewajiban terbuka']].map(([id,title])=>{const cases=metricCases(s,f,id);return {id,title,value:uniquePeople(cases),applications:cases.length};});
  const tickets=s.tickets.filter(t=>ids.has(t.caseId)&&t.status!=='Selesai');
  tiles.push({id:'tickets',title:'Tiket belum selesai',value:tickets.length,applications:metricCases(s,f,'tickets').length,unit:'tiket'});
  const accepted=metricCases(s,f,'accepted');
  return {rows,counts,tiles,tickets,people:uniquePeople(rows),ongoing:accepted.filter(c=>!REGISTERED.includes(c.source)&&(!c.deadline||new Date(c.deadline)>=new Date(s.now))).length,passed:accepted.filter(c=>!REGISTERED.includes(c.source)&&c.deadline&&new Date(c.deadline)<new Date(s.now)).length};
}

function stopScheduled(s,caseId,requirementId){for(const r of s.reminders){if(r.caseId===caseId&&r.status==='Dijadwalkan'&&(!requirementId||!r.requirementId||r.requirementId===requirementId))r.status='Dibatalkan';}}
function syncTask(c){
  const rs=c.requirements.filter(r=>r.applicable);
  if(!rs.length)return;
  c.status=rs.some(r=>r.status==='Perlu perbaikan')?'Perlu perbaikan':rs.some(r=>r.status==='Perlu tindakan')?'Perlu tindakan':rs.some(r=>r.status==='Menunggu verifikasi')?'Menunggu verifikasi':'Selesai';
  c.reason=rs.filter(r=>r.status==='Perlu perbaikan').map(r=>`${r.name}: ${r.reason}`).join(' ');
}
function documentEvent(s,c,r,actor,reason=''){const entry={actor,time:s.now,status:r.status,reason,file:r.file?{...r.file}:null,reasonCode:r.reasonCode||null};r.history.unshift(entry);c.history.unshift({...entry,requirement:r.name});audit(s,actor,c.id,r.name,null,r.status);}
export function submitRequirement(s,caseId,requirementId,file,viewerId=DEMO_CANDIDATE){
  if(viewerId!==DEMO_CANDIDATE||caseId!==viewerId)throw Error('Pengajuan hanya untuk pendaftaran demo milikmu.');
  const c=s.cases.find(c=>c.id===caseId),r=c?.requirements.find(r=>r.id===requirementId);
  if(!r||!r.applicable||!['Perlu tindakan','Perlu perbaikan'].includes(r.status)||c.source!=='Diterima'||c.stage!==2)throw Error('Dokumen belum dapat diajukan.');
  if(!file?.name||file.size<=0||file.size>5*1024*1024)throw Error('Pilih berkas valid dengan ukuran maksimum 5 MB.');
  r.file={name:file.name,size:file.size,type:file.type};r.status='Menunggu verifikasi';r.reason='';r.reasonCode=null;
  documentEvent(s,c,r,'Calon mahasiswa');syncTask(c);c.documents=c.requirements.filter(r=>r.file).map(r=>r.file);stopScheduled(s,caseId,requirementId);
  return r;
}
export function reviewRequirement(s,caseId,requirementId,decision,reason='',reasonCode='',actor='Petugas'){
  if(actor!=='Petugas')throw Error('Pemeriksaan memerlukan petugas.');
  const c=s.cases.find(c=>c.id===caseId),r=c?.requirements.find(r=>r.id===requirementId);
  if(!r||r.status!=='Menunggu verifikasi'||!['Selesai','Perlu perbaikan'].includes(decision))throw Error('Pengajuan tidak dapat diperiksa.');
  if(decision==='Perlu perbaikan'&&reason.trim().length<5)throw Error('Alasan perbaikan wajib diisi.');
  r.status=decision;r.reason=decision==='Perlu perbaikan'?reason.trim():'';r.reasonCode=decision==='Perlu perbaikan'?reasonCode:null;
  documentEvent(s,c,r,'Petugas',r.reason);syncTask(c);c.lastFollowup=s.now;
  if(c.status==='Selesai'){c.source='Daftar ulang selesai';stopScheduled(s,caseId);}
  return r;
}
export function nextAction(s,caseId=DEMO_CANDIDATE){
  const c=s.cases.find(c=>c.id===caseId);if(!c)return {title:'Pendaftaran belum tersedia',text:'Hubungi petugas untuk memeriksa data.',action:'new-ticket',button:'Minta bantuan'};
  const repair=c.requirements?.filter(r=>r.applicable&&r.status==='Perlu perbaikan')||[];
  if(c.status==='Perlu perbaikan'||repair.length)return {title:'Perbaiki dokumen daftar ulang',text:repair.map(r=>r.reason).filter(Boolean).join(' ')||c.reason||'Baca catatan petugas dan kirim dokumen perbaikan.',action:'goto-journey',button:'Perbaiki Dokumen'};
  if(c.status==='Menunggu verifikasi')return {title:c.stage===3?'Aktivasimu sedang diperiksa':'Dokumenmu sedang diperiksa',text:c.stage===3?'Daftar ulang telah selesai. Petugas sedang memeriksa tahap aktivasi mahasiswa.':'Dokumen telah diterima. Kamu akan mendapat pemberitahuan setelah pemeriksaan selesai.',action:'goto-journey',button:'Lihat hasil pemeriksaan'};
  if(REGISTERED.includes(c.source))return {title:c.source==='Aktif'?'Aktivasi mahasiswa selesai':'Daftar ulangmu sudah selesai',text:c.source==='Aktif'?'Status aktif sudah tercatat pada data simulasi.':'Daftar ulang telah diverifikasi. Jadwal aktivasi berikutnya belum diumumkan.',action:'goto-journey',button:'Lihat perjalanan saya'};
  if(!ACCEPTED.includes(c.source)&&c.source!=='Hasil belum diumumkan')return {title:'Pantau status pendaftaranmu',text:'Persyaratan daftar ulang belum berlaku. Periksa pembaruan resmi atau minta bantuan petugas.',action:'goto-journey',button:'Lihat perjalanan saya'};
  if(c.source==='Hasil belum diumumkan')return {title:'Tunggu pengumuman seleksi',text:'Hasil seleksi belum diumumkan. Daftar ulang belum berlaku untuk pendaftaran ini.',action:'goto-journey',button:'Lihat status pendaftaran'};
  return {title:'Lengkapi persyaratan daftar ulang',text:`${openRequirements(c).length} dokumen masih memerlukan tindakanmu. Kirim dokumen agar petugas dapat melanjutkan pemeriksaan.`,action:'goto-journey',button:'Lihat Persyaratan'};
}
export function journeySteps(c){
  return ['Pendaftaran','Seleksi','Pengumuman','Daftar ulang','Aktivasi mahasiswa'].map((name,i)=>{
    let status='Belum dibuka';
    if(i===0)status='Selesai';
    else if(i===1)status=c.source==='Hasil belum diumumkan'?'Sedang diproses':'Selesai';
    else if(i===2)status=c.source==='Hasil belum diumumkan'?'Belum dibuka':'Selesai';
    else if(i===3)status=REGISTERED.includes(c.source)?'Selesai':ACCEPTED.includes(c.source)?(c.status==='Menunggu verifikasi'?'Sedang diproses':c.status):c.source==='Ditolak'?'Tidak berlaku':'Belum dibuka';
    else status=c.source==='Aktif'?'Selesai':c.stage===3&&c.status==='Menunggu verifikasi'?'Sedang diproses':c.source==='Ditolak'?'Tidak berlaku':'Belum dibuka';
    return {name,status};
  });
}
export function createTicket(s,{caseId=DEMO_CANDIDATE,category,text,conversation=''}){
  if(caseId!==DEMO_CANDIDATE)throw Error('Tiket hanya dapat dibuat untuk akun demo sendiri.');
  if(!text||text.trim().length<10)throw Error('Jelaskan kendala setidaknya 10 karakter.');
  const c=s.cases.find(c=>c.id===caseId);const id='TKT-'+String(Math.max(0,...s.tickets.map(t=>Number(t.id.split('-')[1])||0))+1).padStart(3,'0');
  const t={id,caseId,category,text:text.trim().slice(0,2000),conversation:conversation.slice(0,6000),owner:c.owner==='Belum ditugaskan'?'Koordinator layanan':c.owner,unit:'Unit penerimaan',status:'Baru',created:s.now,messages:[]};
  s.tickets.unshift(t);stopScheduled(s,caseId);audit(s,'Calon mahasiswa',id,'Tiket bantuan dibuat');return t;
}

const dateText=d=>d?new Intl.DateTimeFormat('id-ID',{dateStyle:'long',timeStyle:'short',timeZone:'Asia/Jakarta'}).format(new Date(d))+' WIB':'Jadwal belum diumumkan';
export const CHAT_SUGGESTIONS=['Apa langkah saya berikutnya?','Dokumen apa yang masih kurang?','Kapan batas daftar ulang saya?','Mengapa dokumen saya perlu diperbaiki?','Bagaimana cara menghubungi petugas?'];
export function answerQuestion(s,role,question){
  const q=question.toLowerCase(),c=s.cases.find(c=>c.id===DEMO_CANDIDATE),personal=role==='student';
  const generalSource=`Panduan simulasi ADMIRA v${s.contentVersion}`,personalSource=`Pendaftaran demo ${DEMO_CANDIDATE} dan catatan pemeriksaan`;
  const make=(text,kind='personal',actions=[{label:'Lihat Persyaratan',action:'goto-journey'}])=>({text,kind,source:kind==='personal'?personalSource:generalSource,updatedAt:kind==='personal'?(c.history[0]?.time||s.updatedAt):s.updatedAt,actions});
  const unavailable=text=>make(text,'unavailable',[{label:personal?'Buat Tiket Bantuan':'Lihat panduan',action:personal?'chat-handoff':'guide'}]);
  if(question.match(/ADM-\d+/gi)?.some(id=>id.toUpperCase()!==DEMO_CANDIDATE))return unavailable('Saya hanya dapat menampilkan pendaftaran demo milik pengguna di ruang calon mahasiswa. Data peserta lain tidak ditampilkan.');
  if(/biaya|nominal|tarif|beasiswa|lulus|ditolak|kuota/.test(q))return unavailable('Informasi biaya, bantuan dana, keputusan seleksi, dan kuota resmi belum tersedia di panduan ini. Saya tidak dapat memastikannya.');
  if(/hubungi|petugas|bantuan|kendala|tiket/.test(q)&&!/perbaiki|diperbaiki/.test(q))return make('Buat tiket melalui menu Bantuan. Pilih kategori, jelaskan kendala, dan pantau petugas penanggung jawab serta balasannya. Jam layanan simulasi: Senin–Jumat 08.00–16.00 WIB.','general',[{label:personal?'Buat Tiket Bantuan':'Panduan demo',action:personal?'chat-handoff':'guide'}]);
  if(!personal&&/saya|kurang|dokumen|tenggat|batas|langkah|status|perbaik/.test(q))return unavailable('Untuk pertanyaan tentang pendaftaran pribadi, buka Demo Calon Mahasiswa. Tanpa autentikasi nyata, informasi yang ditampilkan hanya contoh akun Nadia.');
  if(/batas|tenggat|kapan|jadwal/.test(q))return make(c.deadline?`Tenggat daftar ulang pada pendaftaran demo milikmu: ${dateText(c.deadline)}. Ini jadwal simulasi, bukan pengumuman resmi institusi.`:'Jadwal belum diumumkan. Tenggat resmi belum dapat dipastikan; mintalah bantuan petugas.');
  if(/perbaiki|diperbaiki|alasan|buram|terbaca/.test(q)){const rs=c.requirements.filter(r=>r.applicable&&r.status==='Perlu perbaikan');return make(rs.length?rs.map(r=>`${r.name}: ${r.reason}`).join('\n'):'Saat ini tidak ada permintaan perbaikan dokumen. Jangan unggah ulang dokumen yang sedang diperiksa.', 'personal',[{label:rs.length?'Perbaiki Dokumen':'Lihat Persyaratan',action:'goto-journey'}]);}
  if(/dokumen|persyaratan|kurang|berkas/.test(q)){const rs=openRequirements(c);const waiting=c.requirements.filter(r=>r.applicable&&r.status==='Menunggu verifikasi');return make(rs.length?`Yang perlu kamu tindak lanjuti: ${rs.map(r=>r.name+' ('+r.status.toLowerCase()+')').join(', ')}.${waiting.length?' Dokumen lainnya sedang diperiksa; tidak perlu dikirim ulang.':''}`:waiting.length?'Semua dokumen sudah dikirim dan sedang diperiksa. Kamu tidak perlu mengunggah ulang.':'Tidak ada dokumen terbuka pada tahap ini. Daftar ulang sudah diverifikasi.');}
  if(/langkah|berikut|status|sekarang/.test(q)){const a=nextAction(s);return make(a.title+'. '+a.text,'personal',[{label:a.button,action:a.action}]);}
  if(/halo|hai|admira|panduan|cara daftar/.test(q))return make('ADMIRA membantu memantau perjalanan penerimaan, persyaratan, dan bantuan. Ini demo FAQ terstruktur, tanpa integrasi AI. Pilih pertanyaan contoh atau buka panduan.','general',[{label:'Baca panduan',action:'guide'}]);
  return unavailable('Informasi tersebut belum tersedia di panduan yang dimasukkan pengelola. Saya tidak dapat memastikannya. Petugas dapat membantu meninjau pertanyaanmu.');
}

export function recommendations(s,f={}){
  f={year:f.year||'',route:f.route||'',prodi:f.prodi||'',region:f.region||''};
  const data=summary(s,f),rows=data.rows,reqs=rows.flatMap(c=>c.requirements.filter(r=>r.applicable).map(r=>({...r,caseId:c.id})));
  const unreadable=reqs.filter(r=>r.reasonCode==='unreadable'||r.history.some(h=>h.reasonCode==='unreadable'));
  const pending=rows.filter(c=>c.source==='Diterima');
  const groups=[...new Set(rows.map(c=>c.prodi))].map(name=>{const cs=rows.filter(c=>c.prodi===name);return {name,accepted:cs.filter(c=>ACCEPTED.includes(c.source)).length,registered:cs.filter(c=>REGISTERED.includes(c.source)).length};});
  const common={period:f.year||'Semua periode',scope:{year:f.year||'',route:f.route||'',prodi:f.prodi||'',region:f.region||''},source:'Data latihan ADMIRA v'+s.contentVersion,updatedAt:s.updatedAt};
  return [
    {id:'document-quality',title:'Perjelas contoh dokumen yang terbaca',finding:unreadable.length?`${unreadable.length} dokumen memiliki catatan pengembalian karena tidak terbaca.`:'Belum ada alasan dokumen tidak terbaca yang tercatat pada cakupan ini.',evidence:`${unreadable.length}/${reqs.length} kewajiban dokumen. Unit: dokumen; bukan orang.`,numerator:unreadable.length,denominator:reqs.length,target:'Proses unggah dan pemeriksaan dokumen',proposal:'Tinjau catatan pengembalian, siapkan contoh dokumen yang benar, lalu evaluasi kualitas pengajuan berikutnya.',indicator:'Proporsi dokumen dikembalikan karena tidak terbaca, dengan cakupan pemeriksaan yang sama.',limit:'Catatan terbatas tidak membuktikan masalah terjadi pada semua peserta.'},
    {id:'ticket-service',title:'Tinjau kebutuhan layanan bantuan',finding:`${data.tickets.length} tiket belum selesai pada cakupan ini.`,evidence:`${data.tickets.length}/${s.tickets.filter(t=>rows.some(c=>c.id===t.caseId)).length} tiket yang tercatat. Unit: tiket.`,numerator:data.tickets.length,denominator:s.tickets.filter(t=>rows.some(c=>c.id===t.caseId)).length,target:'Antrean bantuan dan penanggung jawab',proposal:'Periksa usia tiket dan kedekatan tenggat. Sesuaikan pembagian petugas setelah kapasitas layanan dikonfirmasi.',indicator:'Jumlah tiket terbuka dan waktu respons pertama dalam jam layanan.',limit:'Jumlah tiket saat ini belum membuktikan penumpukan atau kekurangan petugas.'},
    {id:'registration-followup',title:'Telusuri kewajiban sebelum menyusun pendampingan',finding:`${pending.length} pendaftaran diterima belum tercatat selesai daftar ulang.`,evidence:`${pending.length}/${data.counts.accepted} pendaftaran diterima; ${data.ongoing} masih dalam jadwal/belum memiliki tenggat, ${data.passed} melewati tenggat dan perlu ditinjau.`,numerator:pending.length,denominator:data.counts.accepted,target:'Kewajiban dan kendala pendaftaran diterima',proposal:'Periksa kelengkapan, pengajuan yang menunggu petugas, dan kendala yang dilaporkan. Susun pendampingan sesuai kebutuhan terkonfirmasi.',indicator:'Penyelesaian kewajiban dan daftar ulang terverifikasi pada periode yang sebanding.',limit:'Belum selesai saat periode berjalan tidak berarti gagal daftar ulang.'},
    {id:'program-information',title:'Tinjau informasi dan konsultasi program studi',finding:groups.length?'Perbedaan kelanjutan per prodi perlu ditinjau dalam cakupan yang sama.':'Data prodi belum tersedia pada filter ini.',evidence:groups.map(g=>`${g.name}: ${g.registered}/${g.accepted} diterima telah daftar ulang`).join('; ')||'Belum tersedia.',target:'Informasi prodi dan sesi konsultasi',proposal:'Tinjau kejelasan materi resmi dan pertanyaan peserta. Pertimbangkan konsultasi setelah kebutuhan dikonfirmasi.',indicator:'Pertanyaan terselesaikan dan kelanjutan pendaftaran dengan penyebut serta periode yang sama.',limit:'Kelompok kecil dan periode berjalan tidak cukup untuk menyimpulkan penyebab atau memberi peringkat.'},
    {id:'data-readiness',title:'Lengkapi landasan data sebelum kebijakan nyata',finding:rows.some(c=>!c.personId)?'Sebagian pendaftaran belum memiliki pengenal orang yang terverifikasi.':'Data saat ini merupakan simulasi; sumber operasional final belum terintegrasi.',evidence:`${rows.filter(c=>!c.personId).length}/${rows.length} aplikasi tanpa pengenal orang pada cakupan ini.`,target:'Kamus data, identitas, relasi lima sumber, dan kesegaran sumber',proposal:'Verifikasi kunci, definisi, cakupan tahun, dan pengecualian hubungan. Lakukan rekonsiliasi sebelum menyimpulkan perilaku peserta.',indicator:'Pengenal terverifikasi dan metrik yang dapat ditelusuri ke sumber serta versi.',limit:'Tidak ada konflik identitas yang dikarang. Pemetaan demo tidak membuktikan mutu dataset operasional.'}
  ].map(r=>({...common,...r}));
}
export function saveActionPlan(s,recommendation,{owner,reviewDate,indicator,proposal},actor='Petugas'){
  if(actor!=='Petugas')throw Error('Rencana tindakan memerlukan petugas.');
  if(!owner||!/^\d{4}-\d{2}-\d{2}$/.test(reviewDate)||!indicator?.trim()||!proposal?.trim())throw Error('Lengkapi pelaksana, tanggal evaluasi, tindakan, dan indikator.');
  const existing=s.actionPlans.find(p=>p.recommendationId===recommendation.id&&JSON.stringify(p.scope)===JSON.stringify(recommendation.scope)&&p.status!=='Ditutup');
  if(existing)throw Error('Rencana untuk rekomendasi dan cakupan ini sudah ada. Buka register tindakan.');
  const p={id:crypto.randomUUID(),recommendationId:recommendation.id,title:recommendation.title,scope:{...recommendation.scope},evidence:{finding:recommendation.finding,evidence:recommendation.evidence,source:recommendation.source,updatedAt:recommendation.updatedAt,limit:recommendation.limit},owner,reviewDate,indicator:indicator.trim(),proposal:proposal.trim(),status:'Usulan',result:'',createdAt:s.now,updatedAt:s.now};
  s.actionPlans.unshift(p);audit(s,'Petugas',p.id,'Rencana tindakan dibuat');return p;
}
export function updateActionPlan(s,id,values,actor='Petugas'){
  if(actor!=='Petugas')throw Error('Evaluasi rencana memerlukan petugas.');const p=s.actionPlans.find(p=>p.id===id);if(!p)throw Error('Rencana tidak ditemukan.');
  if(!['Usulan','Disetujui','Berjalan','Dievaluasi','Ditutup'].includes(values.status))throw Error('Status rencana tidak valid.');
  if(['Dievaluasi','Ditutup'].includes(values.status)&&(values.result||'').trim().length<10)throw Error('Catat hasil evaluasi minimal 10 karakter.');
  if(!values.owner||!/^\d{4}-\d{2}-\d{2}$/.test(values.reviewDate))throw Error('Pelaksana dan tanggal evaluasi wajib diisi.');
  const before=p.status;Object.assign(p,{status:values.status,result:(values.result||'').trim(),owner:values.owner,reviewDate:values.reviewDate,updatedAt:s.now});audit(s,'Petugas',p.id,'Evaluasi rencana tindakan',before,p.status);return p;
}
