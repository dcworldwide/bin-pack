import type { Bin, ItemDef, PackResult, Placement, RotationMode, UnpackedItem } from "./types";

const EPS = 1e-6;
const MAX_INSTANCES = 250;

type Oriented = { w: number; h: number; d: number };
type Box = { x: number; y: number; z: number; w: number; h: number; d: number };

function volumeOf(w: number, h: number, d: number): number {
  return w * h * d;
}

function snap(n: number): number {
  if (Math.abs(n) < 1e-6) return 0;
  return Math.round(n * 1000) / 1000;
}

export function orientations(w: number, h: number, d: number, mode: RotationMode): Oriented[] {
  if (mode === "none") return [{ w, h, d }];
  if (mode === "upright") {
    const list: Oriented[] = [{ w, h, d }];
    if (Math.abs(w - d) > EPS) list.push({ w: d, h, d: w });
    return list;
  }
  const perms: Oriented[] = [
    { w, h, d },
    { w, h: d, d: h },
    { w: h, h: w, d },
    { w: h, h: d, d: w },
    { w: d, h: w, d: h },
    { w: d, h, d: w },
  ];
  const seen = new Set<string>();
  const unique: Oriented[] = [];
  for (const p of perms) {
    const key = `${p.w.toFixed(4)}:${p.h.toFixed(4)}:${p.d.toFixed(4)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(p);
  }
  return unique;
}

function inside(bin: Bin, box: Box): boolean {
  return (
    box.x >= -EPS &&
    box.y >= -EPS &&
    box.z >= -EPS &&
    box.x + box.w <= bin.w + EPS &&
    box.y + box.h <= bin.h + EPS &&
    box.z + box.d <= bin.d + EPS
  );
}

function overlaps(a: Box, b: Box): boolean {
  return (
    a.x + a.w > b.x + EPS &&
    b.x + b.w > a.x + EPS &&
    a.y + a.h > b.y + EPS &&
    b.y + b.h > a.y + EPS &&
    a.z + a.d > b.z + EPS &&
    b.z + b.d > a.z + EPS
  );
}

function collides(placed: Box[], box: Box): boolean {
  for (const p of placed) {
    if (overlaps(p, box)) return true;
  }
  return false;
}

function canPlace(bin: Bin, placed: Box[], box: Box): boolean {
  return inside(bin, box) && !collides(placed, box);
}

function dropAxis(bin: Bin, placed: Box[], box: Box, axis: "x" | "y" | "z"): Box {
  const origin = axis === "x" ? box.x : axis === "y" ? box.y : box.z;
  if (origin <= EPS) return { ...box, [axis]: 0 };
  let lo = 0;
  let hi = origin;
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    const trial: Box = { ...box, [axis]: origin - mid };
    if (canPlace(bin, placed, trial)) lo = mid;
    else hi = mid;
  }
  // Ignore sub-millimetre nudges so touching faces stay flush.
  if (lo < 0.001) return { ...box, [axis]: snap(origin) };
  return { ...box, [axis]: snap(origin - lo) };
}

function settle(bin: Bin, placed: Box[], box: Box): Box {
  let next = dropAxis(bin, placed, box, "y");
  next = dropAxis(bin, placed, next, "z");
  next = dropAxis(bin, placed, next, "x");
  return next;
}

function pointKey(x: number, y: number, z: number): string {
  return `${snap(x)}:${snap(y)}:${snap(z)}`;
}

function candidatePoints(placed: Box[]): Array<[number, number, number]> {
  const seen = new Set<string>();
  const pts: Array<[number, number, number]> = [];
  const add = (x: number, y: number, z: number) => {
    const nx = snap(x);
    const ny = snap(y);
    const nz = snap(z);
    const k = pointKey(nx, ny, nz);
    if (seen.has(k)) return;
    seen.add(k);
    pts.push([nx, ny, nz]);
  };
  add(0, 0, 0);
  for (const p of placed) {
    add(p.x + p.w, p.y, p.z);
    add(p.x, p.y + p.h, p.z);
    add(p.x, p.y, p.z + p.d);
    add(p.x + p.w, p.y, p.z + p.d);
    add(p.x + p.w, p.y + p.h, p.z);
    add(p.x, p.y + p.h, p.z + p.d);
  }
  pts.sort((a, b) => a[1] - b[1] || a[2] - b[2] || a[0] - b[0]);
  return pts;
}

function tooLarge(bin: Bin, oris: Oriented[]): boolean {
  return !oris.some((o) => o.w <= bin.w + EPS && o.h <= bin.h + EPS && o.d <= bin.d + EPS);
}

function findPlacement(bin: Bin, placed: Box[], oris: Oriented[]): Box | null {
  const points = candidatePoints(placed);
  let best: Box | null = null;
  let bestScore = Infinity;
  for (const ori of oris) {
    if (ori.w > bin.w + EPS || ori.h > bin.h + EPS || ori.d > bin.d + EPS) continue;
    for (const [x, y, z] of points) {
      const raw: Box = { x, y, z, w: ori.w, h: ori.h, d: ori.d };
      if (!canPlace(bin, placed, raw)) continue;
      const box = settle(bin, placed, raw);
      const score = box.y * 1e12 + box.z * 1e6 + box.x + ori.w * ori.h * 1e-6;
      if (score < bestScore) {
        bestScore = score;
        best = box;
      }
    }
  }
  return best;
}

type Instance = {
  instanceId: string;
  item: ItemDef;
  index: number;
};

function expand(items: ItemDef[]): { instances: Instance[]; truncated: number } {
  const instances: Instance[] = [];
  let truncated = 0;
  for (const item of items) {
    const qty = Math.max(0, Math.floor(item.qty));
    for (let i = 0; i < qty; i++) {
      if (instances.length >= MAX_INSTANCES) {
        truncated += qty - i;
        break;
      }
      instances.push({
        instanceId: `${item.id}#${i + 1}`,
        item,
        index: i,
      });
    }
  }
  instances.sort((a, b) => {
    const va = volumeOf(a.item.w, a.item.h, a.item.d);
    const vb = volumeOf(b.item.w, b.item.h, b.item.d);
    if (vb !== va) return vb - va;
    const ma = Math.max(a.item.w, a.item.h, a.item.d);
    const mb = Math.max(b.item.w, b.item.h, b.item.d);
    if (mb !== ma) return mb - ma;
    return a.item.name.localeCompare(b.item.name) || a.index - b.index;
  });
  return { instances, truncated };
}

