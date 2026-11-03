import type { Bin, ItemDef, PackResult, Placement } from "./types";

type Oriented = { w: number; h: number; d: number };
type Point = { x: number; y: number; z: number };
const EPS = 0.01;

function volume(w: number, h: number, d: number) {
  return Math.max(0, w) * Math.max(0, h) * Math.max(0, d);
}

function orientations(item: ItemDef): Oriented[] {
  const { w, h, d, rotation } = item;
  const raw: Oriented[] =
    rotation === "none"
      ? [{ w, h, d }]
      : rotation === "upright"
        ? [
            { w, h, d },
            { w: d, h, d: w },
          ]
        : [
            { w, h, d },
            { w, h: d, d: h },
            { w: h, h: w, d },
            { w: h, h: d, d: w },
            { w: d, h: w, d: h },
            { w: d, h, d: w },
          ];
  const seen = new Set<string>();
  const out: Oriented[] = [];
  for (const o of raw) {
    const key = `${o.w}|${o.h}|${o.d}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(o);
  }
  return out;
}

function canEverFit(bin: Bin, item: ItemDef) {
  return orientations(item).some((o) => o.w <= bin.w + EPS && o.h <= bin.h + EPS && o.d <= bin.d + EPS);
}

function fits(bin: Bin, p: Oriented & Point) {
  return p.x >= -EPS && p.y >= -EPS && p.z >= -EPS && p.x + p.w <= bin.w + EPS && p.y + p.h <= bin.h + EPS && p.z + p.d <= bin.d + EPS;
}

function collides(a: Oriented & Point, b: Oriented & Point) {
  return (
    a.x < b.x + b.w - EPS &&
    a.x + a.w > b.x + EPS &&
    a.y < b.y + b.h - EPS &&
    a.y + a.h > b.y + EPS &&
    a.z < b.z + b.d - EPS &&
    a.z + a.d > b.z + EPS
  );
}

function overlap2d(a: Oriented & Point, b: Oriented & Point) {
  const xOverlap = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const zOverlap = Math.min(a.z + a.d, b.z + b.d) - Math.max(a.z, b.z);
  return xOverlap > EPS && zOverlap > EPS;
}

function supported(cand: Oriented & Point, placed: Placement[]) {
  if (cand.y <= EPS) return true;
  return placed.some((p) => Math.abs(p.y + p.h - cand.y) <= 0.5 && overlap2d(cand, p));
}

function better(a: Oriented & Point, b: Oriented & Point) {
  if (a.y !== b.y) return a.y < b.y;
  if (a.z !== b.z) return a.z < b.z;
  return a.x < b.x;
}

function reasonFor(bin: Bin, item: ItemDef) {
  if (!canEverFit(bin, item)) {
    return item.rotation === "free" ? "Too large for this space even with rotation." : "Too large in this orientation — try free rotate.";
  }
  return "Does not fit in the remaining space.";
}

export function packBin(bin: Bin, items: ItemDef[]): PackResult {
  const instances = items.flatMap((item) =>
    Array.from({ length: Math.max(0, Math.floor(item.qty) || 0) }, (_, i) => ({
      item,
      instanceId: `${item.id}#${i}`,
    })),
  );
  instances.sort((a, b) => volume(b.item.w, b.item.h, b.item.d) - volume(a.item.w, a.item.h, a.item.d));

  const placements: Placement[] = [];
  const unpacked: PackResult["unpacked"] = [];
  const points: Point[] = [{ x: 0, y: 0, z: 0 }];

  for (const inst of instances) {
    let best: (Oriented & Point) | null = null;
    for (const o of orientations(inst.item)) {
      for (const pt of points) {
        const cand = { ...o, x: pt.x, y: pt.y, z: pt.z };
        if (!fits(bin, cand) || placements.some((p) => collides(cand, p)) || !supported(cand, placements)) continue;
        if (!best || better(cand, best)) best = cand;
      }
    }
    if (!best) {
      unpacked.push({
        instanceId: inst.instanceId,
        itemId: inst.item.id,
        name: inst.item.name,
        w: inst.item.w,
        h: inst.item.h,
        d: inst.item.d,
        color: inst.item.color,
        reason: reasonFor(bin, inst.item),
      });
      continue;
    }
    placements.push({
      instanceId: inst.instanceId,
      itemId: inst.item.id,
      name: inst.item.name,
      color: inst.item.color,
      x: best.x,
      y: best.y,
      z: best.z,
      w: best.w,
      h: best.h,
      d: best.d,
    });
    points.push(
      { x: best.x + best.w, y: best.y, z: best.z },
      { x: best.x, y: best.y + best.h, z: best.z },
      { x: best.x, y: best.y, z: best.z + best.d },
    );
  }

  const usedVolume = placements.reduce((s, p) => s + volume(p.w, p.h, p.d), 0);
  const unpackedVolume = unpacked.reduce((s, u) => s + volume(u.w, u.h, u.d), 0);
  const binVolume = volume(bin.w, bin.h, bin.d);
  return { placements, unpacked, bin, usedVolume, unpackedVolume, binVolume, fillRatio: binVolume > 0 ? usedVolume / binVolume : 0 };
}
