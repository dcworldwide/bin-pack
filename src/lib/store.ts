import { create } from "zustand";
import { nextColor } from "./colors";
import { blankProject, defaultProjects, LEGACY_KEY, parsePersisted, STORAGE_KEY, type PersistedV2 } from "./projects";
import { itemsFromScenario, SPACE_PRESETS, type Scenario } from "./presets";
import type { Bin, ItemDef, Project, RotationMode, Unit } from "./types";
import { clamp, uid } from "./utils";

type PackState = {
  projects: Project[];
  activeId: string;
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
  renameProject: (name: string) => void;
  createProject: () => void;
  selectProject: (id: string) => void;
  deleteProject: () => void;
  importProjects: (incoming: PersistedV2) => void;
  hydrate: () => void;
};

const seed = defaultProjects();

function persist(state: Pick<PackState, "projects" | "activeId">) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ activeId: state.activeId, projects: state.projects }));
  } catch {
    /* quota */
  }
}

function applyActive(projects: Project[], activeId: string) {
  const active = projects.find((p) => p.id === activeId) ?? projects[0]!;
  return {
    projects,
    activeId: active.id,
    unit: active.unit,
    bin: active.bin,
    items: active.items,
    spaceId: active.spaceId,
    explode: active.explode,
    showLabels: active.showLabels,
  };
}

function uniqueProjectName(projects: Project[], exceptId: string) {
  const taken = new Set(
    projects.filter((p) => p.id !== exceptId).map((p) => p.name.trim().toLowerCase()),
  );
  if (!taken.has("project")) return "Project";
  for (let i = 2; i < 100; i++) {
    const candidate = `Project ${i}`;
    if (!taken.has(candidate.toLowerCase())) return candidate;
  }
  return "Project";
}
function withActive(state: PackState, partial: Partial<Project>): Pick<PackState, "projects" | "activeId" | "unit" | "bin" | "items" | "spaceId" | "explode" | "showLabels"> {
  const projects = state.projects.map((p) => (p.id === state.activeId ? { ...p, ...partial } : p));
  const active = projects.find((p) => p.id === state.activeId)!;
  return {
    projects,
    activeId: state.activeId,
    unit: active.unit,
    bin: active.bin,
    items: active.items,
    spaceId: active.spaceId,
    explode: active.explode,
    showLabels: active.showLabels,
  };
}

