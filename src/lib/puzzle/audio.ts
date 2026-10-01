type NoiseKind = "none" | "water" | "wind" | "ember";

type Score = {
  bpm: number;
  rootMidi: number;
  scale: number[];
  padMidi: [number, number, number];
  padType: OscillatorType;
  cutoff: number;
  melody: (number | null)[];
  melodyOctave: number;
  melodyType: OscillatorType;
  melodyGain: number;
  sparkle: boolean;
  noise: NoiseKind;
};

const MUSIC_LEVEL = 0.26;
const SFX_LEVEL = 0.9;
const MASTER_LEVEL = 0.72;

const SCORES: Record<string, Score> = {
  toast: {
    bpm: 66,
    rootMidi: 50,
    scale: [0, 2, 4, 7, 9, 11, 12],
    padMidi: [50, 57, 62],
    padType: "triangle",
    cutoff: 720,
    melody: [0, 2, 4, 2, 4, 6, 4, null, 5, 4, 2, 0, 4, 2, 0, null],
    melodyOctave: 12,
    melodyType: "triangle",
    melodyGain: 0.045,
    sparkle: true,
    noise: "ember",
  },
  harbor: {
    bpm: 52,
    rootMidi: 45,
    scale: [0, 2, 3, 5, 7, 9, 10, 12],
    padMidi: [45, 52, 60],
    padType: "sine",
    cutoff: 480,
    melody: [0, null, 4, 3, 2, null, 5, 4, 7, 5, 4, null, 2, 0, 3, null],
    melodyOctave: 12,
    melodyType: "sine",
    melodyGain: 0.038,
    sparkle: true,
    noise: "water",
  },
  orangerie: {
    bpm: 64,
    rootMidi: 53,
    scale: [0, 2, 4, 6, 7, 9, 11, 12],
    padMidi: [53, 60, 66],
    padType: "triangle",
    cutoff: 980,
    melody: [4, 5, 7, 5, 4, 2, 0, 2, 7, 5, 4, null, 5, 4, 2, null],
    melodyOctave: 12,
    melodyType: "sine",
    melodyGain: 0.04,
    sparkle: true,
    noise: "none",
  },
  alpine: {
    bpm: 48,
    rootMidi: 48,
    scale: [0, 2, 4, 7, 9, 12],
    padMidi: [48, 55, 60],
    padType: "sine",
    cutoff: 540,
    melody: [0, null, 2, null, 4, 2, 0, null, 4, 5, 4, null, 2, 0, null, null],
    melodyOctave: 24,
    melodyType: "sine",
    melodyGain: 0.032,
    sparkle: true,
    noise: "wind",
  },
  library: {
    bpm: 54,
    rootMidi: 46,
    scale: [0, 2, 3, 5, 7, 8, 10, 12],
    padMidi: [46, 53, 58],
    padType: "triangle",
    cutoff: 420,
    melody: [0, 2, 3, 2, 0, null, 4, 3, 5, 4, 3, 2, 0, 2, 3, null],
    melodyOctave: 12,
    melodyType: "triangle",
    melodyGain: 0.036,
    sparkle: false,
    noise: "none",
  },
  kites: {
    bpm: 72,
    rootMidi: 52,
    scale: [0, 2, 4, 5, 7, 9, 11, 12],
    padMidi: [52, 59, 64],
    padType: "triangle",
    cutoff: 880,
    melody: [4, 5, 7, 4, 2, 4, 0, 2, 7, 9, 7, 5, 4, 2, 4, null],
    melodyOctave: 12,
    melodyType: "sine",
    melodyGain: 0.042,
    sparkle: true,
    noise: "wind",
  },
  snow: {
    bpm: 50,
    rootMidi: 57,
    scale: [0, 2, 5, 7, 9, 12],
    padMidi: [45, 52, 57],
    padType: "sine",
    cutoff: 620,
    melody: [4, null, 3, 2, 4, 5, 4, null, 2, 0, 2, 3, 4, 2, 0, null],
    melodyOctave: 12,
    melodyType: "sine",
    melodyGain: 0.04,
    sparkle: true,
    noise: "wind",
  },
  olives: {
    bpm: 60,
    rootMidi: 55,
    scale: [0, 2, 4, 5, 7, 9, 10, 12],
    padMidi: [43, 55, 62],
    padType: "triangle",
    cutoff: 700,
    melody: [0, 2, 4, 5, 4, 2, 0, null, 5, 4, 2, 4, 7, 5, 4, null],
    melodyOctave: 12,
    melodyType: "triangle",
    melodyGain: 0.04,
    sparkle: false,
    noise: "ember",
  },
  studio: {
    bpm: 56,
    rootMidi: 50,
    scale: [0, 2, 3, 5, 7, 9, 10, 12],
    padMidi: [50, 57, 62],
    padType: "sine",
    cutoff: 560,
    melody: [2, 3, 5, 3, 2, 0, 2, null, 5, 7, 5, 3, 2, 3, 0, null],
    melodyOctave: 12,
    melodyType: "triangle",
    melodyGain: 0.035,
    sparkle: false,
    noise: "none",
  },
  court: {
    bpm: 50,
    rootMidi: 57,
    scale: [0, 2, 3, 5, 7, 8, 10, 12],
    padMidi: [45, 52, 60],
    padType: "sine",
    cutoff: 500,
    melody: [0, 3, 5, 3, 7, 5, 3, null, 5, 3, 2, 0, 3, 2, 0, null],
    melodyOctave: 12,
    melodyType: "sine",
    melodyGain: 0.038,
    sparkle: true,
    noise: "water",
  },
  custom: {
    bpm: 58,
    rootMidi: 48,
    scale: [0, 2, 4, 7, 9, 12],
    padMidi: [48, 55, 64],
    padType: "triangle",
    cutoff: 640,
    melody: [0, 2, 4, 2, 4, 5, 4, null, 2, 0, 4, 2, 0, 2, 4, null],
    melodyOctave: 12,
    melodyType: "sine",
    melodyGain: 0.038,
    sparkle: true,
    noise: "none",
  },
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfxBus: GainNode | null = null;
let musicBus: GainNode | null = null;
let enabled = true;
let pendingId: string | null = null;
let activeId: string | null = null;
let voices: AudioScheduledSourceNode[] = [];
let extraNodes: AudioNode[] = [];
let schedulerTimer: number | null = null;
let nextBeat = 0;
let step = 0;
let current: Score | null = null;

function midiHz(n: number) {
  return 440 * 2 ** ((n - 69) / 12);
}

function ensure() {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    sfxBus = ctx.createGain();
    musicBus = ctx.createGain();
    master.gain.value = MASTER_LEVEL;
    sfxBus.gain.value = SFX_LEVEL;
    musicBus.gain.value = 0;
    sfxBus.connect(master);
    musicBus.connect(master);
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function unlockAudio() {
  const ac = ensure();
  if (!ac) return;
  const kick = () => {
    if (pendingId && activeId !== pendingId) beginScore(pendingId);
  };
  if (ac.state === "running") kick();
  else void ac.resume().then(kick);
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (!ctx || !master || !musicBus) return;
  master.gain.setTargetAtTime(on ? MASTER_LEVEL : 0, ctx.currentTime, 0.04);
  if (on && pendingId && activeId !== pendingId) beginScore(pendingId);
}

function duckMusic() {
  if (!ctx || !musicBus || !enabled) return;
  const now = ctx.currentTime;
  musicBus.gain.setTargetAtTime(MUSIC_LEVEL * 0.45, now, 0.03);
  musicBus.gain.setTargetAtTime(MUSIC_LEVEL, now + 0.28, 0.12);
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType,
  gain = 0.18,
  slide?: number,
) {
  if (!enabled) return;
  const ac = ensure();
  if (!ac || !sfxBus) return;
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (slide) osc.frequency.exponentialRampToValueAtTime(slide, now + dur * 0.7);
  g.gain.setValueAtTime(gain, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + dur);
  osc.connect(g);
  g.connect(sfxBus);
  osc.start(now);
  osc.stop(now + dur + 0.02);
  osc.onended = () => {
    osc.disconnect();
    g.disconnect();
  };
}

export function playSnap() {
  const jitter = 0.94 + Math.random() * 0.12;
  tone(523.25 * jitter, 0.12, "triangle", 0.2, 1046.5 * jitter);
  tone(783.99 * jitter, 0.14, "sine", 0.1, 1567 * jitter);
  duckMusic();
}

export function playRotate() {
  tone(340 + Math.random() * 40, 0.06, "sine", 0.1, 560);
}

export function playReject() {
  tone(220, 0.09, "square", 0.05, 160);
}

export function playFanfare() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    setTimeout(() => tone(f, 0.36, "triangle", 0.16), i * 90);
  });
}

