import type { ReactNode } from "react";
import { ITEM_CATALOG, SCENARIOS, SPACE_PRESETS } from "@/lib/presets";
import { usePackStore } from "@/lib/store";
import type { RotationMode, Unit } from "@/lib/types";
import { parsePositive, roundForUnit, toCm } from "@/lib/units";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const UNITS: Unit[] = ["cm", "m", "in", "ft"];

export function SpacePanel() {
  const unit = usePackStore((s) => s.unit);
  const setUnit = usePackStore((s) => s.setUnit);
  const bin = usePackStore((s) => s.bin);
  const setBin = usePackStore((s) => s.setBin);
  const spaceId = usePackStore((s) => s.spaceId);
  const applySpacePreset = usePackStore((s) => s.applySpacePreset);
  const loadScenario = usePackStore((s) => s.loadScenario);

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h2 className="font-medium text-foreground">The space</h2>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Elevator, storage unit, crate — any rectangular volume. Each project keeps its own space and objects.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Preset">
          <NativeSelect value={spaceId ?? ""} onChange={(v) => v && applySpacePreset(v)}>
            <option value="">Custom</option>
            {SPACE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Units">
          <NativeSelect value={unit} onChange={(v) => setUnit(v as Unit)}>
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <DimInput label="Width X" value={roundForUnit(bin.w, unit)} onCommit={(n) => setBin({ w: toCm(n, unit) })} />
        <DimInput label="Height Y" value={roundForUnit(bin.h, unit)} onCommit={(n) => setBin({ h: toCm(n, unit) })} />
        <DimInput label="Depth Z" value={roundForUnit(bin.d, unit)} onCommit={(n) => setBin({ d: toCm(n, unit) })} />
      </div>

      <div className="space-y-2">
        <Label>Try a sample load</Label>
        <div className="flex flex-col gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => loadScenario(s)}
              className="rounded-lg bg-muted/60 px-3 py-2.5 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-colors duration-150 hover:bg-muted"
            >
              <div className="text-sm font-medium text-foreground">{s.name}</div>
              <div className="text-xs leading-relaxed text-muted-foreground">{s.blurb}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AddItemBar() {
  const addItem = usePackStore((s) => s.addItem);
  return (
    <div className="grid grid-cols-[1fr_auto] gap-2">
      <NativeSelect
        value=""
        onChange={(v) => {
          const cat = ITEM_CATALOG.find((c) => c.name === v);
          if (cat) addItem({ ...cat });
        }}
      >
        <option value="">Add from catalog…</option>
        {ITEM_CATALOG.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </NativeSelect>
      <Button variant="secondary" onClick={() => addItem({ name: "Custom item", w: 50, h: 40, d: 40, rotation: "free" })}>
        Custom
      </Button>
    </div>
  );
}

export function DimInput({ label, value, onCommit }: { label: string; value: number; onCommit: (n: number) => void }) {
  return (
    <Field label={label}>
      <Input
        type="number"
        inputMode="decimal"
        min={0}
        step="any"
        defaultValue={value}
        key={value}
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

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </label>
  );
}

export function NativeSelect({
  value,
  onChange,
  children,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={
        className ??
        "h-11 w-full min-w-0 rounded-md bg-muted px-3 text-sm text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
      }
    >
      {children}
    </select>
  );
}

export function RotationSelect({ value, onChange }: { value: RotationMode; onChange: (v: RotationMode) => void }) {
  return (
    <NativeSelect
      value={value}
      onChange={(v) => onChange(v as RotationMode)}
      className="h-9 w-full min-w-0 rounded-md bg-muted px-3 text-sm text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
    >
      <option value="upright">Upright</option>
      <option value="free">Free rotate</option>
      <option value="none">No rotate</option>
    </NativeSelect>
  );
}
