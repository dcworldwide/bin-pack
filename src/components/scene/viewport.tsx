import { Maximize2, RotateCcw, Tag } from "lucide-react";
import { Suspense, lazy, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePackStore } from "@/lib/store";
import type { PackResult } from "@/lib/types";
import { cn } from "@/lib/utils";

const PackingCanvas = lazy(() => import("./packing-canvas").then((m) => ({ default: m.PackingCanvas })));

export function Viewport({ result }: { result: PackResult }) {
  const bin = usePackStore((s) => s.bin);
  const unit = usePackStore((s) => s.unit);
  const selectedId = usePackStore((s) => s.selectedId);
  const setSelected = usePackStore((s) => s.setSelected);
  const explode = usePackStore((s) => s.explode);
  const setExplode = usePackStore((s) => s.setExplode);
  const showLabels = usePackStore((s) => s.showLabels);
  const setShowLabels = usePackStore((s) => s.setShowLabels);
  const cameraNonce = usePackStore((s) => s.cameraNonce);
  const resetCamera = usePackStore((s) => s.resetCamera);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <section className="relative flex min-h-[42vh] flex-1 flex-col overflow-hidden bg-background lg:min-h-0">
      <div className="absolute inset-0">
        {mounted ? (
          <Suspense fallback={<div className="h-full w-full bg-background" />}>
            <PackingCanvas
              bin={bin}
              placements={result.placements}
              selectedId={selectedId}
              onSelect={setSelected}
              explode={explode}
              showLabels={showLabels}
              unit={unit}
              cameraNonce={cameraNonce}
            />
          </Suspense>
        ) : (
          <div className="h-full w-full bg-background" />
        )}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-end p-3 sm:p-4">
        <div className="pointer-events-auto flex items-center gap-1 rounded-xl bg-background/80 p-1 pr-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Toggle edge dimensions"
            onClick={() => setShowLabels(!showLabels)}
            className={cn(showLabels && "bg-muted")}
          >
            <Tag />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Reset camera" onClick={resetCamera}>
            <RotateCcw />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Fit view" onClick={resetCamera} className="hidden sm:inline-flex">
            <Maximize2 />
          </Button>
          <span className="mx-1 hidden h-4 w-px bg-border sm:block" aria-hidden />
          <label className="flex items-center gap-2 pl-1">
            <span className="hidden text-[11px] font-medium tracking-wide text-muted-foreground sm:inline">Explode</span>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[Math.round(explode * 100)]}
              onValueChange={(v) => setExplode((v[0] ?? 0) / 100)}
              aria-label="Explode packing"
              className="w-24 sm:w-28"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
