import type { CutId } from "./catalog";

const KEY = "serene.v1";
const SAVE_VERSION = 1;

export type SaveState = {
  version: number;
  best: Record<string, Partial<Record<CutId, number>>>;
  settings: {
    sound: boolean;
    ghost: boolean;
  };
  helpSeen: boolean;
};

const defaults: SaveState = {
  version: SAVE_VERSION,
  best: {},
  settings: { sound: true, ghost: true },
  helpSeen: false,
};

function migrate(raw: Partial<SaveState> | null): SaveState {
  const s: SaveState = {
    ...defaults,
    ...raw,
    settings: { ...defaults.settings, ...raw?.settings },
    best: raw?.best ?? {},
    version: SAVE_VERSION,
  };
  return s;
}

export function loadSave(): SaveState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaults, settings: { ...defaults.settings }, best: {} };
    return migrate(JSON.parse(raw) as Partial<SaveState>);
  } catch {
    return { ...defaults, settings: { ...defaults.settings }, best: {} };
  }
}

export function writeSave(next: SaveState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode / quota */
  }
}

export function recordBest(workId: string, cut: CutId, seconds: number) {
  const save = loadSave();
  const prev = save.best[workId]?.[cut];
  if (prev != null && prev <= seconds) return save;
  save.best[workId] = { ...save.best[workId], [cut]: seconds };
  writeSave(save);
  return save;
}

export function markHelpSeen() {
  const save = loadSave();
  save.helpSeen = true;
  writeSave(save);
}

export function patchSettings(patch: Partial<SaveState["settings"]>) {
  const save = loadSave();
  save.settings = { ...save.settings, ...patch };
  writeSave(save);
  return save;
}
