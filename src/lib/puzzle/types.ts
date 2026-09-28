export type HudSnapshot = {
  remaining: number;
  total: number;
  elapsed: number;
  selected: boolean;
  rotation: number;
  upright: boolean;
  complete: boolean;
  ghost: boolean;
  edges: boolean;
  sound: boolean;
  pieceId: number | null;
};

export type PuzzleHandle = {
  rotate: (deg: number) => void;
  hint: () => void;
  toggleGhost: () => void;
  toggleEdges: () => void;
  toggleSound: () => void;
  fit: () => void;
  locate: () => void;
  restart: () => void;
  peek: (on: boolean) => void;
};
