let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;

function ensure() {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    master.gain.value = 0.7;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function unlockAudio() {
  ensure();
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (master && ctx) {
    master.gain.setTargetAtTime(on ? 0.7 : 0, ctx.currentTime, 0.03);
  }
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
  if (!ac || !master) return;
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (slide) osc.frequency.exponentialRampToValueAtTime(slide, now + dur * 0.7);
  g.gain.setValueAtTime(gain, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + dur);
  osc.connect(g);
  g.connect(master);
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

if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", unlockAudio, { once: true });
  window.addEventListener("keydown", unlockAudio, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") ensure();
  });
}
