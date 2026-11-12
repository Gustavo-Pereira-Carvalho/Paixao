
'use strict';

// CONFIGURAÇÃO DO PROJETO
const CONFIG = {
    audioSrc: 'paixao.mp3',
    skipSeconds: 15
};

const audio = document.getElementById('audio');

const playerScreen = document.getElementById('playerScreen');
const miniPlayer = document.getElementById('miniPlayer');

const playButton = document.getElementById('playButton');
const miniPlay = document.getElementById('miniPlay');

const progress = document.getElementById('progress');
const volume = document.getElementById('volume');

const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');

const miniTime = document.getElementById('miniTime');
const miniDuration = document.getElementById('miniDuration');
const miniProgress = document.getElementById('miniProgress');

const playerNote = document.getElementById('playerNote');

const buttons = [
    document.getElementById('heroListen'),
    document.getElementById('navListen'),
    document.getElementById('closingListen'),
    document.getElementById('miniPlay')
];

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${String(secs).padStart(2, '0')}`;
}

function openPlayer() {
    playerScreen.classList.add('active');
    playerScreen.setAttribute('aria-hidden', 'false');
    miniPlayer.classList.add('visible');

    document.body.style.overflow = 'hidden';

    document.getElementById('closePlayer').focus();
}

function closePlayer() {
    playerScreen.classList.remove('active');
    playerScreen.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';

    document.getElementById('expandPlayer').focus();
}

function updatePlayButtons() {
    const playing = !audio.paused;

    playButton.textContent = playing ? 'Ⅱ' : '▶';
    miniPlay.textContent = playing ? 'Ⅱ' : '▶';

    playButton.setAttribute(
        'aria-label',
        playing ? 'Pausar' : 'Reproduzir'
    );

    miniPlay.setAttribute(
        'aria-label',
        playing ? 'Pausar' : 'Reproduzir'
    );
}

async function togglePlay() {
    if (!CONFIG.audioSrc) {
        playerNote.textContent = 'O áudio estará disponível em breve.';
        return;
    }

    if (audio.paused) {
        try {
            await audio.play();
            playerNote.textContent = 'Aproveite a experiência de escuta.';
        } catch {
            playerNote.textContent = 'Não foi possível reproduzir o áudio. Verifique o arquivo.';
        }
    } else {
        audio.pause();
    }

    updatePlayButtons();
}

// Abrir experiência
buttons.slice(0, 3).forEach(button => {
    button.addEventListener('click', openPlayer);
});

document.getElementById('expandPlayer')
    .addEventListener('click', openPlayer);

document.getElementById('closePlayer')
    .addEventListener('click', closePlayer);

// Reprodução
playButton.addEventListener('click', togglePlay);
miniPlay.addEventListener('click', togglePlay);

// Avançar e retroceder
document.getElementById('backward')
    .addEventListener('click', () => {
        audio.currentTime = Math.max(0, audio.currentTime - CONFIG.skipSeconds);
    });

document.getElementById('forward')
    .addEventListener('click', () => {
        audio.currentTime = Math.min(
            audio.duration || 0,
            audio.currentTime + CONFIG.skipSeconds
        );
    });

// Barra de progresso
progress.addEventListener('input', () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = (Number(progress.value) / 100) * audio.duration;
    }
});

// Volume
volume.addEventListener('input', () => {
    audio.volume = Number(volume.value);
});

// Atualização do player
audio.addEventListener('loadedmetadata', () => {
    const total = formatTime(audio.duration);

    duration.textContent = total;
    miniDuration.textContent = total;

    playerNote.textContent = 'Pronto para ouvir.';
});

audio.addEventListener('timeupdate', () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

    const percentage = (audio.currentTime / audio.duration) * 100;

    progress.value = percentage;

    currentTime.textContent = formatTime(audio.currentTime);
    miniTime.textContent = formatTime(audio.currentTime);

    miniProgress.style.width = percentage + '%';
});

audio.addEventListener('play', updatePlayButtons);
audio.addEventListener('pause', updatePlayButtons);

audio.addEventListener('ended', () => {
    updatePlayButtons();
    playerNote.textContent = 'Reprodução finalizada.';
});

audio.addEventListener('error', () => {
    playerNote.textContent = 'Não foi possível carregar o áudio. Confira o arquivo paixao.mp3.';
});

// Tecla ESC fecha o player
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && playerScreen.classList.contains('active')) {
        closePlayer();
    }
});

// Configuração inicial
audio.volume = 1;

if (CONFIG.audioSrc) {
    audio.src = CONFIG.audioSrc;
    audio.load();
} else {
    playerNote.textContent = 'O áudio estará disponível em breve.';
}
