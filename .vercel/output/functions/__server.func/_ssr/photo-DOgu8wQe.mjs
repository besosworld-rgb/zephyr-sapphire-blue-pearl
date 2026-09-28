import "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatTime(totalSeconds) {
	const s = Math.max(0, Math.floor(totalSeconds));
	const m = Math.floor(s / 60);
	const sec = s % 60;
	return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-fg",
			secondary: "bg-elevated text-fg border border-border hover:bg-surface",
			ghost: "text-muted hover:text-fg hover:bg-elevated",
			outline: "border border-border text-fg hover:bg-elevated"
		},
		size: {
			default: "h-11 rounded-md px-4 text-sm",
			sm: "h-9 rounded-sm px-3 text-sm",
			lg: "h-12 rounded-md px-5 text-sm",
			icon: "size-11 rounded-md",
			"icon-sm": "size-9 rounded-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var CUTS = [
	{
		id: 12,
		cols: 4,
		rows: 3,
		label: "Sketch",
		note: "Twelve pieces"
	},
	{
		id: 24,
		cols: 6,
		rows: 4,
		label: "Study",
		note: "Twenty-four pieces"
	},
	{
		id: 48,
		cols: 8,
		rows: 6,
		label: "Sitting",
		note: "Forty-eight pieces"
	}
];
var WORKS = [
	{
		id: "toast",
		title: "The Toast",
		caption: "A terrace dinner catching the last of the light.",
		credit: "Salon sitting",
		src: "/puzzles/toast.jpg"
	},
	{
		id: "harbor",
		title: "Night Harbor",
		caption: "Lanterns laid on still water, after the boats come in.",
		credit: "Salon sitting",
		src: "/puzzles/harbor.jpg"
	},
	{
		id: "orangerie",
		title: "Glasshouse",
		caption: "Citrus and iron, kept under a weather of panes.",
		credit: "Salon sitting",
		src: "/puzzles/orangerie.jpg"
	},
	{
		id: "alpine",
		title: "First Light",
		caption: "A high lake before the wind finds it.",
		credit: "Salon sitting",
		src: "/puzzles/alpine.jpg"
	},
	{
		id: "library",
		title: "The Stacks",
		caption: "A room built to hold quiet, and the dust of reading.",
		credit: "Salon sitting",
		src: "/puzzles/library.jpg"
	},
	{
		id: "kites",
		title: "Late Bloom",
		caption: "A low sun on the bulbs, row after row.",
		credit: "Salon sitting",
		src: "/puzzles/kites.jpg"
	}
];
var CUSTOM_WORK = {
	id: "custom",
	title: "Your sitting",
	caption: "A picture you brought to the table.",
	credit: "Private",
	src: ""
};
function getWork(id) {
	if (id === "custom") return CUSTOM_WORK;
	return WORKS.find((w) => w.id === id);
}
function getCut(id) {
	return CUTS.find((c) => c.id === id) ?? CUTS[1];
}
var KEY = "serene.v1";
var SAVE_VERSION = 1;
var defaults = {
	version: SAVE_VERSION,
	best: {},
	settings: {
		sound: true,
		ghost: true
	},
	helpSeen: false
};
function migrate(raw) {
	return {
		...defaults,
		...raw,
		settings: {
			...defaults.settings,
			...raw?.settings
		},
		best: raw?.best ?? {},
		version: SAVE_VERSION
	};
}
function loadSave() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return {
			...defaults,
			settings: { ...defaults.settings },
			best: {}
		};
		return migrate(JSON.parse(raw));
	} catch {
		return {
			...defaults,
			settings: { ...defaults.settings },
			best: {}
		};
	}
}
function writeSave(next) {
	try {
		localStorage.setItem(KEY, JSON.stringify(next));
	} catch {}
}
function recordBest(workId, cut, seconds) {
	const save = loadSave();
	const prev = save.best[workId]?.[cut];
	if (prev != null && prev <= seconds) return save;
	save.best[workId] = {
		...save.best[workId],
		[cut]: seconds
	};
	writeSave(save);
	return save;
}
function markHelpSeen() {
	const save = loadSave();
	save.helpSeen = true;
	writeSave(save);
}
function patchSettings(patch) {
	const save = loadSave();
	save.settings = {
		...save.settings,
		...patch
	};
	writeSave(save);
	return save;
}
var TARGET_W = 1600;
var TARGET_H = 1200;
function normalizePhoto(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that picture."));
		reader.onload = () => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				canvas.width = TARGET_W;
				canvas.height = TARGET_H;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					reject(/* @__PURE__ */ new Error("Canvas unavailable."));
					return;
				}
				const scale = Math.max(TARGET_W / img.width, TARGET_H / img.height);
				const dw = img.width * scale;
				const dh = img.height * scale;
				ctx.fillStyle = "#111113";
				ctx.fillRect(0, 0, TARGET_W, TARGET_H);
				ctx.drawImage(img, (TARGET_W - dw) / 2, (TARGET_H - dh) / 2, dw, dh);
				resolve(canvas.toDataURL("image/jpeg", .88));
			};
			img.onerror = () => reject(/* @__PURE__ */ new Error("That file is not a usable picture."));
			img.src = String(reader.result);
		};
		reader.readAsDataURL(file);
	});
}
var CUSTOM_KEY = "serene.custom.image";
function storeCustomImage(dataUrl) {
	try {
		sessionStorage.setItem(CUSTOM_KEY, dataUrl);
	} catch {}
}
function loadCustomImage() {
	try {
		return sessionStorage.getItem(CUSTOM_KEY);
	} catch {
		return null;
	}
}
//#endregion
export { formatTime as a, loadCustomImage as c, normalizePhoto as d, patchSettings as f, cn as i, loadSave as l, storeCustomImage as m, CUTS as n, getCut as o, recordBest as p, WORKS as r, getWork as s, Button as t, markHelpSeen as u };
