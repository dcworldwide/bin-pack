import { create } from "zustand";
import { nextColor } from "./colors";
import { defaultScenario, itemsFromScenario, SPACE_PRESETS, type Scenario } from "./presets";
import type { Bin, ItemDef, RotationMode, Unit } from "./types";

const STORAGE_KEY = "stow:v1";

type Persisted = {
  unit: Unit;
  bin: Bin;
  items: ItemDef[];
  spaceId: string | null;
};

type PackState = {
  unit: Unit;
  bin: Bin;
  items: ItemDef[];
  spaceId: string | null;
  selectedId: string | null;
  explode: number;
  showLabels: boolean;
  cameraNonce: number;
  hydrated: boolean;
  setUnit: (unit: Unit) => void;
  setBin: (partial: Partial<Bin>) => void;
  applySpacePreset: (id: string) => void;
  loadScenario: (scenario: Scenario) => void;
  addItem: (item?: Partial<ItemDef>) => void;
  updateItem: (id: string, partial: Partial<ItemDef>) => void;
  removeItem: (id: string) => void;
  duplicateItem: (id: string) => void;
  clearItems: () => void;
  setSelected: (id: string | null) => void;
  setExplode: (v: number) => void;
  setShowLabels: (v: boolean) => void;
  resetCamera: () => void;
  hydrate: () => void;
};

const seed = defaultScenario();

function persist(state: Pick<PackState, "unit" | "bin" | "items" | "spaceId">) {
  if (typeof localStorage === "undefined") return;
  const payload: Persisted = {
    unit: state.unit,
    bin: state.bin,
    items: state.items,
    spaceId: state.spaceId,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore quota */
  }
}

export const usePackStore = create<PackState>((set, get) => ({
  unit: "cm",
  bin: seed.bin,
  items: seed.items,
  spaceId: seed.spaceId,
  selectedId: null,
  explode: 0,
  showLabels: true,
  cameraNonce: 0,
  hydrated: false,
  setUnit: (unit) => {
    set({ unit });
    persist(get());
  },
  setBin: (partial) => {
    set((s) => ({ bin: { ...s.bin, ...partial }, spaceId: null }));
    persist(get());
  },
  applySpacePreset: (id) => {
    const preset = SPACE_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    set({ bin: { ...preset.bin }, spaceId: id, cameraNonce: get().cameraNonce + 1 });
    persist(get());
  },
  loadScenario: (scenario) => {
    const space = SPACE_PRESETS.find((p) => p.id === scenario.spaceId);
    if (!space) return;
    set({
      bin: { ...space.bin },
      items: itemsFromScenario(scenario),
      spaceId: space.id,
      selectedId: null,
      cameraNonce: get().cameraNonce + 1,
    });
    persist(get());
  },
  addItem: (item) => {
    const items = get().items;
    const next: ItemDef = {
      id: item?.id ?? `item_${crypto.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 8)}`,
      name: item?.name ?? "New item",
      w: item?.w ?? 50,
      h: item?.h ?? 40,
      d: item?.d ?? 40,
      qty: item?.qty ?? 1,
      color: item?.color ?? nextColor(items.length),
      rotation: (item?.rotation as RotationMode) ?? "upright",
    };
    set({ items: [...items, next], selectedId: next.id });
    persist(get());
  },
  updateItem: (id, partial) => {
    set((s) => ({
      items: s.items.map((it) => (it.id === id ? { ...it, ...partial } : it)),
    }));
    persist(get());
  },
  removeItem: (id) => {
    set((s) => ({
      items: s.items.filter((it) => it.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    }));
    persist(get());
  },
  duplicateItem: (id) => {
    const src = get().items.find((it) => it.id === id);
    if (!src) return;
    get().addItem({
      ...src,
      id: undefined,
      name: src.name,
    });
  },
  clearItems: () => {
    set({ items: [], selectedId: null });
    persist(get());
  },
  setSelected: (id) => set({ selectedId: id }),
  setExplode: (v) => set({ explode: v }),
  setShowLabels: (v) => set({ showLabels: v }),
  resetCamera: () => set({ cameraNonce: get().cameraNonce + 1 }),
  hydrate: () => {
    if (get().hydrated) return;
    if (typeof localStorage === "undefined") {
      set({ hydrated: true });
      return;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Persisted;
        if (parsed?.bin && Array.isArray(parsed.items)) {
          set({
            unit: parsed.unit ?? "cm",
            bin: parsed.bin,
            items: parsed.items,
            spaceId: parsed.spaceId ?? null,
            hydrated: true,
          });
          return;
        }
      }
    } catch {
      /* keep defaults */
    }
    set({ hydrated: true });
  },
}));
