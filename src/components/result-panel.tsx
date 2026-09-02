import { AlertTriangle, Check } from "lucide-react";
import { usePackStore } from "@/lib/store";
import type { PackResult } from "@/lib/types";
import { formatLen, formatVolume } from "@/lib/units";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

export function ResultPanel({ result }: { result: PackResult }) {
  const unit = usePackStore((s) => s.unit);
  const setSelected = usePackStore((s) => s.setSelected);
  const selectedId = usePackStore((s) => s.selectedId);
  const packedCount = result.placements.length;
  const leftoverCount = result.unpacked.length;
  const pct = Math.round(result.fillRatio * 100);
  const remaining = Math.max(0, result.binVolume - result.usedVolume);
  const ok = leftoverCount === 0 && packedCount > 0;

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-medium text-foreground">Result</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {packedCount} packed
            {leftoverCount > 0 ? ` · ${leftoverCount} left out` : ""}
          </p>
        </div>
        <Badge variant={ok ? "ok" : leftoverCount > 0 ? "danger" : "default"}>
          {packedCount === 0 && leftoverCount === 0 ? "Empty" : ok ? "All fit" : "Won't all fit"}
        </Badge>
      </header>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between font-mono text-xs tabular-nums text-muted-foreground">
          <span>Fill</span>
          <span className="text-foreground">{pct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-[width] duration-300", leftoverCount > 0 ? "bg-warn" : "bg-ok")}
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
        <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {formatVolume(result.usedVolume, unit)} used · {formatVolume(remaining, unit)} free
        </p>
      </div>

      {leftoverCount > 0 && (
        <div className="rounded-xl bg-destructive/10 p-3 shadow-[0_0_0_1px_rgba(180,92,78,0.28)]">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-destructive">
            <AlertTriangle className="size-4" />
            Cannot fit {leftoverCount} piece{leftoverCount === 1 ? "" : "s"}
          </div>
          <ul className="space-y-2">
            {result.unpacked.map((u) => (
              <li key={u.instanceId} className="text-xs leading-relaxed">
                <button
                  type="button"
                  className="text-left text-foreground"
                  onClick={() => setSelected(u.itemId)}
                >
                  {u.name}
                </button>
                <span className="mt-0.5 block text-muted-foreground">{u.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {ok && (
        <div className="flex items-start gap-2 rounded-xl bg-ok/10 p-3 text-xs leading-relaxed text-foreground shadow-[0_0_0_1px_rgba(125,154,126,0.28)]">
          <Check className="mt-0.5 size-4 shrink-0 text-ok" />
          Everything fits. Drag the view to inspect, or explode the stack to see each piece.
        </div>
      )}

      {packedCount > 0 && (
        <ul className="max-h-48 space-y-1 overflow-auto pr-1">
          {result.placements.map((p) => (
            <li key={p.instanceId}>
              <button
                type="button"
                onClick={() => setSelected(p.instanceId)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition-colors duration-150 hover:bg-muted",
                  selectedId === p.instanceId && "bg-muted",
                )}
              >
                <span className="size-2.5 shrink-0 rounded-sm" style={{ background: p.color }} />
                <span className="min-w-0 flex-1 truncate text-foreground">{p.name}</span>
                <span className="shrink-0 font-mono tabular-nums text-muted-foreground">
                  {formatLen(p.w, unit)}×{formatLen(p.h, unit)}×{formatLen(p.d, unit)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
