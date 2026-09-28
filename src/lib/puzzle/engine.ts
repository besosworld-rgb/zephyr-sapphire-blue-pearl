export const BOARD_W = 1200;
export const BOARD_H = 900;

export type Piece = {
  id: number;
  row: number;
  col: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
  pathD: string;
  path: Path2D;
  nativeCellW: number;
  nativeCellH: number;
  srcX: number;
  srcY: number;
  rotation: number;
  x: number;
  y: number;
  snapped: boolean;
  z: number;
  isEdge: boolean;
  sprite: HTMLCanvasElement;
  pop: number;
};

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateJigsawPath(
  w: number,
  h: number,
  top: number,
  right: number,
  bottom: number,
  left: number,
) {
  let path = `M 0 0 `;

  if (top === 0) {
    path += `L ${w} 0 `;
  } else {
    const tabDepth = h * 0.22 * -top;
    const tabWidth = w * 0.28;
    const midX = w * 0.5;
    path += `L ${midX - tabWidth} 0 `;
    path += `C ${midX - tabWidth * 0.7} ${tabDepth * 0.2}, ${midX - tabWidth * 0.85} ${tabDepth}, ${midX} ${tabDepth} `;
    path += `C ${midX + tabWidth * 0.85} ${tabDepth}, ${midX + tabWidth * 0.7} ${tabDepth * 0.2}, ${midX + tabWidth} 0 `;
    path += `L ${w} 0 `;
  }

  if (right === 0) {
    path += `L ${w} ${h} `;
  } else {
    const tabDepth = w * 0.22 * right;
    const tabHeight = h * 0.28;
    const midY = h * 0.5;
    path += `L ${w} ${midY - tabHeight} `;
    path += `C ${w + tabDepth * 0.2} ${midY - tabHeight * 0.7}, ${w + tabDepth} ${midY - tabHeight * 0.85}, ${w + tabDepth} ${midY} `;
    path += `C ${w + tabDepth} ${midY + tabHeight * 0.85}, ${w + tabDepth * 0.2} ${midY + tabHeight * 0.7}, ${w} ${midY + tabHeight} `;
    path += `L ${w} ${h} `;
  }

  if (bottom === 0) {
    path += `L 0 ${h} `;
  } else {
    const tabDepth = h * 0.22 * bottom;
    const tabWidth = w * 0.28;
    const midX = w * 0.5;
    path += `L ${midX + tabWidth} ${h} `;
    path += `C ${midX + tabWidth * 0.7} ${h + tabDepth * 0.2}, ${midX + tabWidth * 0.85} ${h + tabDepth}, ${midX} ${tabDepth + h} `;
    path += `C ${midX - tabWidth * 0.85} ${h + tabDepth}, ${midX - tabWidth * 0.7} ${h + tabDepth * 0.2}, ${midX - tabWidth} ${h} `;
    path += `L 0 ${h} `;
  }

  if (left === 0) {
    path += `L 0 0 Z`;
  } else {
    const tabDepth = w * 0.22 * -left;
    const tabHeight = h * 0.28;
    const midY = h * 0.5;
    path += `L 0 ${midY + tabHeight} `;
    path += `C ${tabDepth * 0.2} ${midY + tabHeight * 0.7}, ${tabDepth} ${midY + tabHeight * 0.85}, ${tabDepth} ${midY} `;
    path += `C ${tabDepth} ${midY - tabHeight * 0.85}, ${tabDepth * 0.2} ${midY - tabHeight * 0.7}, 0 ${midY - tabHeight} `;
    path += `L 0 0 Z`;
  }

  return path;
}

export function buildPieces(
  img: HTMLImageElement,
  cols: number,
  rows: number,
  rng: () => number,
): Piece[] {
  const nativeW = img.naturalWidth || img.width;
  const nativeH = img.naturalHeight || img.height;
  const nativeCellW = nativeW / cols;
  const nativeCellH = nativeH / rows;

  const hEdges: number[][] = [];
  for (let r = 0; r < rows; r++) {
    hEdges[r] = [];
    for (let c = 0; c < cols - 1; c++) {
      hEdges[r][c] = rng() > 0.5 ? 1 : -1;
    }
  }
  const vEdges: number[][] = [];
  for (let r = 0; r < rows - 1; r++) {
    vEdges[r] = [];
    for (let c = 0; c < cols; c++) {
      vEdges[r][c] = rng() > 0.5 ? 1 : -1;
    }
  }

  const rots = [90, 180, 270, 90, 180, 270, 0];
  const pieces: Piece[] = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const top = r === 0 ? 0 : -vEdges[r - 1][c];
      const bottom = r === rows - 1 ? 0 : vEdges[r][c];
      const left = c === 0 ? 0 : -hEdges[r][c - 1];
      const right = c === cols - 1 ? 0 : hEdges[r][c];
      const pathD = generateJigsawPath(nativeCellW, nativeCellH, top, right, bottom, left);
      const piece: Piece = {
        id: idx,
        row: r,
        col: c,
        top,
        right,
        bottom,
        left,
        pathD,
        path: new Path2D(pathD),
        nativeCellW,
        nativeCellH,
        srcX: c * nativeCellW,
        srcY: r * nativeCellH,
        rotation: rots[Math.floor(rng() * rots.length)] ?? 90,
        x: 0,
        y: 0,
        snapped: false,
        z: idx,
        isEdge: top === 0 || right === 0 || bottom === 0 || left === 0,
        sprite: document.createElement("canvas"),
        pop: 1,
      };
      piece.sprite = renderSprite(img, piece, nativeW, nativeH);
      pieces.push(piece);
      idx++;
    }
  }
  return pieces;
}

