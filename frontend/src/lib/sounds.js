// Programmatic notification sounds via Web Audio API — no audio files needed
function playTone(type = 'notification') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const note = (freq, startTime, duration, peakGain = 0.07) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    if (type === 'message') {
      // Soft double-ping (like a chat app)
      note(880,  ctx.currentTime,        0.18);
      note(1108, ctx.currentTime + 0.12, 0.22);
    } else {
      // Three-note ascending chime for general notifications
      note(523, ctx.currentTime,        0.22); // C5
      note(659, ctx.currentTime + 0.14, 0.22); // E5
      note(784, ctx.currentTime + 0.28, 0.30); // G5
    }

    setTimeout(() => ctx.close(), 1200);
  } catch {}
}

export { playTone };
