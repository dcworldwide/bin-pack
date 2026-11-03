import { defaultScenario } from "./presets";
import type { Bin, ItemDef, Project, RotationMode, Unit } from "./types";
import { clamp, uid } from "./utils";
import { isUnit } from "./units";

export const STORAGE_KEY = "stow:v2";
export const LEGACY_KEY = "stow:v1";

type LegacyV1 = {
  unit?: Unit;
  bin?: Bin;
  items?: ItemDef[];
  spaceId?: string | null;
  explode?: number;
  showLabels?: boolean;
};

export type PersistedV2 = {
  activeId: string;
  projects: Project[];
};

function isBin(v: unknown): v is Bin {
  if (!v || typeof v !== "object") return false;
  const b = v as Bin;
  return [b.w, b.h, b.d].every((n) => typeof n === "number" && Number.isFinite(n) && n > 0);
}

function isItem(v: unknown): v is ItemDef {
  if (!v || typeof v !== "object") return false;
  const it = v as ItemDef;
  return (
    typeof it.id === "string" &&
    typeof it.name === "string" &&
    typeof it.w === "number" &&
    typeof it.h === "number" &&
    typeof it.d === "number" &&
    typeof it.qty === "number" &&
    typeof it.color === "string" &&
    (it.rotation === "free" || it.rotation === "upright" || it.rotation === "none")
  );
}

export function blankProject(name = "New project"): Project {
  return {
    id: uid("proj"),
    name,
    unit: "cm",
    bin: { w: 140, h: 220, d: 150 },
    items: [],
    spaceId: "elevator",
    explode: 0,
    showLabels: true,
  };
}

function normalizeProject(raw: Partial<Project>, fallbackName: string): Project | null {
  if (!isBin(raw.bin) || !Array.isArray(raw.items) || !raw.items.every(isItem)) return null;
  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : uid("proj"),
    name: typeof raw.name === "string" && raw.name.trim() ? raw.name.trim() : fallbackName,
    unit: isUnit(raw.unit) ? raw.unit : "cm",
    bin: raw.bin,
    items: raw.items,
    spaceId: raw.spaceId ?? null,
    explode: typeof raw.explode === "number" ? clamp(raw.explode, 0, 1) : 0,
    showLabels: raw.showLabels ?? true,
  };
}

export function projectFromLegacy(legacy: LegacyV1, name = "Saved space"): Project | null {
  const project = normalizeProject(
    {
      name,
      unit: legacy.unit,
      bin: legacy.bin,
      items: legacy.items,
      spaceId: legacy.spaceId,
      explode: legacy.explode,
      showLabels: legacy.showLabels,
    },
    name,
  );
  return project;
}

export function defaultProjects(): PersistedV2 {
  const seed = defaultScenario();
  const project: Project = {
    id: uid("proj"),
    name: "Elevator load",
    unit: "cm",
    bin: seed.bin,
    items: seed.items,
    spaceId: seed.spaceId,
    explode: 0,
    showLabels: true,
  };
  return { activeId: project.id, projects: [project] };
}

export function stowFile(projects: Project[], activeId: string) {
  return JSON.stringify({ stow: 1, activeId, projects }, null, 2);
}

export function parseImport(text: string): PersistedV2 | null {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  if (!data || typeof data !== "object") return null;
  const record = data as { projects?: unknown; activeId?: unknown };
  if (Array.isArray(record.projects)) {
    return parsePersisted(JSON.stringify({ activeId: record.activeId, projects: record.projects }), null);
  }
  return parsePersisted(JSON.stringify({ activeId: "", projects: [data] }), null);
}

export function parsePersisted(v2raw: string | null, v1raw: string | null): PersistedV2 | null {
  if (v2raw) {
    try {
      const parsed = JSON.parse(v2raw) as PersistedV2;
      if (parsed && Array.isArray(parsed.projects)) {
        const projects = parsed.projects
          .map((p, i) => normalizeProject(p, `Project ${i + 1}`))
          .filter((p): p is Project => Boolean(p));
        if (projects.length) {
          const activeId = projects.some((p) => p.id === parsed.activeId) ? parsed.activeId : projects[0]!.id;
          return { activeId, projects };
        }
      }
    } catch {
      /* fall through */
    }
  }
  if (v1raw) {
    try {
      const legacy = JSON.parse(v1raw) as LegacyV1;
      const project = projectFromLegacy(legacy);
      if (project) return { activeId: project.id, projects: [project] };
    } catch {
      /* ignore */
    }
  }
  return null;
}

export function rotationOr(v: unknown, fallback: RotationMode): RotationMode {
  return v === "free" || v === "upright" || v === "none" ? v : fallback;
}