export function playPick() {
  tone(880, 0.04, "sine", 0.05, 1200);
}

function noiseBuffer(ac: AudioContext, seconds: number, color: "white" | "brown") {
  const n = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(1, n, ac.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < n; i++) {
    const w = Math.random() * 2 - 1;
    if (color === "brown") {
      last = (last + 0.02 * w) / 1.02;
      data[i] = last * 3.5;
    } else {
      data[i] = w;
    }
  }
  return buf;
}

function startPad(ac: AudioContext, freq: number, type: OscillatorType, gain: number, cutoff: number) {
  if (!musicBus) return;
  const osc1 = ac.createOscillator();
  const osc2 = ac.createOscillator();
  const filter = ac.createBiquadFilter();
  const g = ac.createGain();
  const lfo = ac.createOscillator();
  const lfoG = ac.createGain();
  osc1.type = type;
  osc2.type = type;
  osc1.frequency.value = freq;
  osc2.frequency.value = freq * 1.004;
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  filter.Q.value = 0.65;
  g.gain.value = 0;
  lfo.type = "sine";
  lfo.frequency.value = 0.05 + Math.random() * 0.04;
  lfoG.gain.value = cutoff * 0.22;
  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(g);
  g.connect(musicBus);
  lfo.connect(lfoG);
  lfoG.connect(filter.frequency);
  osc1.start();
  osc2.start();
  lfo.start();
  g.gain.setTargetAtTime(gain, ac.currentTime, 1.4);
  voices.push(osc1, osc2, lfo);
  extraNodes.push(filter, g, lfoG);
}

