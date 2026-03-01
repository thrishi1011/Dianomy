/* ═══════════════════════════════════════════════════════════
   DIANOMY — Settings / Sounds Module
   Web Audio API sound effects and mute toggle.
   ═══════════════════════════════════════════════════════════ */

const audioCtx = (typeof window !== 'undefined')
    ? new (window.AudioContext || window.webkitAudioContext)()
    : null;

// ── Mute state ──
let _muted = (function () {
    try { return localStorage.getItem('dianomy_muted') === 'true'; }
    catch { return false; }
})();

function isMuted() { return _muted; }

function setMuted(muted) {
    _muted = muted;
    try { localStorage.setItem('dianomy_muted', String(muted)); } catch { }
}

function toggleMute() {
    setMuted(!_muted);
    return _muted;
}

function ensureContext() {
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playTone(frequency, duration, type, volume) {
    type = type || 'sine';
    volume = volume != null ? volume : 0.15;
    if (!audioCtx || _muted) return;
    ensureContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

const sounds = {
    click: function () {
        playTone(800, 0.08, 'sine', 0.1);
        setTimeout(function () { playTone(1000, 0.06, 'sine', 0.08); }, 30);
    },
    success: function () {
        playTone(523, 0.15, 'sine', 0.12);
        setTimeout(function () { playTone(659, 0.15, 'sine', 0.12); }, 100);
        setTimeout(function () { playTone(784, 0.2, 'sine', 0.1); }, 200);
    },
    notification: function () {
        playTone(880, 0.12, 'sine', 0.1);
        setTimeout(function () { playTone(1100, 0.15, 'sine', 0.08); }, 120);
    },
    accept: function () {
        playTone(440, 0.1, 'triangle', 0.12);
        setTimeout(function () { playTone(660, 0.1, 'triangle', 0.12); }, 80);
        setTimeout(function () { playTone(880, 0.15, 'triangle', 0.1); }, 160);
    },
    hover: function () {
        playTone(600, 0.04, 'sine', 0.04);
    },
    error: function () {
        playTone(300, 0.15, 'sawtooth', 0.08);
        setTimeout(function () { playTone(250, 0.2, 'sawtooth', 0.06); }, 100);
    },
    pop: function () {
        playTone(1200, 0.05, 'sine', 0.1);
    },
    whoosh: function () {
        if (!audioCtx || _muted) return;
        ensureContext();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    },
    landing: function () {
        if (!audioCtx || _muted) return;
        ensureContext();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        const noteDelay = 0.12;
        const noteDuration = 0.35;

        notes.forEach(function (freq, i) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            const startTime = audioCtx.currentTime + i * noteDelay;
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.08 - i * 0.012, startTime + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(startTime);
            osc.stop(startTime + noteDuration);
        });

        const pad = audioCtx.createOscillator();
        const padGain = audioCtx.createGain();
        pad.type = 'sine';
        pad.frequency.setValueAtTime(130.81, audioCtx.currentTime);
        padGain.gain.setValueAtTime(0, audioCtx.currentTime);
        padGain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.1);
        padGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
        pad.connect(padGain);
        padGain.connect(audioCtx.destination);
        pad.start();
        pad.stop(audioCtx.currentTime + 0.8);
    }
};