export function packBin(bin: Bin, items: ItemDef[]): PackResult {
  const binVolume = Math.max(0, volumeOf(bin.w, bin.h, bin.d));
  const placements: Placement[] = [];
  const unpacked: UnpackedItem[] = [];
  const placedBoxes: Box[] = [];

  if (bin.w <= 0 || bin.h <= 0 || bin.d <= 0) {
    return {
      placements,
      unpacked,
      bin,
      usedVolume: 0,
      unpackedVolume: 0,
      binVolume: 0,
      fillRatio: 0,
    };
  }

  const { instances, truncated } = expand(items);
  if (truncated > 0) {
    unpacked.push({
      instanceId: "truncated",
      itemId: "truncated",
      name: `${truncated} extra piece${truncated === 1 ? "" : "s"}`,
      w: 0,
      h: 0,
      d: 0,
      color: "#666666",
      reason: `Packing is capped at ${MAX_INSTANCES} pieces. Remove some items and try again.`,
    });
  }

  for (const inst of instances) {
    const { item } = inst;
    const oris = orientations(item.w, item.h, item.d, item.rotation);
    const vol = volumeOf(item.w, item.h, item.d);

    let reason: string | null = null;
    if (item.w <= 0 || item.h <= 0 || item.d <= 0) {
      reason = "Dimensions must be greater than zero.";
    } else if (tooLarge(bin, oris)) {
      const mode =
        item.rotation === "upright"
          ? "while kept upright"
          : item.rotation === "none"
            ? "in the orientation you entered"
            : "even when rotated";
      reason = `Too large for this space ${mode}.`;
    } else {
      const remaining = binVolume - placements.reduce((s, p) => s + volumeOf(p.w, p.h, p.d), 0);
      const found = findPlacement(bin, placedBoxes, oris);
      if (found) {
        placedBoxes.push(found);
        placements.push({
          instanceId: inst.instanceId,
          itemId: item.id,
          name: item.qty > 1 ? `${item.name} ${inst.index + 1}` : item.name,
          color: item.color,
          x: found.x,
          y: found.y,
          z: found.z,
          w: found.w,
          h: found.h,
          d: found.d,
        });
        continue;
      }
      if (vol > remaining + EPS) {
        reason = "Not enough leftover volume.";
      } else {
        reason =
          "Volume remains, but no leftover pocket matches this shape. Try free rotation or a larger space.";
      }
    }

    unpacked.push({
      instanceId: inst.instanceId,
      itemId: item.id,
      name: item.qty > 1 ? `${item.name} ${inst.index + 1}` : item.name,
      w: item.w,
      h: item.h,
      d: item.d,
      color: item.color,
      reason: reason ?? "Does not fit.",
    });
  }

  const usedVolume = placements.reduce((s, p) => s + volumeOf(p.w, p.h, p.d), 0);
  const unpackedVolume = unpacked.reduce((s, u) => s + volumeOf(u.w, u.h, u.d), 0);

  return {
    placements,
    unpacked,
    bin,
    usedVolume,
    unpackedVolume,
    binVolume,
    fillRatio: binVolume > 0 ? usedVolume / binVolume : 0,
  };
}
