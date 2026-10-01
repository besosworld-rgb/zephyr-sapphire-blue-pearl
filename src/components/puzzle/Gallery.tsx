import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CUTS, WORKS, type CutId, type Work } from "@/lib/puzzle/catalog";
import { loadSave, type SaveState } from "@/lib/puzzle/save";
import { loadCustomImage, normalizePhoto, storeCustomImage } from "@/lib/puzzle/photo";
import { cn, formatTime } from "@/lib/utils";

const emptySave: SaveState = {
  version: 1,
  best: {},
  settings: { sound: true, ghost: true },
  helpSeen: false,
};

export function Gallery() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<Work | null>(null);
  const [customSrc, setCustomSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [save, setSave] = useState<SaveState>(emptySave);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    setCustomSrc(loadCustomImage());
    setSave(loadSave());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setSave(loadSave());
  }, [open, customSrc, mounted]);

  const begin = (work: Work, cut: CutId) => {
    if (work.id === "custom" && !customSrc) return;
    void navigate({
      to: "/play/$puzzleId",
      params: { puzzleId: work.id },
      search: { cut },
    });
  };

  const onUpload = async (file: File) => {
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
        src: data,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not use that picture.");
    }
  };

  return (
    <div className="linen min-h-dvh">
      <header className="mx-auto flex max-w-6xl flex-col gap-4 px-5 pb-6 pt-8 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:pt-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Private salon</p>
          <h1 className="mt-1 font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl">
            Serene
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            A quiet room for assembling pictures. Pieces arrive turned — rotate them upright
            before they will settle into the frame.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {mounted ? (
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onUpload(f);
                e.target.value = "";
              }}
            />
          ) : null}
          <Button variant="secondary" className="self-start" onClick={() => fileRef.current?.click()}>
            <Upload className="size-4" />
            Your picture
          </Button>
        </div>
      </header>

      {error ? (
        <p className="mx-auto max-w-6xl px-5 pb-4 text-sm text-warn sm:px-8">{error}</p>
      ) : null}

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-5 pb-20 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {WORKS.map((work, i) => (
          <WorkCard
            key={work.id}
            work={work}
            featured={i === 0}
            best={save.best[work.id]}
            onOpen={() => setOpen(work)}
          />
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface/40 p-6 text-center transition-colors hover:border-accent/40 hover:bg-elevated"
        >
          <Upload className="size-5 text-muted group-hover:text-fg" />
          <div>
            <p className="font-display text-lg text-fg">Bring a picture</p>
            <p className="mt-1 text-sm text-muted">Any photo, cut to the same table.</p>
          </div>
        </button>
      </section>

      {open ? (
        <StudySheet
          work={open}
          src={open.id === "custom" ? customSrc ?? open.src : open.src}
          best={save.best[open.id]}
          onClose={() => setOpen(null)}
          onBegin={(cut) => begin(open, cut)}
        />
      ) : null}
    </div>
  );
}

function WorkCard({
  work,
  featured,
  best,
  onOpen,
}: {
  work: Work;
  featured: boolean;
  best?: Partial<Record<CutId, number>>;
  onOpen: () => void;
}) {
  const done = CUTS.filter((c) => best?.[c.id] != null).length;
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group overflow-hidden rounded-xl border border-border bg-surface text-left transition-colors hover:border-accent/35",
        featured && "sm:col-span-2",
      )}
    >
      <div className={cn("relative overflow-hidden", featured ? "aspect-[16/9]" : "aspect-[4/3]")}>
        <img
          src={work.src}
          alt={work.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="font-display text-xl font-medium tracking-tight text-fg">{work.title}</h2>
          <p className="mt-0.5 text-sm text-muted">{work.caption}</p>
          <div className="mt-2 flex gap-1">
            {CUTS.map((c) => (
              <span
                key={c.id}
                className={cn(
                  "size-1.5 rounded-full",
                  best?.[c.id] != null ? "bg-ok" : "bg-fg/20",
                )}
                title={c.label}
              />
            ))}
            {done ? (
              <span className="ml-1 text-[10px] uppercase tracking-wider text-muted">
                {done}/{CUTS.length}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}

function StudySheet({
  work,
  src,
  best,
  onClose,
  onBegin,
}: {
  work: Work;
  src: string;
  best?: Partial<Record<CutId, number>>;
  onClose: () => void;
  onBegin: (cut: CutId) => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-bg/80 p-3 sm:items-center sm:p-6">
      <button className="absolute inset-0" aria-label="Close" onClick={onClose} />
      <div className="modal-enter relative grid w-full max-w-4xl max-h-[92dvh] overflow-hidden rounded-xl border border-border bg-surface shadow-2xl md:grid-cols-2 md:grid-rows-1">
        <div className="aspect-[4/3] shrink-0 bg-elevated md:aspect-auto md:h-full md:min-h-0">
          {src ? (
            <img src={src} alt={work.title} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="relative flex min-h-0 flex-col overflow-y-auto p-5 sm:p-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-sm text-muted hover:bg-elevated hover:text-fg"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">{work.credit}</p>
          <h2 className="mt-1 pr-8 font-display text-2xl font-medium tracking-tight sm:text-3xl">{work.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{work.caption}</p>
          <p className="mt-3 text-xs leading-relaxed text-subtle">
            Pieces scatter already rotated. Turn each one upright (0°) to seat it. Each sitting
            keeps a quiet score of its own.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-1.5 pb-2 sm:grid-cols-2">
            {CUTS.map((cut) => (
              <button
                key={cut.id}
                type="button"
                onClick={() => onBegin(cut.id)}
                className={cn(
                  "flex items-center justify-between rounded-md border border-border bg-elevated px-3 py-2.5 text-left hover:border-accent/40",
                  cut.id === 120 && "sm:col-span-2",
                )}
              >
                <span>
                  <span className="block text-sm font-medium text-fg">{cut.label}</span>
                  <span className="text-xs text-muted">{cut.note}</span>
                </span>
                <span className="flex items-center gap-2 font-mono text-xs tabular-nums text-muted">
                  {best?.[cut.id] != null ? (
                    <>
                      <Check className="size-3.5 text-ok" />
                      {formatTime(best[cut.id]!)}
                    </>
                  ) : (
                    "Begin"
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