function renderSprite(
  img: HTMLImageElement,
  p: Piece,
  nativeW: number,
  nativeH: number,
) {
  const padX = p.nativeCellW * 0.36;
  const padY = p.nativeCellH * 0.36;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(2, Math.ceil(p.nativeCellW + padX * 2));
  canvas.height = Math.max(2, Math.ceil(p.nativeCellH + padY * 2));
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.translate(padX, padY);
  ctx.save();
  ctx.clip(p.path);
  ctx.drawImage(img, -p.srcX, -p.srcY, nativeW, nativeH);
  ctx.restore();
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(255,255,255,0.38)";
  ctx.lineWidth = Math.max(1.2, p.nativeCellW * 0.008);
  ctx.stroke(p.path);
  ctx.strokeStyle = "rgba(12,12,13,0.38)";
  ctx.lineWidth = Math.max(0.7, p.nativeCellW * 0.004);
  ctx.stroke(p.path);
  return canvas;
}

export function layoutPieces(
  pieces: Piece[],
  boardX: number,
  boardY: number,
  cellW: number,
  cellH: number,
  rng: () => number,
) {
  const spacing = Math.max(cellW, cellH) * 1.24;
  const free = pieces.filter((p) => !p.snapped);
  for (let i = free.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = free[i]!;
    free[i] = free[j]!;
    free[j] = tmp;
  }

  const sideSlots = Math.max(2, Math.min(Math.floor(BOARD_H / spacing), Math.ceil(free.length * 0.22)));
  const sideTotal = Math.min(free.length, sideSlots * 2);
  const perSide = Math.floor(sideTotal / 2);
  const bottomCount = free.length - perSide * 2;
  const jitter = () => (rng() - 0.5) * spacing * 0.16;

  let i = 0;
  for (let k = 0; k < perSide; k++) {
    const p = free[i++]!;
    p.x = boardX - spacing * 0.62 + jitter() * 0.4;
    p.y = boardY + spacing * 0.35 + k * spacing + jitter();
    p.z = i;
  }
  for (let k = 0; k < perSide; k++) {
    const p = free[i++]!;
    p.x = boardX + BOARD_W + spacing * 0.62 + jitter() * 0.4;
    p.y = boardY + spacing * 0.35 + k * spacing + jitter();
    p.z = i;
  }

  const bottomCols = Math.max(3, Math.min(8, Math.ceil(Math.sqrt(bottomCount * 1.8))));
  const startY = boardY + BOARD_H + spacing * 0.62;
  const startX = boardX + BOARD_W / 2 - ((Math.min(bottomCount, bottomCols) - 1) * spacing) / 2;
  let b = 0;
  while (i < free.length) {
    const p = free[i++]!;
    const c = b % bottomCols;
    const r = Math.floor(b / bottomCols);
    const rowCount = Math.min(bottomCols, bottomCount - r * bottomCols);
    const rowShift = ((bottomCols - rowCount) * spacing) / 2;
    p.x = startX + rowShift + c * spacing + jitter();
    p.y = startY + r * spacing + jitter();
    p.z = i;
    b++;
  }

  return {
    wellBottom: startY + Math.ceil(bottomCount / bottomCols) * spacing,
    wellRight: boardX + BOARD_W + spacing,
  };
}

let hitCtx: CanvasRenderingContext2D | null = null;
function getHitCtx() {
  if (!hitCtx) {
    const c = document.createElement("canvas");
    hitCtx = c.getContext("2d");
  }
  return hitCtx;
}

export function hitTestPiece(p: Piece, wx: number, wy: number, cellW: number, cellH: number) {
  const ctx = getHitCtx();
  if (!ctx) return false;
  const dx = wx - p.x;
  const dy = wy - p.y;
  const a = (-p.rotation * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const lx = dx * cos - dy * sin;
  const ly = dx * sin + dy * cos;
  const scaleX = p.nativeCellW / cellW;
  const scaleY = p.nativeCellH / cellH;
  const px = (lx + cellW / 2) * scaleX;
  const py = (ly + cellH / 2) * scaleY;
  return ctx.isPointInPath(p.path, px, py);
}

export function cellCenter(
  boardX: number,
  boardY: number,
  cellW: number,
  cellH: number,
  col: number,
  row: number,
) {
  return {
    x: boardX + (col + 0.5) * cellW,
    y: boardY + (row + 0.5) * cellH,
  };
}

export function isUpright(rotation: number) {
  return ((rotation % 360) + 360) % 360 === 0;
}

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  life: number;
  max: number;
  w: number;
  h: number;
  color: string;
};

const PAPER = ["#e8e2d6", "#c5c9d0", "#8a8780", "#d7c4a8", "#9aa8b5", "#f0eee8"];

export function burst(x: number, y: number, n = 18): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 40 + Math.random() * 180;
    const max = 0.45 + Math.random() * 0.55;
    out.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 40,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 8,
      life: max,
      max,
      w: 4 + Math.random() * 8,
      h: 3 + Math.random() * 6,
      color: PAPER[i % PAPER.length]!,
    });
  }
  return out;
}

export function confettiBurst(x: number, y: number, n = 90): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
    const sp = 80 + Math.random() * 280;
    const max = 1.1 + Math.random() * 1.4;
    out.push({
      x: x + (Math.random() - 0.5) * 80,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 10,
      life: max,
      max,
      w: 5 + Math.random() * 10,
      h: 3 + Math.random() * 7,
      color: PAPER[i % PAPER.length]!,
    });
  }
  return out;
}
