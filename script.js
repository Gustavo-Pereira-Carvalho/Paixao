'use strict';

/* ===== CONFIGURAÇÃO =====
   Para trocar o áudio, altere apenas o caminho abaixo.
   Deixe '' (vazio) para exibir a mensagem "em breve". */
const CONFIG = {
  audioSrc: 'paixao.mp3',
  skipSeconds: 15
};

(() => {
  const $ = (id) => document.getElementById(id);
  const box = $('playerBox'), audio = $('audio'), playBtn = $('play'),
        back = $('back'), fwd = $('fwd'), seek = $('seek'), cur = $('cur'),
        dur = $('dur'), vol = $('vol'), mute = $('mute'), note = $('note');

  document.documentElement.classList.add('js');

  const fmt = (s) => {
    if (!isFinite(s) || s < 0) return '0:00';
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = Math.floor(s % 60);
    return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0');
  };
  const fill = (el) => {
    const max = Number(el.max) || 0;
    el.style.setProperty('--p', (max ? (el.value / max) * 100 : 0) + '%');
  };

  function unavailable() {
    box.classList.add('off');
    note.hidden = false;
    box.querySelectorAll('button, input').forEach((el) => { el.disabled = true; });
  }

  /* ----- Player ----- */
  if (!CONFIG.audioSrc) {
    unavailable();
  } else {
    let dragging = false;
    audio.src = CONFIG.audioSrc;
    audio.addEventListener('error', unavailable);
