import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PuzzleCanvas } from "@/components/puzzle/PuzzleCanvas";
import { PlayHud } from "@/components/puzzle/PlayHud";
import { Button } from "@/components/ui/button";
import { CUTS, getCut, getWork, type CutId } from "@/lib/puzzle/catalog";
import { loadCustomImage } from "@/lib/puzzle/photo";
import { loadSave, markHelpSeen, patchSettings, recordBest } from "@/lib/puzzle/save";
import { formatTime } from "@/lib/utils";
import type { HudSnapshot, PuzzleHandle } from "@/lib/puzzle/types";

export const Route = createFileRoute("/play/$puzzleId")({
  validateSearch: (s: Record<string, unknown>) => {
    const cut = Number(s.cut);
    return { cut: ([12, 24, 48] as number[]).includes(cut) ? (cut as CutId) : (24 as CutId) };
  },
  component: PlayPage,
});

const emptyHud: HudSnapshot = {
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
  pieceId: null,
};

function PlayPage() {
  const { puzzleId } = Route.useParams();
  const { cut } = Route.useSearch();
  const navigate = useNavigate();
  const work = getWork(puzzleId);
  const cutInfo = getCut(cut);
  const api = useRef<PuzzleHandle>(null);
  const [hud, setHud] = useState<HudSnapshot>(emptyHud);
  const [win, setWin] = useState<{ seconds: number; best: number | null } | null>(null);
  const [help, setHelp] = useState(false);
  const [settings, setSettings] = useState({ ghost: true, sound: true });
  const [ready, setReady] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const save = loadSave();
    setSettings(save.settings);
    setHelp(!save.helpSeen);
    setHud((h) => ({ ...h, ghost: save.settings.ghost, sound: save.settings.sound }));
  }, []);

  useEffect(() => {
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
    } else {
      setSrc(work.src);
    }
    setReady(true);
  }, [work]);

  useEffect(() => {
    patchSettings({ ghost: hud.ghost, sound: hud.sound });
  }, [hud.ghost, hud.sound]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
      if (e.code === "Escape") {
        api.current?.peek(false);
      }
    };
    const onUp = (e: KeyboardEvent) => {
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

  const onWin = useCallback(
    (seconds: number) => {
      const next = recordBest(puzzleId, cut, Math.round(seconds));
      const best = next.best[puzzleId]?.[cut] ?? Math.round(seconds);
      setWin({ seconds: Math.round(seconds), best });
    },
    [puzzleId, cut],
  );

  const goSalon = () => {
    void navigate({ to: "/" });
  };

  if (missing || !work) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg px-6 text-center">
        <p className="font-display text-2xl">That sitting is not on the wall.</p>
        <Button onClick={goSalon}>Return to salon</Button>
      </div>
    );
  }

  const nextCut = CUTS.find((c) => c.id > cut);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bg">
      {ready && src ? (
        <PuzzleCanvas
          ref={api}
          imageUrl={src}
          cols={cutInfo.cols}
          rows={cutInfo.rows}
          ghostDefault={settings.ghost}
          soundDefault={settings.sound}
          onWin={onWin}
          onHud={setHud}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted">
          Laying the table…
        </div>
      )}

      <PlayHud
        title={work.title}
        cutLabel={`${cutInfo.label} · ${cutInfo.id}`}
        hud={hud}
        api={api}
        onBack={goSalon}
        onRestart={() => {
          setWin(null);
          api.current?.restart();
        }}
      />

      {help ? (
        <div className="absolute inset-0 z-30 flex items-end justify-center bg-bg/70 p-4 sm:items-center">
          <div className="modal-enter w-full max-w-md rounded-xl border border-border bg-surface p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">How the table works</p>
            <h2 className="mt-1 font-display text-2xl font-medium tracking-tight">Turn, then seat</h2>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
              <li>Pieces scatter already rotated. Drag them onto the linen.</li>
              <li>A piece only settles when it is upright (0°) and over its exact slot.</li>
              <li>Rotate with R, right-click, or a double-tap. Hold Space to study the picture.</li>
              <li>Scroll to zoom. Drag empty linen to pan. Edges hides the interiors.</li>
            </ul>
            <Button
              className="mt-6 w-full"
              onClick={() => {
                markHelpSeen();
                setHelp(false);
              }}
            >
              Begin
            </Button>
          </div>
        </div>
      ) : null}

      {win ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-bg/80 p-4">
          <div className="modal-enter w-full max-w-md rounded-xl border border-border bg-surface p-6 text-center">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Assembled</p>
            <h2 className="mt-1 font-display text-3xl font-medium tracking-tight">{work.title}</h2>
            <div className="mt-5 grid grid-cols-2 gap-3 rounded-md border border-border bg-elevated p-3 text-left">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted">Time</p>
                <p className="font-mono text-lg tabular-nums text-fg">{formatTime(win.seconds)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted">Best</p>
                <p className="font-mono text-lg tabular-nums text-fg">{formatTime(win.best ?? win.seconds)}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setWin(null);
                  api.current?.restart();
                }}
              >
                Replay
              </Button>
              {nextCut ? (
                <Button
                  className="flex-1"
                  onClick={() => {
                    setWin(null);
                    void navigate({
                      to: "/play/$puzzleId",
                      params: { puzzleId },
                      search: { cut: nextCut.id },
                    });
                  }}
                >
                  {nextCut.label}
                </Button>
              ) : (
                <Button className="flex-1" onClick={goSalon}>
                  Return to salon
                </Button>
              )}
            </div>
            <button
              type="button"
              className="mt-3 text-xs text-muted hover:text-fg"
              onClick={goSalon}
            >
              Salon wall
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