function startNoise(ac: AudioContext, kind: NoiseKind) {
  if (kind === "none" || !musicBus) return;
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac, 2.5, kind === "ember" ? "brown" : "white");
  src.loop = true;
  const filter = ac.createBiquadFilter();
  const g = ac.createGain();
  if (kind === "water") {
    filter.type = "bandpass";
    filter.frequency.value = 520;
    filter.Q.value = 0.8;
    g.gain.value = 0.035;
  } else if (kind === "wind") {
    filter.type = "bandpass";
    filter.frequency.value = 1100;
    filter.Q.value = 0.55;
    g.gain.value = 0.02;
  } else {
    filter.type = "lowpass";
    filter.frequency.value = 280;
    g.gain.value = 0.018;
  }
  src.connect(filter);
  filter.connect(g);
  g.connect(musicBus);
  src.start();
  voices.push(src);
  extraNodes.push(filter, g);
}

function playMelody(ac: AudioContext, time: number, freq: number, type: OscillatorType, gain: number, dur: number) {
  if (!musicBus) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  const filter = ac.createBiquadFilter();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1400, time);
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(gain, time + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  osc.connect(filter);
  filter.connect(g);
  g.connect(musicBus);
  osc.start(time);
  osc.stop(time + dur + 0.04);
  osc.onended = () => {
    osc.disconnect();
    filter.disconnect();
    g.disconnect();
  };
}

function schedule() {
  if (!ctx || !current) return;
  const beat = 60 / current.bpm / 2;
  const horizon = ctx.currentTime + 0.22;
  while (nextBeat < horizon) {
    const deg = current.melody[step % current.melody.length];
    if (deg != null) {
      const midi = current.rootMidi + current.melodyOctave + (current.scale[deg] ?? 0);
      playMelody(ctx, nextBeat, midiHz(midi), current.melodyType, current.melodyGain, beat * 1.6);
      if (current.sparkle && step % 8 === 3) {
        playMelody(
          ctx,
          nextBeat + beat * 0.5,
          midiHz(midi + 12),
          "sine",
          current.melodyGain * 0.35,
          beat * 1.1,
        );
      }
    }
    nextBeat += beat;
    step += 1;
  }
}

function beginScore(id: string) {
  const ac = ensure();
  if (!ac || !musicBus) return;
  if (ac.state !== "running") return;
  if (activeId === id) return;
  teardownScore(false);
  const score = SCORES[id] ?? SCORES.custom!;
  current = score;
  activeId = id;
  step = 0;
  nextBeat = ac.currentTime + 0.12;
  startPad(ac, midiHz(score.padMidi[0]), score.padType, 0.07, score.cutoff * 0.7);
  startPad(ac, midiHz(score.padMidi[1]), score.padType, 0.05, score.cutoff);
  startPad(ac, midiHz(score.padMidi[2]), "sine", 0.035, score.cutoff * 1.1);
  startNoise(ac, score.noise);
  musicBus.gain.cancelScheduledValues(ac.currentTime);
  musicBus.gain.setTargetAtTime(enabled ? MUSIC_LEVEL : 0, ac.currentTime, 0.8);
  schedule();
  schedulerTimer = window.setInterval(schedule, 100);
}

function teardownScore(fade: boolean) {
  if (schedulerTimer != null) {
    window.clearInterval(schedulerTimer);
    schedulerTimer = null;
  }
  const ac = ctx;
  const when = ac ? ac.currentTime : 0;
  if (fade && musicBus && ac) {
    musicBus.gain.setTargetAtTime(0, when, 0.25);
  }
  for (const v of voices) {
    try {
      v.stop(when + 0.6);
    } catch {
      /* already stopped */
    }
  }
  window.setTimeout(() => {
    for (const v of voices) {
      try {
        v.disconnect();
      } catch {
        /* ignore */
      }
    }
    for (const n of extraNodes) {
      try {
        n.disconnect();
      } catch {
        /* ignore */
      }
    }
    voices = [];
    extraNodes = [];
  }, fade ? 700 : 20);
  current = null;
  activeId = null;
}

export function startScore(id: string) {
  pendingId = id;
  const ac = ensure();
  if (ac && ac.state === "running") beginScore(id);
}

export function stopScore() {
  pendingId = null;
  teardownScore(true);
}

if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", unlockAudio, { once: true });
  window.addEventListener("keydown", unlockAudio, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      const ac = ensure();
      if (ac && pendingId && enabled) beginScore(pendingId);
    }
  });
}