export const usePackStore = create<PackState>((set, get) => ({
  projects: seed.projects,
  activeId: seed.activeId,
  unit: seed.projects[0]!.unit,
  bin: seed.projects[0]!.bin,
  items: seed.projects[0]!.items,
  spaceId: seed.projects[0]!.spaceId,
  selectedId: null,
  explode: 0,
  showLabels: true,
  cameraNonce: 0,
  hydrated: false,
  setUnit: (unit) => set((s) => withActive(s, { unit })),
  setBin: (partial) => set((s) => withActive(s, { bin: { ...s.bin, ...partial }, spaceId: null })),
  applySpacePreset: (id) => {
    const preset = SPACE_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    set((s) => ({ ...withActive(s, { bin: { ...preset.bin }, spaceId: id }), cameraNonce: s.cameraNonce + 1 }));
  },
  loadScenario: (scenario) => {
    const space = SPACE_PRESETS.find((p) => p.id === scenario.spaceId);
    if (!space) return;
    set((s) => ({
      ...withActive(s, { bin: { ...space.bin }, items: itemsFromScenario(scenario), spaceId: space.id }),
      selectedId: null,
      cameraNonce: s.cameraNonce + 1,
    }));
  },
  addItem: (item) => {
    const items = get().items;
    const next: ItemDef = {
      id: item?.id ?? uid("item"),
      name: item?.name ?? "New item",
      w: item?.w ?? 50,
      h: item?.h ?? 40,
      d: item?.d ?? 40,
      qty: item?.qty ?? 1,
      color: item?.color ?? nextColor(items.length),
      rotation: (item?.rotation as RotationMode) ?? "upright",
    };
    set((s) => ({ ...withActive(s, { items: [...s.items, next] }), selectedId: next.id }));
  },
  updateItem: (id, partial) =>
    set((s) => ({ ...withActive(s, { items: s.items.map((it) => (it.id === id ? { ...it, ...partial } : it)) }) })),
  removeItem: (id) =>
    set((s) => ({
      ...withActive(s, { items: s.items.filter((it) => it.id !== id) }),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),
  duplicateItem: (id) => {
    const src = get().items.find((it) => it.id === id);
    if (!src) return;
    get().addItem({ ...src, id: undefined, name: src.name });
  },
  clearItems: () => set((s) => ({ ...withActive(s, { items: [] }), selectedId: null })),
  setSelected: (id) => set({ selectedId: id }),
  setExplode: (v) => set((s) => withActive(s, { explode: clamp(v, 0, 1) })),
  setShowLabels: (v) => set((s) => withActive(s, { showLabels: v })),
  resetCamera: () => set({ cameraNonce: get().cameraNonce + 1 }),
  renameProject: (name) =>
    set((s) => withActive(s, { name: name.trim().slice(0, 60) || uniqueProjectName(s.projects, s.activeId) })),
  createProject: () => {
    const fresh = blankProject("New project");
    set((s) => ({
      ...applyActive([...s.projects.map((p) => (p.id === s.activeId ? { ...p, unit: s.unit, bin: s.bin, items: s.items, spaceId: s.spaceId, explode: s.explode, showLabels: s.showLabels, name: p.name } : p)), fresh], fresh.id),
      selectedId: null,
      cameraNonce: s.cameraNonce + 1,
    }));
  },
  selectProject: (id) => {
    const target = get().projects.find((p) => p.id === id);
    if (!target || target.id === get().activeId) return;
    set((s) => ({
      ...applyActive(
        s.projects.map((p) =>
          p.id === s.activeId
            ? { ...p, unit: s.unit, bin: s.bin, items: s.items, spaceId: s.spaceId, explode: s.explode, showLabels: s.showLabels }
            : p,
        ),
        id,
      ),
      selectedId: null,
      cameraNonce: s.cameraNonce + 1,
    }));
  },
  deleteProject: () => {
    const { projects, activeId } = get();
    if (projects.length < 2) return;
    const rest = projects.filter((p) => p.id !== activeId);
    set((s) => ({ ...applyActive(rest, rest[0]!.id), selectedId: null, cameraNonce: s.cameraNonce + 1 }));
  },
  importProjects: (incoming) => {
    set((s) => {
      const taken = new Set(s.projects.map((p) => p.id));
      const idMap = new Map<string, string>();
      const imported = incoming.projects.map((project) => {
        let id = project.id;
        if (taken.has(id)) id = uid("proj");
        taken.add(id);
        idMap.set(project.id, id);
        return { ...project, id };
      });
      if (!imported.length) return s;
      const saved = s.projects.map((p) =>
        p.id === s.activeId
          ? {
              ...p,
              unit: s.unit,
              bin: s.bin,
              items: s.items,
              spaceId: s.spaceId,
              explode: s.explode,
              showLabels: s.showLabels,
            }
          : p,
      );
      const activeId = idMap.get(incoming.activeId) ?? imported[0]!.id;
      return {
        ...applyActive([...saved, ...imported], activeId),
        selectedId: null,
        cameraNonce: s.cameraNonce + 1,
      };
    });
  },
  hydrate: () => {
    if (get().hydrated) return;
    if (typeof localStorage === "undefined") {
      set({ hydrated: true });
      return;
    }
    const parsed = parsePersisted(localStorage.getItem(STORAGE_KEY), localStorage.getItem(LEGACY_KEY));
    if (parsed) {
      set({ ...applyActive(parsed.projects, parsed.activeId), hydrated: true, selectedId: null });
      return;
    }
    set({ hydrated: true });
  },
}));

usePackStore.subscribe((state) => {
  if (!state.hydrated) return;
  persist(state);
});
