/**
 * ADAM Protocol cinematic audio engine.
 *
 * All sound effects are synthesized live with the Web Audio API (no assets,
 * instant "preload", respects autoplay because everything is created after the
 * Konami-code user gesture). The voice-over uses the Web Speech API which
 * matches the "slightly synthetic, calm, medium-low" brief.
 *
 * Design goals: calm, intelligent, mysterious, premium, minimal. No harsh or
 * loud effects. Ambient stays well below the voice; every one-shot uses smooth
 * envelopes so there are never clicks/pops.
 */

const MUTE_KEY = 'adcom_adam_muted';

class AdamAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.sfxBus = null;
    this.ambient = null; // { gain, oscs, lfo }
    this.muted = false;
    this._seqToken = 0;
    try {
      this.muted = localStorage.getItem(MUTE_KEY) === '1';
    } catch (e) { /* ignore */ }
    // warm speech voices early
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.getVoices(); } catch (e) { /* ignore */ }
      window.speechSynthesis.onvoiceschanged = () => {
        try { window.speechSynthesis.getVoices(); } catch (e) { /* ignore */ }
      };
    }
  }

  _ensure() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0.0001 : 1;
    this.master.connect(this.ctx.destination);
    this.sfxBus = this.ctx.createGain();
    this.sfxBus.gain.value = 0.9;
    this.sfxBus.connect(this.master);
  }

  /** Call on the Konami gesture so the AudioContext is allowed to run. */
  resume() {
    this._ensure();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    if (window.speechSynthesis) {
      try { window.speechSynthesis.resume(); window.speechSynthesis.getVoices(); } catch (e) { /* ignore */ }
    }
  }

  isMuted() { return this.muted; }

  setMuted(m) {
    this.muted = m;
    try { localStorage.setItem(MUTE_KEY, m ? '1' : '0'); } catch (e) { /* ignore */ }
    if (this.master && this.ctx) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), t);
      this.master.gain.exponentialRampToValueAtTime(m ? 0.0001 : 1, t + 0.25);
    }
    if (m && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    }
  }

  toggleMuted() { this.setMuted(!this.muted); return this.muted; }

  // ---- one-shot synthesis helpers -------------------------------------------

  _tone(freq, { type = 'sine', peak = 0.12, attack = 0.006, hold = 0.05, release = 0.08, when = 0, glideTo = null } = {}) {
    if (this.muted) return;
    this._ensure();
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + attack + hold + release);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    g.gain.setValueAtTime(peak, t0 + attack + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + hold + release);
    osc.connect(g).connect(this.sfxBus);
    osc.start(t0);
    osc.stop(t0 + attack + hold + release + 0.03);
  }

  _noise({ peak = 0.06, dur = 0.12, when = 0, filter = 'bandpass', freq = 1200, q = 1 } = {}) {
    if (this.muted) return;
    this._ensure();
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + when;
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = filter;
    bp.frequency.value = freq;
    bp.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(peak, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp).connect(g).connect(this.sfxBus);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  // ---- named cues ------------------------------------------------------------

  confirmBeep() {
    this._tone(523.25, { type: 'sine', peak: 0.1, hold: 0.04, release: 0.1 });
    this._tone(783.99, { type: 'sine', peak: 0.08, hold: 0.05, release: 0.12, when: 0.09 });
  }

  softConfirm() {
    this._tone(392, { type: 'sine', peak: 0.07, hold: 0.06, release: 0.16 });
    this._tone(587.33, { type: 'sine', peak: 0.05, hold: 0.06, release: 0.2, when: 0.08 });
  }

  glitch(dur = 0.45) {
    if (this.muted) return;
    // a few soft filtered noise stutters — digital, not harsh
    for (let i = 0; i < 4; i += 1) {
      this._noise({ peak: 0.05, dur: 0.05, when: i * (dur / 4), filter: 'bandpass', freq: 600 + Math.random() * 2200, q: 3 });
    }
    this._tone(180, { type: 'sawtooth', peak: 0.04, hold: 0.02, release: 0.12, when: 0, glideTo: 90 });
  }

  uiClick() {
    this._tone(2100, { type: 'square', peak: 0.02, attack: 0.001, hold: 0.004, release: 0.03 });
  }

  processTick() {
    this._tone(1400 + Math.random() * 500, { type: 'square', peak: 0.012, attack: 0.001, hold: 0.003, release: 0.02 });
  }

  scan() {
    this._tone(420, { type: 'sine', peak: 0.05, attack: 0.05, hold: 0.05, release: 0.5, glideTo: 1600 });
    this._noise({ peak: 0.02, dur: 0.5, filter: 'highpass', freq: 3000 });
  }

  pulse() {
    this._tone(140, { type: 'sine', peak: 0.05, attack: 0.02, hold: 0.03, release: 0.3 });
  }

  notification() {
    this._tone(587.33, { type: 'sine', peak: 0.08, hold: 0.05, release: 0.12 });
    this._tone(880, { type: 'sine', peak: 0.07, hold: 0.05, release: 0.14, when: 0.11 });
    this._tone(1174.66, { type: 'sine', peak: 0.06, hold: 0.06, release: 0.22, when: 0.22 });
  }

  keyClick() {
    this._noise({ peak: 0.03, dur: 0.02, filter: 'bandpass', freq: 2600, q: 2 });
    this._tone(1800, { type: 'square', peak: 0.012, attack: 0.001, hold: 0.002, release: 0.015 });
  }

  keyboardInit() {
    for (let i = 0; i < 6; i += 1) {
      setTimeout(() => this.keyClick(), i * 70 + Math.random() * 30);
    }
  }

  // ---- ambient drone ---------------------------------------------------------

  startAmbient(target = 0.05, fade = 2.2) {
    this._ensure();
    if (!this.ctx || this.ambient) return;
    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(target, t + fade);

    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 340;
    lp.Q.value = 0.6;

    const freqs = [55, 82.41, 110]; // A1, ~E2, A2 — an open, calm drone
    const oscs = freqs.map((f, i) => {
      const o = this.ctx.createOscillator();
      o.type = i === 2 ? 'triangle' : 'sine';
      o.frequency.value = f;
      o.detune.value = (i - 1) * 5;
      o.connect(lp);
      return o;
    });

    // very slow movement so the drone feels alive but never busy
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain).connect(g.gain);

    lp.connect(g).connect(this.master);
    oscs.forEach((o) => o.start());
    lfo.start();

    this.ambient = { gain: g, oscs, lfo };
    this._ambientTarget = target;
  }

  setAmbient(level, fade = 0.6) {
    if (!this.ambient || !this.ctx) return;
    const t = this.ctx.currentTime;
    const g = this.ambient.gain.gain;
    g.cancelScheduledValues(t);
    g.setValueAtTime(Math.max(g.value, 0.0001), t);
    g.linearRampToValueAtTime(Math.max(level, 0.0001), t + fade);
    this._ambientTarget = level;
  }

  duckAmbient() { this.setAmbient((this._ambientTarget || 0.05) * 0.6, 0.5); }
  unduckAmbient() { this.setAmbient(this._ambientTarget || 0.05, 0.8); }

  stopAmbient(fade = 2) {
    if (!this.ambient || !this.ctx) return;
    const { gain, oscs, lfo } = this.ambient;
    const t = this.ctx.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), t);
    gain.gain.linearRampToValueAtTime(0.0001, t + fade);
    setTimeout(() => {
      try { oscs.forEach((o) => o.stop()); lfo.stop(); } catch (e) { /* ignore */ }
    }, fade * 1000 + 120);
    this.ambient = null;
  }

  // ---- voice -----------------------------------------------------------------

  _pickVoice() {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || !voices.length) return null;
    const prefs = [
      'Google UK English Male', 'Daniel', 'Microsoft Guy Online', 'Microsoft David',
      'Microsoft Mark', 'Google US English', 'Alex', 'Rishi',
    ];
    for (let i = 0; i < prefs.length; i += 1) {
      const f = voices.find((v) => v.name === prefs[i]);
      if (f) return f;
    }
    return voices.find((v) => /^en(-|_)?/i.test(v.lang)) || voices[0];
  }

  speak(text, { rate = 0.85, pitch = 0.9, volume = 1, onend } = {}) {
    if (this.muted || !window.speechSynthesis) {
      if (onend) setTimeout(onend, 250);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = pitch;
    u.volume = volume;
    u.lang = 'en-US';
    const v = this._pickVoice();
    if (v) u.voice = v;
    if (onend) u.onend = onend;
    window.speechSynthesis.speak(u);
  }

  /** items: [{ text, pauseAfter }] spoken sequentially with pauses.
   *  onLineStart(i) fires as each line begins so the UI can reveal text in
   *  sync with the voice. Falls back to estimated timing when muted / no TTS. */
  speakSequence(items, { onLineStart, onDone } = {}) {
    this._seqToken += 1;
    const token = this._seqToken;
    let i = 0;
    const next = () => {
      if (token !== this._seqToken) return; // cancelled / superseded
      if (i >= items.length) { if (onDone) onDone(); return; }
      const it = items[i];
      const idx = i;
      i += 1;
      if (onLineStart) onLineStart(idx);

      let advanced = false;
      const advance = () => {
        if (advanced || token !== this._seqToken) return;
        advanced = true;
        next();
      };

      if (this.muted || !window.speechSynthesis) {
        const est = Math.max(650, it.text.replace(/\./g, '').length * 55);
        setTimeout(advance, est + (it.pauseAfter || 400));
        return;
      }
      this.speak(it.text, { onend: () => setTimeout(advance, it.pauseAfter || 400) });
      // safety net so the sequence never stalls if onend doesn't fire
      const maxWait = Math.max(1600, it.text.length * 95) + (it.pauseAfter || 400) + 1800;
      setTimeout(advance, maxWait);
    };
    next();
  }

  cancelSequence() {
    this._seqToken += 1;
    this.cancelSpeech();
  }

  cancelSpeech() {
    if (window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    }
  }
}

const adamAudio = new AdamAudio();
export default adamAudio;
