import { Maximize2, RotateCcw, Tag } from "lucide-react";
import { Suspense, lazy, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePackStore } from "@/lib/store";
import type { PackResult } from "@/lib/types";
import { cn } from "@/lib/utils";

const PackingCanvas = lazy(() =>
  import("./packing-canvas").then((m) => ({ default: m.PackingCanvas })),
);

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
          <Suspense fallback={<ViewportFallback />}>
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
          <ViewportFallback />
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3 sm:p-4">
        <AxisLegend />
        <div className="pointer-events-auto flex items-center gap-1 rounded-xl bg-background/80 p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Toggle dimension labels"
            onClick={() => setShowLabels(!showLabels)}
            className={cn(showLabels && "bg-muted")}
          >
            <Tag />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Reset camera" onClick={resetCamera}>
            <RotateCcw />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Fit view"
            onClick={resetCamera}
            className="hidden sm:inline-flex"
          >
            <Maximize2 />
          </Button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">
        <div className="pointer-events-auto mx-auto flex max-w-md items-center gap-3 rounded-xl bg-background/80 px-3 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
          <span className="w-16 shrink-0 text-[11px] font-medium tracking-wide text-muted-foreground">
            Explode
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(explode * 100)}
            onChange={(e) => setExplode(Number(e.target.value) / 100)}
            className="h-11 w-full cursor-pointer accent-primary"
            aria-label="Explode packing"
          />
        </div>
      </div>
    </section>
  );
}

function AxisLegend() {
  return (
    <ul className="pointer-events-none space-y-1 rounded-xl bg-background/80 px-3 py-2 font-mono text-[10px] tracking-wide text-muted-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
      <li className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-axis-x" /> X width
      </li>
      <li className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-axis-y" /> Y height
      </li>
      <li className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-axis-z" /> Z depth
      </li>
    </ul>
  );
}

function ViewportFallback() {
  return <div className="h-full w-full bg-background" aria-hidden />;
}
