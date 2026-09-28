import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  BOARD_H,
  BOARD_W,
  buildPieces,
  burst,
  cellCenter,
  confettiBurst,
  hitTestPiece,
  isUpright,
  layoutPieces,
  mulberry32,
  type Particle,
  type Piece,
} from "@/lib/puzzle/engine";
import {
  playFanfare,
  playPick,
  playReject,
  playRotate,
  playSnap,
  setSoundEnabled,
  unlockAudio,
} from "@/lib/puzzle/audio";
import type { HudSnapshot, PuzzleHandle } from "@/lib/puzzle/types";

type Props = {
  imageUrl: string;
  cols: number;
  rows: number;
  ghostDefault: boolean;
  soundDefault: boolean;
  onWin: (seconds: number) => void;
  onHud: (hud: HudSnapshot) => void;
};

type Drag = {
  id: number;
  pointerId: number;
  ox: number;
  oy: number;
  moved: boolean;
};

type Session = {
  pieces: Piece[];
  img: HTMLImageElement;
  cols: number;
  rows: number;
  boardX: number;
  boardY: number;
  cellW: number;
  cellH: number;
  camX: number;
  camY: number;
  zoom: number;
  tx: number;
  ty: number;
  tzoom: number;
  follow: boolean;
  selectedId: number | null;
  drag: Drag | null;
  pan: { pointerId: number; lx: number; ly: number } | null;
  pointers: Map<number, { x: number; y: number }>;
  pinchDist: number | null;
  pinchZoom: number;
  particles: Particle[];
  trauma: number;
  ghost: boolean;
  edges: boolean;
  sound: boolean;
  peek: boolean;
  complete: boolean;
  startedAt: number;
  zTop: number;
  magnet: { piece: Piece; upright: boolean } | null;
  lastTap: { id: number; t: number } | null;
  wonFired: boolean;
};

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    if (!url.startsWith("data:")) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Picture failed to load"));
    img.src = url;
  });
}

function screenToWorld(
  sx: number,
  sy: number,
  cssW: number,
  cssH: number,
  s: Session,
) {
  return {
    x: (sx - cssW / 2) / s.zoom + s.camX,
    y: (sy - cssH / 2) / s.zoom + s.camY,
  };
}

