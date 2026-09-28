import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as RotateCcw, d as Eye, f as EyeOff, l as Maximize2, m as ArrowLeft, n as VolumeX, o as ScanSearch, r as Volume2, s as RotateCw, u as Lightbulb } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-B9GkyW5E.mjs";
import { a as formatTime, c as loadCustomImage, f as patchSettings, l as loadSave, n as CUTS, o as getCut, p as recordBest, s as getWork, t as Button, u as markHelpSeen } from "./photo-DOgu8wQe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play._puzzleId-Q4Foz6Vp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BOARD_W = 1200;
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function generateJigsawPath(w, h, top, right, bottom, left) {
	let path = `M 0 0 `;
	if (top === 0) path += `L ${w} 0 `;
	else {
		const tabDepth = h * .22 * -top;
		const tabWidth = w * .28;
		const midX = w * .5;
		path += `L ${midX - tabWidth} 0 `;
		path += `C ${midX - tabWidth * .7} ${tabDepth * .2}, ${midX - tabWidth * .85} ${tabDepth}, ${midX} ${tabDepth} `;
		path += `C ${midX + tabWidth * .85} ${tabDepth}, ${midX + tabWidth * .7} ${tabDepth * .2}, ${midX + tabWidth} 0 `;
		path += `L ${w} 0 `;
	}
	if (right === 0) path += `L ${w} ${h} `;
	else {
		const tabDepth = w * .22 * right;
		const tabHeight = h * .28;
		const midY = h * .5;
		path += `L ${w} ${midY - tabHeight} `;
		path += `C ${w + tabDepth * .2} ${midY - tabHeight * .7}, ${w + tabDepth} ${midY - tabHeight * .85}, ${w + tabDepth} ${midY} `;
		path += `C ${w + tabDepth} ${midY + tabHeight * .85}, ${w + tabDepth * .2} ${midY + tabHeight * .7}, ${w} ${midY + tabHeight} `;
		path += `L ${w} ${h} `;
	}
	if (bottom === 0) path += `L 0 ${h} `;
	else {
		const tabDepth = h * .22 * bottom;
		const tabWidth = w * .28;
		const midX = w * .5;
		path += `L ${midX + tabWidth} ${h} `;
		path += `C ${midX + tabWidth * .7} ${h + tabDepth * .2}, ${midX + tabWidth * .85} ${h + tabDepth}, ${midX} ${tabDepth + h} `;
		path += `C ${midX - tabWidth * .85} ${h + tabDepth}, ${midX - tabWidth * .7} ${h + tabDepth * .2}, ${midX - tabWidth} ${h} `;
		path += `L 0 ${h} `;
	}
	if (left === 0) path += `L 0 0 Z`;
	else {
		const tabDepth = w * .22 * -left;
		const tabHeight = h * .28;
		const midY = h * .5;
		path += `L 0 ${midY + tabHeight} `;
		path += `C ${tabDepth * .2} ${midY + tabHeight * .7}, ${tabDepth} ${midY + tabHeight * .85}, ${tabDepth} ${midY} `;
		path += `C ${tabDepth} ${midY - tabHeight * .85}, ${tabDepth * .2} ${midY - tabHeight * .7}, 0 ${midY - tabHeight} `;
		path += `L 0 0 Z`;
	}
	return path;
}
function buildPieces(img, cols, rows, rng) {
	const nativeW = img.naturalWidth || img.width;
	const nativeH = img.naturalHeight || img.height;
	const nativeCellW = nativeW / cols;
	const nativeCellH = nativeH / rows;
	const hEdges = [];
	for (let r = 0; r < rows; r++) {
		hEdges[r] = [];
		for (let c = 0; c < cols - 1; c++) hEdges[r][c] = rng() > .5 ? 1 : -1;
	}
	const vEdges = [];
	for (let r = 0; r < rows - 1; r++) {
		vEdges[r] = [];
		for (let c = 0; c < cols; c++) vEdges[r][c] = rng() > .5 ? 1 : -1;
	}
	const rots = [
		90,
		180,
		270,
		90,
		180,
		270,
		0
	];
	const pieces = [];
	let idx = 0;
	for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
		const top = r === 0 ? 0 : -vEdges[r - 1][c];
		const bottom = r === rows - 1 ? 0 : vEdges[r][c];
		const left = c === 0 ? 0 : -hEdges[r][c - 1];
		const right = c === cols - 1 ? 0 : hEdges[r][c];
		const pathD = generateJigsawPath(nativeCellW, nativeCellH, top, right, bottom, left);
		const piece = {
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
			pop: 1
		};
		piece.sprite = renderSprite(img, piece, nativeW, nativeH);
		pieces.push(piece);
		idx++;
	}
	return pieces;
}
function renderSprite(img, p, nativeW, nativeH) {
	const padX = p.nativeCellW * .36;
	const padY = p.nativeCellH * .36;
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
	ctx.lineWidth = Math.max(1.2, p.nativeCellW * .008);
	ctx.stroke(p.path);
	ctx.strokeStyle = "rgba(12,12,13,0.38)";
	ctx.lineWidth = Math.max(.7, p.nativeCellW * .004);
	ctx.stroke(p.path);
	return canvas;
}
function layoutPieces(pieces, boardX, boardY, cellW, cellH, rng) {
	const spacing = Math.max(cellW, cellH) * 1.24;
	const free = pieces.filter((p) => !p.snapped);
	for (let i = free.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		const tmp = free[i];
		free[i] = free[j];
		free[j] = tmp;
	}
	const sideSlots = Math.max(2, Math.min(Math.floor(900 / spacing), Math.ceil(free.length * .22)));
	const sideTotal = Math.min(free.length, sideSlots * 2);
	const perSide = Math.floor(sideTotal / 2);
	const bottomCount = free.length - perSide * 2;
	const jitter = () => (rng() - .5) * spacing * .16;
	let i = 0;
	for (let k = 0; k < perSide; k++) {
		const p = free[i++];
		p.x = boardX - spacing * .62 + jitter() * .4;
		p.y = boardY + spacing * .35 + k * spacing + jitter();
		p.z = i;
	}
	for (let k = 0; k < perSide; k++) {
		const p = free[i++];
		p.x = boardX + BOARD_W + spacing * .62 + jitter() * .4;
		p.y = boardY + spacing * .35 + k * spacing + jitter();
		p.z = i;
	}
	const bottomCols = Math.max(3, Math.min(8, Math.ceil(Math.sqrt(bottomCount * 1.8))));
	const startY = boardY + 900 + spacing * .62;
	const startX = boardX + BOARD_W / 2 - (Math.min(bottomCount, bottomCols) - 1) * spacing / 2;
	let b = 0;
	while (i < free.length) {
		const p = free[i++];
		const c = b % bottomCols;
		const r = Math.floor(b / bottomCols);
		p.x = startX + (bottomCols - Math.min(bottomCols, bottomCount - r * bottomCols)) * spacing / 2 + c * spacing + jitter();
		p.y = startY + r * spacing + jitter();
		p.z = i;
		b++;
	}
	return {
		wellBottom: startY + Math.ceil(bottomCount / bottomCols) * spacing,
		wellRight: boardX + BOARD_W + spacing
	};
}
var hitCtx = null;
function getHitCtx() {
	if (!hitCtx) hitCtx = document.createElement("canvas").getContext("2d");
	return hitCtx;
}
function hitTestPiece(p, wx, wy, cellW, cellH) {
	const ctx = getHitCtx();
	if (!ctx) return false;
	const dx = wx - p.x;
	const dy = wy - p.y;
	const a = -p.rotation * Math.PI / 180;
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
function cellCenter(boardX, boardY, cellW, cellH, col, row) {
	return {
		x: boardX + (col + .5) * cellW,
		y: boardY + (row + .5) * cellH
	};
}
function isUpright(rotation) {
	return (rotation % 360 + 360) % 360 === 0;
}
var PAPER = [
	"#e8e2d6",
	"#c5c9d0",
	"#8a8780",
	"#d7c4a8",
	"#9aa8b5",
	"#f0eee8"
];
function burst(x, y, n = 18) {
	const out = [];
	for (let i = 0; i < n; i++) {
		const a = Math.random() * Math.PI * 2;
		const sp = 40 + Math.random() * 180;
		const max = .45 + Math.random() * .55;
		out.push({
			x,
			y,
			vx: Math.cos(a) * sp,
			vy: Math.sin(a) * sp - 40,
			rot: Math.random() * Math.PI,
			vr: (Math.random() - .5) * 8,
			life: max,
			max,
			w: 4 + Math.random() * 8,
			h: 3 + Math.random() * 6,
			color: PAPER[i % PAPER.length]
		});
	}
	return out;
}
function confettiBurst(x, y, n = 90) {
	const out = [];
	for (let i = 0; i < n; i++) {
		const a = -Math.PI / 2 + (Math.random() - .5) * 1.6;
		const sp = 80 + Math.random() * 280;
		const max = 1.1 + Math.random() * 1.4;
		out.push({
			x: x + (Math.random() - .5) * 80,
			y,
			vx: Math.cos(a) * sp,
			vy: Math.sin(a) * sp,
			rot: Math.random() * Math.PI,
			vr: (Math.random() - .5) * 10,
			life: max,
			max,
			w: 5 + Math.random() * 10,
			h: 3 + Math.random() * 7,
			color: PAPER[i % PAPER.length]
		});
	}
	return out;
}
var ctx = null;
var master = null;
var enabled = true;
function ensure() {
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return null;
	if (!ctx) {
		ctx = new AC({ latencyHint: "interactive" });
		master = ctx.createGain();
		master.gain.value = .7;
		master.connect(ctx.destination);
	}
	if (ctx.state === "suspended") ctx.resume();
	return ctx;
}
function unlockAudio() {
	ensure();
}
function setSoundEnabled(on) {
	enabled = on;
	if (master && ctx) master.gain.setTargetAtTime(on ? .7 : 0, ctx.currentTime, .03);
}
function tone(freq, dur, type, gain = .18, slide) {
	if (!enabled) return;
	const ac = ensure();
	if (!ac || !master) return;
	const now = ac.currentTime;
	const osc = ac.createOscillator();
	const g = ac.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, now);
	if (slide) osc.frequency.exponentialRampToValueAtTime(slide, now + dur * .7);
	g.gain.setValueAtTime(gain, now);
	g.gain.exponentialRampToValueAtTime(.001, now + dur);
	osc.connect(g);
	g.connect(master);
	osc.start(now);
	osc.stop(now + dur + .02);
	osc.onended = () => {
		osc.disconnect();
		g.disconnect();
	};
}
function playSnap() {
	const jitter = .94 + Math.random() * .12;
	tone(523.25 * jitter, .12, "triangle", .2, 1046.5 * jitter);
	tone(783.99 * jitter, .14, "sine", .1, 1567 * jitter);
}
function playRotate() {
	tone(340 + Math.random() * 40, .06, "sine", .1, 560);
}
function playReject() {
	tone(220, .09, "square", .05, 160);
}
function playFanfare() {
	[
		523.25,
		659.25,
		783.99,
		1046.5
	].forEach((f, i) => {
		setTimeout(() => tone(f, .36, "triangle", .16), i * 90);
	});
}
function playPick() {
	tone(880, .04, "sine", .05, 1200);
}
if (typeof window !== "undefined") {
	window.addEventListener("pointerdown", unlockAudio, { once: true });
	window.addEventListener("keydown", unlockAudio, { once: true });
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "visible") ensure();
	});
}
function loadImage(url) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		if (!url.startsWith("data:")) img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("Picture failed to load"));
		img.src = url;
	});
}
function screenToWorld(sx, sy, cssW, cssH, s) {
	return {
		x: (sx - cssW / 2) / s.zoom + s.camX,
		y: (sy - cssH / 2) / s.zoom + s.camY
	};
}
var PuzzleCanvas = (0, import_react.forwardRef)(function PuzzleCanvas({ imageUrl, cols, rows, ghostDefault, soundDefault, onWin, onHud }, ref) {
	const canvasRef = (0, import_react.useRef)(null);
	const sessionRef = (0, import_react.useRef)(null);
	const onWinRef = (0, import_react.useRef)(onWin);
	const onHudRef = (0, import_react.useRef)(onHud);
	onWinRef.current = onWin;
	onHudRef.current = onHud;
	const emitHud = (s) => {
		const remaining = s.pieces.filter((p) => !p.snapped).length;
		const sel = s.pieces.find((p) => p.id === s.selectedId);
		onHudRef.current({
			remaining,
			total: s.pieces.length,
			elapsed: (performance.now() - s.startedAt) / 1e3,
			selected: Boolean(sel && !sel.snapped),
			rotation: sel ? (sel.rotation % 360 + 360) % 360 : 0,
			upright: sel ? isUpright(sel.rotation) : false,
			complete: s.complete,
			ghost: s.ghost,
			edges: s.edges,
			sound: s.sound,
			pieceId: sel && !sel.snapped ? sel.id : null
		});
	};
	const fitBoard = (s, cssW, cssH, instant = false) => {
		const narrow = cssW < 720;
		const padX = narrow ? 36 : 88;
		const padTop = narrow ? 56 : 80;
		const extraBottom = Math.max(s.cellH * (narrow ? 1.65 : 1.15), narrow ? 200 : 150);
		const worldW = BOARD_W + padX * 2;
		const worldH = 900 + padTop + extraBottom;
		const z = Math.min(cssW / worldW, cssH / worldH);
		s.tzoom = Math.max(.18, Math.min(2.6, z));
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
		const boardY = -450;
		const cellW = BOARD_W / cols;
		const cellH = 900 / rows;
		layoutPieces(pieces, boardX, boardY, cellW, cellH, rng);
		const canvas = canvasRef.current;
		const cssW = canvas?.clientWidth ?? 800;
		const cssH = canvas?.clientHeight ?? 600;
		const s = {
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
			pointers: /* @__PURE__ */ new Map(),
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
			wonFired: false
		};
		sessionRef.current = s;
		setSoundEnabled(s.sound);
		fitBoard(s, cssW, cssH, true);
		emitHud(s);
	};
	const rotateSelected = (deg) => {
		const s = sessionRef.current;
		if (!s || s.complete) return;
		const p = s.pieces.find((x) => x.id === s.selectedId);
		if (!p || p.snapped) return;
		p.rotation = ((p.rotation + deg) % 360 + 360) % 360;
		playRotate();
		emitHud(s);
	};
	const trySnap = (s, p) => {
		const target = cellCenter(s.boardX, s.boardY, s.cellW, s.cellH, p.col, p.row);
		if (Math.hypot(p.x - target.x, p.y - target.y) > Math.max(48, s.cellW * .42)) return false;
		if (!isUpright(p.rotation)) {
			playReject();
			s.trauma = Math.min(1, s.trauma + .18);
			return "rotate";
		}
		p.x = target.x;
		p.y = target.y;
		p.rotation = 0;
		p.snapped = true;
		p.pop = 1.12;
		p.z = p.id;
		s.particles.push(...burst(p.x, p.y, 16));
		s.trauma = Math.min(1, s.trauma + .28);
		playSnap();
		if (s.selectedId === p.id) s.selectedId = null;
		if (s.pieces.every((x) => x.snapped) && !s.wonFired) {
			s.complete = true;
			s.wonFired = true;
			s.peek = false;
			s.particles.push(...confettiBurst(0, s.boardY + 80, 110));
			playFanfare();
			s.trauma = .55;
			onWinRef.current((performance.now() - s.startedAt) / 1e3);
		}
		emitHud(s);
		return true;
	};
	(0, import_react.useImperativeHandle)(ref, () => ({
		rotate: rotateSelected,
		hint: () => {
			const s = sessionRef.current;
			if (!s || s.complete) return;
			const pool = s.pieces.filter((p) => !p.snapped);
			if (!pool.length) return;
			const p = pool[Math.floor(Math.random() * pool.length)];
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
			const next = free[((s.selectedId != null ? free.findIndex((p) => p.id === s.selectedId) : -1) + 1) % free.length];
			s.selectedId = next.id;
			s.tx = next.x;
			s.ty = next.y;
			s.tzoom = Math.min(Math.max(s.zoom, .55), 1.15);
			s.follow = true;
			emitHud(s);
		},
		restart: () => {
			startSession();
		},
		peek: (on) => {
			const s = sessionRef.current;
			if (!s || s.complete) return;
			s.peek = on;
		}
	}));
	(0, import_react.useEffect)(() => {
		let alive = true;
		startSession().then(() => {
			if (!alive) sessionRef.current = null;
		});
		return () => {
			alive = false;
			sessionRef.current = null;
		};
	}, [
		imageUrl,
		cols,
		rows
	]);
	(0, import_react.useEffect)(() => {
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
		const loop = (now) => {
			const dt = Math.min(.1, (now - last) / 1e3);
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
				for (const p of s.pieces) p.pop += (1 - p.pop) * (1 - Math.exp(-12 * dt));
				for (const pt of s.particles) {
					pt.life -= dt;
					pt.x += pt.vx * dt;
					pt.y += pt.vy * dt;
					pt.vy += 380 * dt;
					pt.rot += pt.vr * dt;
				}
				s.particles = s.particles.filter((pt) => pt.life > 0);
				hudAcc += dt;
				if (hudAcc > .25) {
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
		const ptrPos = (e) => {
			const rect = canvas.getBoundingClientRect();
			return {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top
			};
		};
		const pickPiece = (s, wx, wy) => {
			const ordered = s.pieces.filter((p) => !p.snapped).sort((a, b) => b.z - a.z);
			for (const p of ordered) {
				if (s.edges && !p.isEdge) continue;
				if (hitTestPiece(p, wx, wy, s.cellW, s.cellH)) return p;
			}
			return null;
		};
		const onDown = (e) => {
			const s = sessionRef.current;
			if (!s) return;
			unlockAudio();
			canvas.setPointerCapture(e.pointerId);
			const { x, y } = ptrPos(e);
			s.pointers.set(e.pointerId, {
				x,
				y
			});
			if (s.pointers.size === 2) {
				const pts = [...s.pointers.values()];
				s.drag = null;
				s.pan = null;
				s.pinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
				s.pinchZoom = s.zoom;
				return;
			}
			if (s.complete) {
				s.pan = {
					pointerId: e.pointerId,
					lx: x,
					ly: y
				};
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
				s.lastTap = {
					id: hit.id,
					t: now
				};
				s.selectedId = hit.id;
				s.zTop += 1;
				hit.z = s.zTop;
				s.drag = {
					id: hit.id,
					pointerId: e.pointerId,
					ox: hit.x - world.x,
					oy: hit.y - world.y,
					moved: false
				};
				playPick();
				emitHud(s);
			} else {
				s.selectedId = null;
				s.pan = {
					pointerId: e.pointerId,
					lx: x,
					ly: y
				};
				s.follow = false;
				emitHud(s);
			}
		};
		const onMove = (e) => {
			const s = sessionRef.current;
			if (!s) return;
			const { x, y } = ptrPos(e);
			if (s.pointers.has(e.pointerId)) s.pointers.set(e.pointerId, {
				x,
				y
			});
			if (s.pointers.size === 2 && s.pinchDist) {
				const pts = [...s.pointers.values()];
				const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
				const next = Math.max(.18, Math.min(2.8, s.pinchZoom * (dist / s.pinchDist)));
				s.zoom = next;
				s.tzoom = next;
				return;
			}
			if (s.drag && s.drag.pointerId === e.pointerId) {
				const world = screenToWorld(x, y, canvas.clientWidth, canvas.clientHeight, s);
				const p = s.pieces.find((pc) => pc.id === s.drag.id);
				if (p && !p.snapped) {
					const nx = world.x + s.drag.ox;
					const ny = world.y + s.drag.oy;
					if (!s.drag.moved && Math.hypot(nx - p.x, ny - p.y) > 4 / s.zoom) s.drag.moved = true;
					p.x = nx;
					p.y = ny;
					const target = cellCenter(s.boardX, s.boardY, s.cellW, s.cellH, p.col, p.row);
					s.magnet = Math.hypot(p.x - target.x, p.y - target.y) < Math.max(52, s.cellW * .5) ? {
						piece: p,
						upright: isUpright(p.rotation)
					} : null;
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
		const onUp = (e) => {
			const s = sessionRef.current;
			if (!s) return;
			s.pointers.delete(e.pointerId);
			if (s.pointers.size < 2) s.pinchDist = null;
			if (s.drag && s.drag.pointerId === e.pointerId) {
				const p = s.pieces.find((pc) => pc.id === s.drag.id);
				if (p && s.drag.moved) trySnap(s, p);
				s.drag = null;
				s.magnet = null;
			}
			if (s.pan && s.pan.pointerId === e.pointerId) s.pan = null;
		};
		const onWheel = (e) => {
			e.preventDefault();
			const s = sessionRef.current;
			if (!s) return;
			const rect = canvas.getBoundingClientRect();
			const sx = e.clientX - rect.left;
			const sy = e.clientY - rect.top;
			const before = screenToWorld(sx, sy, canvas.clientWidth, canvas.clientHeight, s);
			const factor = Math.exp(-e.deltaY * .0012);
			s.zoom = Math.max(.18, Math.min(2.8, s.zoom * factor));
			s.tzoom = s.zoom;
			const after = screenToWorld(sx, sy, canvas.clientWidth, canvas.clientHeight, s);
			s.camX += before.x - after.x;
			s.camY += before.y - after.y;
			s.tx = s.camX;
			s.ty = s.camY;
			s.follow = false;
		};
		const onCtx = (e) => {
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
	}, [
		imageUrl,
		cols,
		rows
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		className: "block h-full w-full touch-none bg-bg",
		"aria-label": "Jigsaw table"
	});
});
function draw(ctx, s, cssW, cssH, now) {
	ctx.fillStyle = "#0c0c0d";
	ctx.fillRect(0, 0, cssW, cssH);
	const shake = s.trauma * s.trauma;
	const ox = Math.sin(now * .053) * shake * 10;
	const oy = Math.cos(now * .061) * shake * 8;
	ctx.save();
	ctx.translate(cssW / 2 + ox, cssH / 2 + oy);
	ctx.scale(s.zoom, s.zoom);
	ctx.translate(-s.camX, -s.camY);
	const tablePad = 360;
	const well = s.pieces.reduce((m, p) => Math.max(m, p.snapped ? m : p.y + s.cellH), s.boardY + 900 + 80);
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
	roundRect(ctx, s.boardX - frame, s.boardY - frame, BOARD_W + 44, 944, 10);
	ctx.fillStyle = "#1c1c1f";
	ctx.fill();
	ctx.strokeStyle = "rgba(197,201,208,0.22)";
	ctx.lineWidth = 1.4 / s.zoom;
	ctx.stroke();
	ctx.save();
	ctx.beginPath();
	ctx.rect(s.boardX, s.boardY, BOARD_W, 900);
	ctx.clip();
	ctx.fillStyle = "#101012";
	ctx.fillRect(s.boardX, s.boardY, BOARD_W, 900);
	if (s.ghost && !s.complete) {
		ctx.globalAlpha = .16;
		ctx.drawImage(s.img, s.boardX, s.boardY, BOARD_W, 900);
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
	const drawPiece = (p, lifted) => {
		const scaleX = s.cellW / p.nativeCellW * p.pop;
		const scaleY = s.cellH / p.nativeCellH * p.pop;
		ctx.save();
		ctx.translate(p.x, p.y);
		ctx.rotate(p.rotation * Math.PI / 180);
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
			ctx.rotate(p.rotation * Math.PI / 180);
			ctx.scale(s.cellW / p.nativeCellW, s.cellH / p.nativeCellH);
			ctx.translate(-p.nativeCellW / 2, -p.nativeCellH / 2);
			ctx.strokeStyle = isUpright(p.rotation) ? "rgba(197,201,208,0.95)" : "rgba(196,165,116,0.95)";
			ctx.lineWidth = 3 / s.zoom / (s.cellW / p.nativeCellW);
			ctx.stroke(p.path);
			ctx.restore();
		}
	};
	const snapped = s.pieces.filter((p) => p.snapped).sort((a, b) => a.id - b.id);
	const loose = s.pieces.filter((p) => !p.snapped).sort((a, b) => a.z - b.z);
	for (const p of snapped) drawPiece(p, false);
	if (s.complete || s.peek) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(s.boardX, s.boardY, BOARD_W, 900);
		ctx.clip();
		ctx.globalAlpha = s.complete ? 1 : .92;
		ctx.drawImage(s.img, s.boardX, s.boardY, BOARD_W, 900);
		ctx.restore();
	}
	for (const p of loose) {
		ctx.globalAlpha = s.edges && !p.isEdge ? .18 : 1;
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
function roundRect(ctx, x, y, w, h, r) {
	const rr = Math.min(r, w / 2, h / 2);
	ctx.beginPath();
	ctx.moveTo(x + rr, y);
	ctx.arcTo(x + w, y, x + w, y + h, rr);
	ctx.arcTo(x + w, y + h, x, y + h, rr);
	ctx.arcTo(x, y + h, x, y, rr);
	ctx.arcTo(x, y, x + w, y, rr);
	ctx.closePath();
}
function PlayHud({ title, cutLabel, hud, api, onBack, onRestart }) {
	const pct = hud.total ? Math.round((hud.total - hud.remaining) / hud.total * 100) : 0;
	const call = (fn, arg) => {
		const h = api.current;
		if (!h) return;
		h[fn](arg);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 sm:p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "icon",
					onClick: onBack,
					"aria-label": "Back to salon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden rounded-md border border-border bg-surface/90 px-3 py-1.5 sm:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-sm font-medium tracking-tight text-fg",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: cutLabel
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto flex items-center gap-2 rounded-md border border-border bg-surface/90 px-3 py-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-sm tabular-nums text-fg",
						children: formatTime(hud.elapsed)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-px bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-sm tabular-nums text-muted",
						children: [pct, "%"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden font-mono text-xs tabular-nums text-subtle sm:inline",
						children: [hud.remaining, " left"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto flex flex-wrap justify-end gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "icon",
						onClick: () => call("toggleGhost"),
						"aria-label": hud.ghost ? "Hide ghost" : "Show ghost",
						children: hud.ghost ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "icon",
						onClick: () => call("toggleSound"),
						"aria-label": hud.sound ? "Mute" : "Unmute",
						children: hud.sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "icon-sm",
						onClick: () => call("hint"),
						"aria-label": "Hint",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "icon-sm",
						onClick: onRestart,
						"aria-label": "Restart",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
					})
				]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 sm:p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2 rounded-lg border border-border bg-surface/92 px-2 py-2 sm:justify-between sm:px-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hidden min-w-0 flex-1 truncate px-2 text-xs text-muted sm:block",
				children: hud.selected ? hud.upright ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-ok",
					children: "Upright — ready to settle"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-warn",
					children: "Turn to 0° before it will fit"
				}) : "Drag a piece to its place. It must sit upright to settle."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						disabled: !hud.selected,
						onClick: () => api.current?.rotate(-90),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "−90°"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "default",
						size: "sm",
						disabled: !hud.selected,
						onClick: () => api.current?.rotate(90),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "size-3.5" }),
							"Rotate",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
								className: "hidden rounded-xs bg-accent-fg/10 px-1 font-mono text-[10px] md:inline",
								children: "R"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: hud.edges ? "default" : "secondary",
						size: "sm",
						onClick: () => call("toggleEdges"),
						children: "Edges"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						onClick: () => call("locate"),
						"aria-label": "Find piece",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSearch, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						onClick: () => call("fit"),
						"aria-label": "Fit frame",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-4" })
					})
				]
			})]
		})
	})] });
}
var emptyHud = {
	remaining: 0,
	total: 0,
	elapsed: 0,
	selected: false,
	rotation: 0,
	upright: false,
	complete: false,
	ghost: true,
	edges: false,
	sound: true,
	pieceId: null
};
function PlayPage() {
	const { puzzleId } = Route.useParams();
	const { cut } = Route.useSearch();
	const navigate = useNavigate();
	const work = getWork(puzzleId);
	const cutInfo = getCut(cut);
	const api = (0, import_react.useRef)(null);
	const [hud, setHud] = (0, import_react.useState)(emptyHud);
	const [win, setWin] = (0, import_react.useState)(null);
	const [help, setHelp] = (0, import_react.useState)(false);
	const [settings, setSettings] = (0, import_react.useState)({
		ghost: true,
		sound: true
	});
	const [ready, setReady] = (0, import_react.useState)(false);
	const [src, setSrc] = (0, import_react.useState)(null);
	const [missing, setMissing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const save = loadSave();
		setSettings(save.settings);
		setHelp(!save.helpSeen);
		setHud((h) => ({
			...h,
			ghost: save.settings.ghost,
			sound: save.settings.sound
		}));
	}, []);
	(0, import_react.useEffect)(() => {
		if (!work) {
			setMissing(true);
			return;
		}
		if (work.id === "custom") {
			const stored = loadCustomImage();
			if (!stored) {
				setMissing(true);
				return;
			}
			setSrc(stored);
		} else setSrc(work.src);
		setReady(true);
	}, [work]);
	(0, import_react.useEffect)(() => {
		patchSettings({
			ghost: hud.ghost,
			sound: hud.sound
		});
	}, [hud.ghost, hud.sound]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.code === "KeyR" || e.code === "Space") {
				if (e.code === "Space" && !e.repeat) {
					e.preventDefault();
					api.current?.peek(true);
					return;
				}
				if (e.code === "KeyR") {
					e.preventDefault();
					api.current?.rotate(90);
				}
			}
			if (e.code === "KeyQ") {
				e.preventDefault();
				api.current?.rotate(-90);
			}
			if (e.code === "KeyH") {
				e.preventDefault();
				api.current?.hint();
			}
			if (e.code === "KeyG") {
				e.preventDefault();
				api.current?.toggleGhost();
			}
			if (e.code === "KeyF") {
				e.preventDefault();
				api.current?.fit();
			}
			if (e.code === "Escape") api.current?.peek(false);
		};
		const onUp = (e) => {
			if (e.code === "Space") {
				e.preventDefault();
				api.current?.peek(false);
			}
		};
		window.addEventListener("keydown", onKey);
		window.addEventListener("keyup", onUp);
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("keyup", onUp);
		};
	}, []);
	const onWin = (0, import_react.useCallback)((seconds) => {
		const best = recordBest(puzzleId, cut, Math.round(seconds)).best[puzzleId]?.[cut] ?? Math.round(seconds);
		setWin({
			seconds: Math.round(seconds),
			best
		});
	}, [puzzleId, cut]);
	const goSalon = () => {
		navigate({ to: "/" });
	};
	if (missing || !work) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg px-6 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl",
			children: "That sitting is not on the wall."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: goSalon,
			children: "Return to salon"
		})]
	});
	const nextCut = CUTS.find((c) => c.id > cut);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-dvh w-full overflow-hidden bg-bg",
		children: [
			ready && src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuzzleCanvas, {
				ref: api,
				imageUrl: src,
				cols: cutInfo.cols,
				rows: cutInfo.rows,
				ghostDefault: settings.ghost,
				soundDefault: settings.sound,
				onWin,
				onHud: setHud
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full items-center justify-center text-sm text-muted",
				children: "Laying the table…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayHud, {
				title: work.title,
				cutLabel: `${cutInfo.label} · ${cutInfo.id}`,
				hud,
				api,
				onBack: goSalon,
				onRestart: () => {
					setWin(null);
					api.current?.restart();
				}
			}),
			help ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-30 flex items-end justify-center bg-bg/70 p-4 sm:items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "modal-enter w-full max-w-md rounded-xl border border-border bg-surface p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.16em] text-muted",
							children: "How the table works"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-2xl font-medium tracking-tight",
							children: "Turn, then seat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-2 text-sm leading-relaxed text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Pieces scatter already rotated. Drag them onto the linen." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A piece only settles when it is upright (0°) and over its exact slot." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Rotate with R, right-click, or a double-tap. Hold Space to study the picture." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Scroll to zoom. Drag empty linen to pan. Edges hides the interiors." })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-6 w-full",
							onClick: () => {
								markHelpSeen();
								setHelp(false);
							},
							children: "Begin"
						})
					]
				})
			}) : null,
			win ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-30 flex items-center justify-center bg-bg/80 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "modal-enter w-full max-w-md rounded-xl border border-border bg-surface p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.16em] text-muted",
							children: "Assembled"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-3xl font-medium tracking-tight",
							children: work.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid grid-cols-2 gap-3 rounded-md border border-border bg-elevated p-3 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] uppercase tracking-wider text-muted",
								children: "Time"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-lg tabular-nums text-fg",
								children: formatTime(win.seconds)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] uppercase tracking-wider text-muted",
								children: "Best"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-lg tabular-nums text-fg",
								children: formatTime(win.best ?? win.seconds)
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-col gap-2 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								className: "flex-1",
								onClick: () => {
									setWin(null);
									api.current?.restart();
								},
								children: "Replay"
							}), nextCut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "flex-1",
								onClick: () => {
									setWin(null);
									navigate({
										to: "/play/$puzzleId",
										params: { puzzleId },
										search: { cut: nextCut.id }
									});
								},
								children: nextCut.label
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "flex-1",
								onClick: goSalon,
								children: "Return to salon"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-3 text-xs text-muted hover:text-fg",
							onClick: goSalon,
							children: "Salon wall"
						})
					]
				})
			}) : null
		]
	});
}
//#endregion
export { PlayPage as component };
