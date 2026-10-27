import {answerMiniQuestion, MINI_CHAT_STARTERS} from './mini-chat-answers.js';

export function installMiniChat() {
  const panel = document.createElement('section');
  panel.id = 'admira-mini-chat';
  panel.className = 'mini-chat';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-labelledby', 'mini-chat-title');
  panel.setAttribute('aria-describedby', 'mini-chat-mode');
  panel.innerHTML = `<header class="mini-chat-head"><span class="mini-chat-avatar" aria-hidden="true">a<span>✦</span></span><div><h2 id="mini-chat-title">Tanya ADMIRA</h2><p id="mini-chat-mode">Asisten otomatis · panduan lokal</p></div><button type="button" class="mini-chat-control" data-mini="reset" aria-label="Mulai percakapan baru" title="Percakapan baru">↺</button><button type="button" class="mini-chat-control" data-mini="close" aria-label="Tutup chatbot" title="Tutup">×</button></header><div class="mini-chat-body"><p class="mini-chat-intro">Ada yang ingin kamu tanyakan?</p><div class="mini-chat-log" role="log" aria-label="Percakapan dengan asisten" aria-live="polite" aria-relevant="additions"></div><div class="mini-chat-suggestions" aria-label="Pilihan pertanyaan"></div></div><form class="mini-chat-form"><label class="mini-chat-sr" for="mini-chat-input">Pertanyaan untuk ADMIRA</label><input id="mini-chat-input" type="text" maxlength="500" autocomplete="off" placeholder="Tulis pertanyaanmu…" required><button type="submit" aria-label="Kirim pertanyaan"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg></button></form><p class="mini-chat-foot">Jawaban sederhana, belum AI generatif.</p>`;
  document.body.append(panel);
  const log = panel.querySelector('.mini-chat-log');
  const body = panel.querySelector('.mini-chat-body');
  const input = panel.querySelector('input');
  const suggestions = panel.querySelector('.mini-chat-suggestions');
  let previousTopic = '', origin = null;

  function addMessage(text, isUser = false) {
    const message = document.createElement('p');
    message.className = 'mini-chat-bubble' + (isUser ? ' mini-chat-user' : '');
    const actor = document.createElement('span');
    actor.className = 'mini-chat-sr';
    actor.textContent = isUser ? 'Kamu: ' : 'ADMIRA: ';
    message.append(actor, document.createTextNode(text));
    log.append(message);
    while (log.children.length > 24) log.firstElementChild.remove();
  }
  function setSuggestions(questions) {
    suggestions.replaceChildren(...questions.map(question => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = question;
      button.addEventListener('click', () => ask(question));
      return button;
    }));
  }
  function reset() {
    previousTopic = '';
    log.replaceChildren();
    addMessage('Halo! Saya bisa bantu menjelaskan ADMIRA dan panduan pendaftaran. Mau tanya apa?');
    setSuggestions(MINI_CHAT_STARTERS);
    input.value = '';
    body.scrollTop = 0;
  }
  function ask(question) {
    const text = question.trim().slice(0, 500);
    if (!text) return;
    const fromSuggestion = suggestions.contains(document.activeElement);
    const reply = answerMiniQuestion(text, previousTopic);
    previousTopic = reply.topic;
    addMessage(text, true);
    addMessage(reply.text);
    setSuggestions(reply.suggestions);
    if (fromSuggestion) suggestions.querySelector('button')?.focus({preventScroll: true});
    input.value = '';
    // Keep the answer visible without forcing the phone keyboard to open.
    body.scrollTop = log.lastElementChild.offsetTop - body.offsetTop - 8;
  }
  function close() {
    panel.hidden = true;
    const target = origin?.isConnected ? origin : document.querySelector('[data-action="chat-open"]');
    target?.focus({preventScroll: true});
  }
  document.addEventListener('click', event => {
    const launcher = event.target.closest('[data-action="chat-open"]');
    if (!launcher) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!panel.hidden) { close(); return; }
    origin = launcher;
    panel.hidden = false;
    if (matchMedia('(min-width: 701px)').matches) input.focus({preventScroll: true});
    else panel.querySelector('[data-mini="close"]').focus({preventScroll: true});
    body.scrollTop = body.scrollHeight;
  }, true);
  panel.querySelector('[data-mini="close"]').addEventListener('click', close);
  panel.querySelector('[data-mini="reset"]').addEventListener('click', () => {reset(); input.focus({preventScroll: true});});
  panel.querySelector('form').addEventListener('submit', event => {event.preventDefault(); ask(input.value); input.focus({preventScroll: true});});
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden && !document.querySelector('#modal-root .modal')) {event.preventDefault(); close();}
  });
  function fitKeyboard() {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
    panel.classList.toggle('mini-chat-keyboard', inset > 120 && window.innerWidth <= 700);
    panel.style.setProperty('--mini-keyboard-inset', inset + 'px');
    panel.style.setProperty('--mini-visible-height', viewport.height + 'px');
  }
  window.visualViewport?.addEventListener('resize', fitKeyboard);
  window.visualViewport?.addEventListener('scroll', fitKeyboard);
  fitKeyboard();
  reset();
}
