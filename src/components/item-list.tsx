import { Copy, Plus, Trash2 } from "lucide-react";
import { ITEM_PALETTE } from "@/lib/colors";
import { usePackStore } from "@/lib/store";
import type { ItemDef } from "@/lib/types";
import { parsePositive, roundForUnit, toCm } from "@/lib/units";
import { cn } from "@/lib/utils";
import { AddItemBar, Field, RotationSelect } from "./space-panel";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function ItemList() {
  const items = usePackStore((s) => s.items);
  const clearItems = usePackStore((s) => s.clearItems);
  const selectedId = usePackStore((s) => s.selectedId);

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <h2 className="font-medium text-foreground">Objects</h2>
          <p className="text-xs text-muted-foreground">
            {items.length === 0 ? "Nothing to pack yet." : `${items.length} kind${items.length === 1 ? "" : "s"}`}
          </p>
        </div>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearItems}>
            Clear
          </Button>
        )}
      </header>
      <AddItemBar />
      {items.length === 0 ? (
        <div className="rounded-xl bg-muted/40 px-4 py-6 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
          <Plus className="mx-auto mb-2 size-4 text-muted-foreground" />
          <p className="text-sm text-foreground">Add boxes, furniture, or a custom piece.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <ItemCard item={item} active={selectedId === item.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ItemCard({ item, active }: { item: ItemDef; active: boolean }) {
  const unit = usePackStore((s) => s.unit);
  const updateItem = usePackStore((s) => s.updateItem);
  const removeItem = usePackStore((s) => s.removeItem);
  const duplicateItem = usePackStore((s) => s.duplicateItem);
  const setSelected = usePackStore((s) => s.setSelected);

  return (
    <article
      className={cn(
        "rounded-xl bg-card p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
        active && "shadow-[0_0_0_1px_rgba(200,204,212,0.55)]",
      )}
      onClick={() => setSelected(item.id)}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="size-3 shrink-0 rounded-sm" style={{ background: item.color }} aria-hidden />
        <Input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} className="h-9" aria-label="Item name" />
        <Button variant="ghost" size="icon-sm" aria-label="Duplicate" onClick={(e) => { e.stopPropagation(); duplicateItem(item.id); }}>
          <Copy />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Remove" onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}>
          <Trash2 />
        </Button>
      </div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {ITEM_PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Color ${c}`}
            onClick={(e) => { e.stopPropagation(); updateItem(item.id, { color: c }); }}
            className={cn("size-6 rounded-md", item.color === c && "ring-2 ring-ring ring-offset-2 ring-offset-card")}
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <MiniDim label="W" value={roundForUnit(item.w, unit)} onCommit={(n) => updateItem(item.id, { w: toCm(n, unit) })} />
        <MiniDim label="H" value={roundForUnit(item.h, unit)} onCommit={(n) => updateItem(item.id, { h: toCm(n, unit) })} />
        <MiniDim label="D" value={roundForUnit(item.d, unit)} onCommit={(n) => updateItem(item.id, { d: toCm(n, unit) })} />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Field label="Qty">
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            max={99}
            value={item.qty}
            className="h-9"
            onChange={(e) => {
              const n = Math.floor(Number(e.target.value));
              if (!Number.isFinite(n)) return;
              updateItem(item.id, { qty: Math.min(99, Math.max(1, n)) });
            }}
          />
        </Field>
        <Field label="Rotation">
          <RotationSelect value={item.rotation} onChange={(rotation) => updateItem(item.id, { rotation })} />
        </Field>
      </div>
    </article>
  );
}

function MiniDim({ label, value, onCommit }: { label: string; value: number; onCommit: (n: number) => void }) {
  return (
    <Field label={label}>
      <Input
        type="number"
        inputMode="decimal"
        min={0}
        step="any"
        defaultValue={value}
        key={value}
        className="h-9"
        onBlur={(e) => {
          const n = parsePositive(e.target.value);
          if (n == null) {
            e.target.value = String(value);
            return;
          }
          onCommit(n);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
      />
    </Field>
  );
}