export const PuzzleCanvas = forwardRef<PuzzleHandle, Props>(function PuzzleCanvas(
  { imageUrl, cols, rows, ghostDefault, soundDefault, onWin, onHud },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<Session | null>(null);
  const onWinRef = useRef(onWin);
  const onHudRef = useRef(onHud);
  onWinRef.current = onWin;
  onHudRef.current = onHud;

  const emitHud = (s: Session) => {
    const remaining = s.pieces.filter((p) => !p.snapped).length;
    const sel = s.pieces.find((p) => p.id === s.selectedId);
    onHudRef.current({
      remaining,
      total: s.pieces.length,
      elapsed: (performance.now() - s.startedAt) / 1000,
      selected: Boolean(sel && !sel.snapped),
      rotation: sel ? ((sel.rotation % 360) + 360) % 360 : 0,
      upright: sel ? isUpright(sel.rotation) : false,
      complete: s.complete,
      ghost: s.ghost,
      edges: s.edges,
      sound: s.sound,
      pieceId: sel && !sel.snapped ? sel.id : null,
    });
  };

  const fitBoard = (s: Session, cssW: number, cssH: number, instant = false) => {
    const narrow = cssW < 720;
    const padX = narrow ? 36 : 88;
    const padTop = narrow ? 56 : 80;
    const extraBottom = Math.max(s.cellH * (narrow ? 1.65 : 1.15), narrow ? 200 : 150);
    const worldW = BOARD_W + padX * 2;
    const worldH = BOARD_H + padTop + extraBottom;
    const z = Math.min(cssW / worldW, cssH / worldH);
    s.tzoom = Math.max(0.18, Math.min(2.6, z));
    s.tx = 0;
    s.ty = (extraBottom - padTop) / 2;
    s.follow = true;
    if (instant) {
      s.zoom = s.tzoom;
      s.camX = s.tx;
      s.camY = s.ty;
    }
  };

  const startSession = async (seed = Date.now()) => {
    const img = await loadImage(imageUrl);
    const rng = mulberry32(seed);
    const pieces = buildPieces(img, cols, rows, rng);
    const boardX = -BOARD_W / 2;
    const boardY = -BOARD_H / 2;
    const cellW = BOARD_W / cols;
    const cellH = BOARD_H / rows;
    layoutPieces(pieces, boardX, boardY, cellW, cellH, rng);
    const canvas = canvasRef.current;
    const cssW = canvas?.clientWidth ?? 800;
    const cssH = canvas?.clientHeight ?? 600;
    const s: Session = {
      pieces,
      img,
      cols,
      rows,
      boardX,
      boardY,
      cellW,
      cellH,
      camX: 0,
      camY: 0,
      zoom: 1,
      tx: 0,
      ty: 0,
      tzoom: 1,
      follow: true,
      selectedId: null,
      drag: null,
      pan: null,
      pointers: new Map(),
      pinchDist: null,
      pinchZoom: 1,
      particles: [],
      trauma: 0,
      ghost: ghostDefault,
      edges: false,
      sound: soundDefault,
      peek: false,
      complete: false,
      startedAt: performance.now(),
      zTop: pieces.length + 1,
      magnet: null,
      lastTap: null,
      wonFired: false,
    };
    sessionRef.current = s;
    setSoundEnabled(s.sound);
    fitBoard(s, cssW, cssH, true);
    emitHud(s);
  };

  const rotateSelected = (deg: number) => {
    const s = sessionRef.current;
    if (!s || s.complete) return;
    const p = s.pieces.find((x) => x.id === s.selectedId);
    if (!p || p.snapped) return;
    p.rotation = ((p.rotation + deg) % 360 + 360) % 360;
    playRotate();
    emitHud(s);
  };

  const trySnap = (s: Session, p: Piece) => {
    const target = cellCenter(s.boardX, s.boardY, s.cellW, s.cellH, p.col, p.row);
    const dist = Math.hypot(p.x - target.x, p.y - target.y);
    const threshold = Math.max(48, s.cellW * 0.42);
    if (dist > threshold) return false;
    if (!isUpright(p.rotation)) {
      playReject();
      s.trauma = Math.min(1, s.trauma + 0.18);
      return "rotate" as const;
    }
    p.x = target.x;
    p.y = target.y;
    p.rotation = 0;
    p.snapped = true;
    p.pop = 1.12;
    p.z = p.id;
    s.particles.push(...burst(p.x, p.y, 16));
    s.trauma = Math.min(1, s.trauma + 0.28);
    playSnap();
    if (s.selectedId === p.id) s.selectedId = null;
    if (s.pieces.every((x) => x.snapped) && !s.wonFired) {
      s.complete = true;
      s.wonFired = true;
      s.peek = false;
      s.particles.push(...confettiBurst(0, s.boardY + 80, 110));
      playFanfare();
      s.trauma = 0.55;
      onWinRef.current((performance.now() - s.startedAt) / 1000);
    }
    emitHud(s);
    return true;
  };

  useImperativeHandle(ref, () => ({
    rotate: rotateSelected,
    hint: () => {
      const s = sessionRef.current;
      if (!s || s.complete) return;
      const pool = s.pieces.filter((p) => !p.snapped);
      if (!pool.length) return;
      const p = pool[Math.floor(Math.random() * pool.length)]!;
      p.rotation = 0;
      const target = cellCenter(s.boardX, s.boardY, s.cellW, s.cellH, p.col, p.row);
      p.x = target.x;
      p.y = target.y;
      trySnap(s, p);
    },
    toggleGhost: () => {
      const s = sessionRef.current;
      if (!s) return;
      s.ghost = !s.ghost;
      emitHud(s);
    },
    toggleEdges: () => {
      const s = sessionRef.current;
      if (!s) return;
      s.edges = !s.edges;
      emitHud(s);
    },
    toggleSound: () => {
      const s = sessionRef.current;
      if (!s) return;
      s.sound = !s.sound;
      setSoundEnabled(s.sound);
      emitHud(s);
    },
    fit: () => {
      const s = sessionRef.current;
      const canvas = canvasRef.current;
      if (!s || !canvas) return;
      fitBoard(s, canvas.clientWidth, canvas.clientHeight);
    },
    locate: () => {
      const s = sessionRef.current;
      if (!s) return;
      const free = s.pieces.filter((p) => !p.snapped);
      if (!free.length) return;
      const idx = s.selectedId != null ? free.findIndex((p) => p.id === s.selectedId) : -1;
      const next = free[(idx + 1) % free.length]!;
      s.selectedId = next.id;
      s.tx = next.x;
      s.ty = next.y;
      s.tzoom = Math.min(Math.max(s.zoom, 0.55), 1.15);
      s.follow = true;
      emitHud(s);
    },
    restart: () => {
      void startSession();
    },
    peek: (on: boolean) => {
      const s = sessionRef.current;
      if (!s || s.complete) return;
      s.peek = on;
    },
  }));

  useEffect(() => {
    let alive = true;
    void startSession().then(() => {
      if (!alive) sessionRef.current = null;
    });
    return () => {
      alive = false;
      sessionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, cols, rows]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let hudAcc = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const s = sessionRef.current;
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;

      if (s) {
        if (s.follow) {
          const k = 1 - Math.exp(-8 * dt);
          s.camX += (s.tx - s.camX) * k;
          s.camY += (s.ty - s.camY) * k;
          s.zoom += (s.tzoom - s.zoom) * k;
        }
        s.trauma = Math.max(0, s.trauma - dt * 2.4);
        for (const p of s.pieces) {
          p.pop += (1 - p.pop) * (1 - Math.exp(-12 * dt));
        }
        for (const pt of s.particles) {
          pt.life -= dt;
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
          pt.vy += 380 * dt;
          pt.rot += pt.vr * dt;
        }
        s.particles = s.particles.filter((pt) => pt.life > 0);

        hudAcc += dt;
        if (hudAcc > 0.25) {
          hudAcc = 0;
          emitHud(s);
        }
        draw(ctx, s, cssW, cssH, now);
      } else {
        ctx.fillStyle = "#0c0c0d";
        ctx.fillRect(0, 0, cssW, cssH);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const ptrPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const pickPiece = (s: Session, wx: number, wy: number) => {
      const ordered = s.pieces
        .filter((p) => !p.snapped)
        .sort((a, b) => b.z - a.z);
      for (const p of ordered) {
        if (s.edges && !p.isEdge) continue;
        if (hitTestPiece(p, wx, wy, s.cellW, s.cellH)) return p;
      }
      return null;
    };

    const onDown = (e: PointerEvent) => {
      const s = sessionRef.current;
      if (!s) return;
      unlockAudio();
      canvas.setPointerCapture(e.pointerId);
      const { x, y } = ptrPos(e);
      s.pointers.set(e.pointerId, { x, y });

      if (s.pointers.size === 2) {
        const pts = [...s.pointers.values()];
        s.drag = null;
        s.pan = null;
        s.pinchDist = Math.hypot(pts[0]!.x - pts[1]!.x, pts[0]!.y - pts[1]!.y);
        s.pinchZoom = s.zoom;
        return;
      }

      if (s.complete) {
        s.pan = { pointerId: e.pointerId, lx: x, ly: y };
        s.follow = false;
        return;
      }

      const world = screenToWorld(x, y, canvas.clientWidth, canvas.clientHeight, s);
      const hit = pickPiece(s, world.x, world.y);
      if (hit) {
        const now = performance.now();
        if (s.lastTap && s.lastTap.id === hit.id && now - s.lastTap.t < 280) {
          s.selectedId = hit.id;
          rotateSelected(90);
          s.lastTap = null;
          s.drag = null;
          return;
        }
        s.lastTap = { id: hit.id, t: now };
        s.selectedId = hit.id;
        s.zTop += 1;
        hit.z = s.zTop;
        s.drag = {
          id: hit.id,
          pointerId: e.pointerId,
          ox: hit.x - world.x,
          oy: hit.y - world.y,
          moved: false,
        };
        playPick();
        emitHud(s);
      } else {
        s.selectedId = null;
        s.pan = { pointerId: e.pointerId, lx: x, ly: y };
        s.follow = false;
        emitHud(s);
      }
    };

    const onMove = (e: PointerEvent) => {
      const s = sessionRef.current;
      if (!s) return;
      const { x, y } = ptrPos(e);
      if (s.pointers.has(e.pointerId)) s.pointers.set(e.pointerId, { x, y });

      if (s.pointers.size === 2 && s.pinchDist) {
        const pts = [...s.pointers.values()];
        const dist = Math.hypot(pts[0]!.x - pts[1]!.x, pts[0]!.y - pts[1]!.y);
        const next = Math.max(0.18, Math.min(2.8, s.pinchZoom * (dist / s.pinchDist)));
        s.zoom = next;
        s.tzoom = next;
        return;
      }

      if (s.drag && s.drag.pointerId === e.pointerId) {
        const world = screenToWorld(x, y, canvas.clientWidth, canvas.clientHeight, s);
        const p = s.pieces.find((pc) => pc.id === s.drag!.id);
        if (p && !p.snapped) {
          const nx = world.x + s.drag.ox;
          const ny = world.y + s.drag.oy;
          if (!s.drag.moved && Math.hypot(nx - p.x, ny - p.y) > 4 / s.zoom) {
            s.drag.moved = true;
          }
          p.x = nx;
          p.y = ny;
          const target = cellCenter(s.boardX, s.boardY, s.cellW, s.cellH, p.col, p.row);
          const dist = Math.hypot(p.x - target.x, p.y - target.y);
          const threshold = Math.max(52, s.cellW * 0.5);
          s.magnet = dist < threshold ? { piece: p, upright: isUpright(p.rotation) } : null;
        }
        return;
      }

      if (s.pan && s.pan.pointerId === e.pointerId) {
        const dx = x - s.pan.lx;
        const dy = y - s.pan.ly;
        s.camX -= dx / s.zoom;
        s.camY -= dy / s.zoom;
        s.tx = s.camX;
        s.ty = s.camY;
        s.pan.lx = x;
        s.pan.ly = y;
      }
    };

    const onUp = (e: PointerEvent) => {
      const s = sessionRef.current;
      if (!s) return;
      s.pointers.delete(e.pointerId);
      if (s.pointers.size < 2) s.pinchDist = null;

      if (s.drag && s.drag.pointerId === e.pointerId) {
        const p = s.pieces.find((pc) => pc.id === s.drag!.id);
        if (p && s.drag.moved) trySnap(s, p);
        s.drag = null;
        s.magnet = null;
      }
      if (s.pan && s.pan.pointerId === e.pointerId) s.pan = null;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const s = sessionRef.current;
      if (!s) return;
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const before = screenToWorld(sx, sy, canvas.clientWidth, canvas.clientHeight, s);
      const factor = Math.exp(-e.deltaY * 0.0012);
      s.zoom = Math.max(0.18, Math.min(2.8, s.zoom * factor));
      s.tzoom = s.zoom;
      const after = screenToWorld(sx, sy, canvas.clientWidth, canvas.clientHeight, s);
      s.camX += before.x - after.x;
      s.camY += before.y - after.y;
      s.tx = s.camX;
      s.ty = s.camY;
      s.follow = false;
    };

    const onCtx = (e: MouseEvent) => {
      e.preventDefault();
      rotateSelected(90);
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("contextmenu", onCtx);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("contextmenu", onCtx);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, cols, rows]);

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full touch-none bg-bg"
      aria-label="Jigsaw table"
    />
  );
});

function draw(
  ctx: CanvasRenderingContext2D,
  s: Session,
  cssW: number,
  cssH: number,
  now: number,
) {
  ctx.fillStyle = "#0c0c0d";
  ctx.fillRect(0, 0, cssW, cssH);

  const shake = s.trauma * s.trauma;
  const ox = Math.sin(now * 0.053) * shake * 10;
  const oy = Math.cos(now * 0.061) * shake * 8;

  ctx.save();
  ctx.translate(cssW / 2 + ox, cssH / 2 + oy);
  ctx.scale(s.zoom, s.zoom);
  ctx.translate(-s.camX, -s.camY);

  const tablePad = 360;
  const well = s.pieces.reduce(
    (m, p) => Math.max(m, p.snapped ? m : p.y + s.cellH),
    s.boardY + BOARD_H + 80,
  );
  roundRect(ctx, s.boardX - tablePad, s.boardY - 120, BOARD_W + tablePad * 2, well - s.boardY + 220, 28);
  ctx.fillStyle = "#141416";
  ctx.fill();
  ctx.strokeStyle = "rgba(240,238,232,0.08)";
  ctx.lineWidth = 1.2 / s.zoom;
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.rect(s.boardX - tablePad, s.boardY - 120, BOARD_W + tablePad * 2, well - s.boardY + 220);
  ctx.clip();
  ctx.strokeStyle = "rgba(240,238,232,0.03)";
  ctx.lineWidth = 1 / s.zoom;
  for (let y = s.boardY - 120; y < well + 220; y += 7) {
    ctx.beginPath();
    ctx.moveTo(s.boardX - tablePad, y);
    ctx.lineTo(s.boardX + BOARD_W + tablePad, y);
    ctx.stroke();
  }
  ctx.restore();

  const frame = 22;
  roundRect(
    ctx,
    s.boardX - frame,
    s.boardY - frame,
    BOARD_W + frame * 2,
    BOARD_H + frame * 2,
    10,
  );
  ctx.fillStyle = "#1c1c1f";
  ctx.fill();
  ctx.strokeStyle = "rgba(197,201,208,0.22)";
  ctx.lineWidth = 1.4 / s.zoom;
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.rect(s.boardX, s.boardY, BOARD_W, BOARD_H);
  ctx.clip();
  ctx.fillStyle = "#101012";
  ctx.fillRect(s.boardX, s.boardY, BOARD_W, BOARD_H);

  if (s.ghost && !s.complete) {
    ctx.globalAlpha = 0.16;
    ctx.drawImage(s.img, s.boardX, s.boardY, BOARD_W, BOARD_H);
    ctx.globalAlpha = 1;
  }

  if (!s.complete) {
    ctx.strokeStyle = "rgba(240,238,232,0.14)";
    ctx.setLineDash([6 / s.zoom, 6 / s.zoom]);
    ctx.lineWidth = 1.1 / s.zoom;
    for (const p of s.pieces) {
      ctx.save();
      ctx.translate(s.boardX + p.col * s.cellW, s.boardY + p.row * s.cellH);
      ctx.scale(s.cellW / p.nativeCellW, s.cellH / p.nativeCellH);
      ctx.stroke(p.path);
      ctx.restore();
    }
    ctx.setLineDash([]);
  }

  if (s.magnet && !s.complete) {
    const p = s.magnet.piece;
    ctx.fillStyle = s.magnet.upright ? "rgba(197,201,208,0.22)" : "rgba(196,165,116,0.22)";
    ctx.strokeStyle = s.magnet.upright ? "rgba(197,201,208,0.9)" : "rgba(196,165,116,0.9)";
    ctx.lineWidth = 2.2 / s.zoom;
    ctx.beginPath();
    ctx.rect(s.boardX + p.col * s.cellW, s.boardY + p.row * s.cellH, s.cellW, s.cellH);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  const drawPiece = (p: Piece, lifted: boolean) => {
    const scaleX = (s.cellW / p.nativeCellW) * p.pop;
    const scaleY = (s.cellH / p.nativeCellH) * p.pop;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    if (lifted) {
      ctx.shadowColor = "rgba(0,0,0,0.55)";
      ctx.shadowBlur = 28 / s.zoom;
      ctx.shadowOffsetY = 10 / s.zoom;
    }
    ctx.scale(scaleX, scaleY);
    ctx.drawImage(p.sprite, -p.sprite.width / 2, -p.sprite.height / 2);
    ctx.restore();

    if (s.selectedId === p.id && !p.snapped) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.scale(s.cellW / p.nativeCellW, s.cellH / p.nativeCellH);
      ctx.translate(-p.nativeCellW / 2, -p.nativeCellH / 2);
      ctx.strokeStyle = isUpright(p.rotation) ? "rgba(197,201,208,0.95)" : "rgba(196,165,116,0.95)";
      ctx.lineWidth = 3 / s.zoom / (s.cellW / p.nativeCellW);
      ctx.stroke(p.path);
      ctx.restore();
    }
  };

  const snapped = s.pieces.filter((p) => p.snapped).sort((a, b) => a.id - b.id);
  const loose = s.pieces
    .filter((p) => !p.snapped)
    .sort((a, b) => a.z - b.z);

  for (const p of snapped) drawPiece(p, false);

  if (s.complete || s.peek) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(s.boardX, s.boardY, BOARD_W, BOARD_H);
    ctx.clip();
    ctx.globalAlpha = s.complete ? 1 : 0.92;
    ctx.drawImage(s.img, s.boardX, s.boardY, BOARD_W, BOARD_H);
    ctx.restore();
  }

  for (const p of loose) {
    const dim = s.edges && !p.isEdge;
    ctx.globalAlpha = dim ? 0.18 : 1;
    drawPiece(p, true);
    ctx.globalAlpha = 1;
  }

  for (const pt of s.particles) {
    const a = Math.max(0, pt.life / pt.max);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(pt.x, pt.y);
    ctx.rotate(pt.rot);
    ctx.fillStyle = pt.color;
    ctx.fillRect(-pt.w / 2, -pt.h / 2, pt.w, pt.h);
    ctx.restore();
  }

  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
