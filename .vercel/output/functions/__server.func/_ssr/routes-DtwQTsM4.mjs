import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Upload, p as Check, t as X } from "../_libs/lucide-react.mjs";
import { a as formatTime, c as loadCustomImage, d as normalizePhoto, i as cn, l as loadSave, m as storeCustomImage, n as CUTS, r as WORKS, t as Button } from "./photo-DOgu8wQe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DtwQTsM4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptySave = {
	version: 1,
	best: {},
	settings: {
		sound: true,
		ghost: true
	},
	helpSeen: false
};
function Gallery() {
	const navigate = useNavigate();
	const [open, setOpen] = (0, import_react.useState)(null);
	const [customSrc, setCustomSrc] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [save, setSave] = (0, import_react.useState)(emptySave);
	const fileRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setMounted(true);
		setCustomSrc(loadCustomImage());
		setSave(loadSave());
	}, []);
	(0, import_react.useEffect)(() => {
		if (!mounted) return;
		setSave(loadSave());
	}, [
		open,
		customSrc,
		mounted
	]);
	const begin = (work, cut) => {
		if (work.id === "custom" && !customSrc) return;
		navigate({
			to: "/play/$puzzleId",
			params: { puzzleId: work.id },
			search: { cut }
		});
	};
	const onUpload = async (file) => {
		setError(null);
		try {
			const data = await normalizePhoto(file);
			storeCustomImage(data);
			setCustomSrc(data);
			setOpen({
				id: "custom",
				title: "Your sitting",
				caption: "A picture you brought to the table.",
				credit: "Private",
				src: data
			});
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not use that picture.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "linen min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-6xl flex-col gap-4 px-5 pb-6 pt-8 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:pt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.18em] text-muted",
						children: "Private salon"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl",
						children: "Serene"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-md text-sm leading-relaxed text-muted",
						children: "A quiet room for assembling pictures. Pieces arrive turned — rotate them upright before they will settle into the frame."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "image/*",
						className: "hidden",
						onChange: (e) => {
							const f = e.target.files?.[0];
							if (f) onUpload(f);
							e.target.value = "";
						}
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "self-start",
						onClick: () => fileRef.current?.click(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "Your picture"]
					})]
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto max-w-6xl px-5 pb-4 text-sm text-warn sm:px-8",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-6xl grid-cols-1 gap-5 px-5 pb-20 sm:grid-cols-2 sm:px-8 lg:grid-cols-3",
				children: [WORKS.map((work, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkCard, {
					work,
					featured: i === 0,
					best: save.best[work.id],
					onOpen: () => setOpen(work)
				}, work.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => fileRef.current?.click(),
					className: "group flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface/40 p-6 text-center transition-colors hover:border-accent/40 hover:bg-elevated",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-5 text-muted group-hover:text-fg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg text-fg",
						children: "Bring a picture"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Any photo, cut to the same table."
					})] })]
				})]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudySheet, {
				work: open,
				src: open.id === "custom" ? customSrc ?? open.src : open.src,
				best: save.best[open.id],
				onClose: () => setOpen(null),
				onBegin: (cut) => begin(open, cut)
			}) : null
		]
	});
}
function WorkCard({ work, featured, best, onOpen }) {
	const done = CUTS.filter((c) => best?.[c.id] != null).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: onOpen,
		className: cn("group overflow-hidden rounded-xl border border-border bg-surface text-left transition-colors hover:border-accent/35", featured && "sm:col-span-2"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative overflow-hidden", featured ? "aspect-[16/9]" : "aspect-[4/3]"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: work.src,
					alt: work.title,
					className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-0 left-0 right-0 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-medium tracking-tight text-fg",
							children: work.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-sm text-muted",
							children: work.caption
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex gap-1",
							children: [CUTS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("size-1.5 rounded-full", best?.[c.id] != null ? "bg-ok" : "bg-fg/20"),
								title: c.label
							}, c.id)), done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-1 text-[10px] uppercase tracking-wider text-muted",
								children: [
									done,
									"/",
									CUTS.length
								]
							}) : null]
						})
					]
				})
			]
		})
	});
}
function StudySheet({ work, src, best, onClose, onBegin }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-40 flex items-end justify-center bg-bg/80 p-3 sm:items-center sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "absolute inset-0",
			"aria-label": "Close",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "modal-enter relative grid w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-surface shadow-2xl md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-[4/3] bg-elevated md:aspect-auto md:min-h-[420px]",
				children: src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: work.title,
					className: "h-full w-full object-cover"
				}) : null
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-col p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "absolute right-4 top-4 flex size-9 items-center justify-center rounded-sm text-muted hover:bg-elevated hover:text-fg",
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.16em] text-muted",
						children: work.credit
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-3xl font-medium tracking-tight",
						children: work.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: work.caption
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs leading-relaxed text-subtle",
						children: "Pieces scatter on the table already rotated. Turn each one upright (0°) and seat it in its exact place. Double-tap, right-click, or press R to rotate."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 flex flex-col gap-2",
						children: CUTS.map((cut) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onBegin(cut.id),
							className: "flex items-center justify-between rounded-md border border-border bg-elevated px-4 py-3 text-left hover:border-accent/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-medium text-fg",
								children: cut.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: cut.note
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex items-center gap-2 font-mono text-xs tabular-nums text-muted",
								children: best?.[cut.id] != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-ok" }), formatTime(best[cut.id])] }) : "Begin"
							})]
						}, cut.id))
					})
				]
			})]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gallery, {});
}
//#endregion
export { Home as component };
