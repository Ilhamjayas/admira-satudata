import test from 'node:test';
import assert from 'node:assert/strict';
import {answerMiniQuestion, MINI_CHAT_STARTERS} from '../dist/mini-chat-answers.js';

test('chatbot mengenali pertanyaan umum dan bahasa percakapan tanpa API', () => {
  for (const [question, topic] of [
    ['ADMIRA itu apa?', 'about'], ['gimana cara mulai demo?', 'demo'],
    ['gmn upload berkas?', 'upload'], ['format PDF maksimal berapa MB?', 'formats'],
    ['dokumen apa yang diperlukan?', 'requirements'], ['cara daftar ulang?', 'registration'],
    ['kok dokumen buram harus diperbaiki?', 'repair'], ['apa arti menunggu verifikasi?', 'waiting'],
    ['hubungi petugas soal dokumen gimana?', 'help'], ['pesan sesi klinik', 'clinic'],
    ['cara memilih prodi', 'program']
  ]) assert.equal(answerMiniQuestion(question).topic, topic, question);
  for (const question of MINI_CHAT_STARTERS) assert.ok(answerMiniQuestion(question).topic);
});

test('chatbot menolak memastikan biaya, tenggat, dan status pribadi', () => {
  assert.match(answerMiniQuestion('berapa biaya daftar ulang?').text, /belum tersedia/);
  assert.match(answerMiniQuestion('kapan batas kirim dokumen saya?').text, /belum memiliki jadwal resmi/);
  assert.match(answerMiniQuestion('lihat status ADM-0002').text, /tidak mengakses/);
  assert.match(answerMiniQuestion('apakah saya lulus?').text, /portal resmi/);
});

test('tindak lanjut memakai topik terakhir dan pertanyaan baru mengganti konteks', () => {
  const reply = answerMiniQuestion('cara unggah berkas');
  assert.equal(answerMiniQuestion('jelaskan lagi', reply.topic).topic, 'upload');
  assert.match(answerMiniQuestion('contohnya?', reply.topic).text, /Demo Petugas/);
  assert.equal(answerMiniQuestion('hubungi petugas', reply.topic).topic, 'help');
  assert.equal(answerMiniQuestion('jelaskan lagi', 'topik-tidak-ada').topic, '');
});

test('jawaban di luar panduan, salam, dan identitas bot tidak mengaku AI generatif', () => {
  assert.match(answerMiniQuestion('siapa kamu?').text, /belum AI generatif/);
  assert.match(answerMiniQuestion('halo min').text, /Halo!/);
  assert.match(answerMiniQuestion('makasih ya').text, /Sama-sama/);
  assert.match(answerMiniQuestion('jelaskan teori relativitas').text, /belum punya jawaban/);
  assert.match(answerMiniQuestion(null).text, /Tulis pertanyaanmu/);
  assert.equal(answerMiniQuestion('<img src=x onerror=alert(1)>').topic, '');
});
