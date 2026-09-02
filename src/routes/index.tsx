import { createFileRoute } from "@tanstack/react-router";
import { Box, Layers } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ItemList } from "@/components/item-list";
import { ResultPanel } from "@/components/result-panel";
import { Viewport } from "@/components/scene/viewport";
import { SpacePanel } from "@/components/space-panel";
import { Badge } from "@/components/ui/badge";
import { packBin } from "@/lib/packer";
import { usePackStore } from "@/lib/store";
import { formatLen } from "@/lib/units";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const hydrate = usePackStore((s) => s.hydrate);
  const bin = usePackStore((s) => s.bin);
  const items = usePackStore((s) => s.items);
  const unit = usePackStore((s) => s.unit);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const result = useMemo(() => packBin(bin, items), [bin, items]);
  const leftover = result.unpacked.length;
  const [tab, setTab] = useState<"space" | "items" | "result">("space");

  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground lg:h-dvh lg:overflow-hidden">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="font-display text-xl font-medium tracking-tight text-foreground">Stow</p>
          <p className="truncate text-xs text-muted-foreground">Pack a space. See it in 3D.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={leftover > 0 ? "danger" : result.placements.length ? "ok" : "default"}>
            {leftover > 0
              ? `${leftover} left out`
              : result.placements.length
                ? "Fits"
                : "Empty"}
          </Badge>
          <span className="hidden font-mono text-[11px] tabular-nums text-muted-foreground sm:inline">
            {formatLen(bin.w, unit)} × {formatLen(bin.h, unit)} × {formatLen(bin.d, unit)}
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <Viewport result={result} />

        <aside className="flex w-full shrink-0 flex-col border-t border-border bg-card lg:h-full lg:w-[380px] lg:border-t-0 lg:border-l">
          <nav className="flex shrink-0 gap-1 border-b border-border p-2 lg:hidden">
            <TabBtn active={tab === "space"} onClick={() => setTab("space")} icon={<Box className="size-4" />}>
              Space
            </TabBtn>
            <TabBtn active={tab === "items"} onClick={() => setTab("items")} icon={<Layers className="size-4" />}>
              Objects
            </TabBtn>
            <TabBtn active={tab === "result"} onClick={() => setTab("result")}>
              Result
            </TabBtn>
          </nav>

          <div className="hidden min-h-0 flex-1 flex-col overflow-y-auto lg:flex">
            <section className="border-b border-border p-5">
              <SpacePanel />
            </section>
            <section className="border-b border-border p-5">
              <ItemList />
            </section>
            <section className="p-5">
              <ResultPanel result={result} />
            </section>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 lg:hidden">
            {tab === "space" && <SpacePanel />}
            {tab === "items" && <ItemList />}
            {tab === "result" && <ResultPanel result={result} />}
          </div>
        </aside>
      </div>
    </main>
  );
}

function TabBtn({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors duration-150",
        active ? "bg-muted text-foreground" : "text-muted-foreground",
      )}
    >
      {icon}
      {children}
    </button>
  );
}
