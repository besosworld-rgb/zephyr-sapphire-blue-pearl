import type { RefObject } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lightbulb,
  Maximize2,
  RotateCcw,
  RotateCw,
  ScanSearch,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import type { HudSnapshot, PuzzleHandle } from "@/lib/puzzle/types";

type Props = {
  title: string;
  cutLabel: string;
  hud: HudSnapshot;
  api: RefObject<PuzzleHandle | null>;
  onBack: () => void;
  onRestart: () => void;
};

export function PlayHud({ title, cutLabel, hud, api, onBack, onRestart }: Props) {
  const pct = hud.total ? Math.round(((hud.total - hud.remaining) / hud.total) * 100) : 0;
  const call = (fn: keyof PuzzleHandle, arg?: never) => {
    const h = api.current;
    if (!h) return;
    (h[fn] as (a?: never) => void)(arg);
  };

  return (
    <>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 sm:p-4">
        <div className="pointer-events-auto flex items-center gap-2">
          <Button variant="secondary" size="icon" onClick={onBack} aria-label="Back to salon">
            <ArrowLeft className="size-4" />
          </Button>
          <div className="hidden rounded-md border border-border bg-surface/90 px-3 py-1.5 sm:block">
            <p className="font-display text-sm font-medium tracking-tight text-fg">{title}</p>
            <p className="text-xs text-muted">{cutLabel}</p>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 rounded-md border border-border bg-surface/90 px-3 py-1.5">
          <span className="font-mono text-sm tabular-nums text-fg">{formatTime(hud.elapsed)}</span>
          <span className="h-3 w-px bg-border" />
          <span className="font-mono text-sm tabular-nums text-muted">{pct}%</span>
          <span className="hidden font-mono text-xs tabular-nums text-subtle sm:inline">
            {hud.remaining} left
          </span>
        </div>

        <div className="pointer-events-auto flex flex-wrap justify-end gap-1">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => call("toggleGhost")}
            aria-label={hud.ghost ? "Hide ghost" : "Show ghost"}
          >
            {hud.ghost ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => call("toggleSound")}
            aria-label={hud.sound ? "Mute" : "Unmute"}
          >
            {hud.sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </Button>
          <Button variant="secondary" size="icon-sm" onClick={() => call("hint")} aria-label="Hint">
            <Lightbulb className="size-4" />
          </Button>
          <Button variant="secondary" size="icon-sm" onClick={onRestart} aria-label="Restart">
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 sm:p-4">
        <div className="pointer-events-auto mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2 rounded-lg border border-border bg-surface/92 px-2 py-2 sm:justify-between sm:px-3">
          <p className="hidden min-w-0 flex-1 truncate px-2 text-xs text-muted sm:block">
            {hud.selected ? (
              hud.upright ? (
                <span className="text-ok">Upright — ready to settle</span>
              ) : (
                <span className="text-warn">Turn to 0° before it will fit</span>
              )
            ) : (
              "Drag a piece to its place. It must sit upright to settle."
            )}
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="secondary"
              size="sm"
              disabled={!hud.selected}
              onClick={() => api.current?.rotate(-90)}
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline">−90°</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              disabled={!hud.selected}
              onClick={() => api.current?.rotate(90)}
            >
              <RotateCw className="size-3.5" />
              Rotate
              <kbd className="hidden rounded-xs bg-accent-fg/10 px-1 font-mono text-[10px] md:inline">
                R
              </kbd>
            </Button>
            <Button
              variant={hud.edges ? "default" : "secondary"}
              size="sm"
              onClick={() => call("toggleEdges")}
            >
              Edges
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => call("locate")} aria-label="Find piece">
              <ScanSearch className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => call("fit")} aria-label="Fit frame">
              <Maximize2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
