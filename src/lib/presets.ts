import { nextColor } from "./colors";
import type { Bin, ItemDef, RotationMode } from "./types";
import { uid } from "./utils";

export type SpacePreset = { id: string; name: string; hint: string; bin: Bin };

export const SPACE_PRESETS: SpacePreset[] = [
  { id: "elevator", name: "Residential elevator", hint: "Typical passenger lift", bin: { w: 140, h: 220, d: 150 } },
  { id: "freight-elevator", name: "Freight elevator", hint: "Service / goods lift", bin: { w: 180, h: 240, d: 250 } },
  { id: "storage-5x5", name: "5 × 5 storage unit", hint: "5 ft × 5 ft × 8 ft", bin: { w: 152, h: 244, d: 152 } },
  { id: "storage-5x10", name: "5 × 10 storage unit", hint: "5 ft × 10 ft × 8 ft", bin: { w: 152, h: 244, d: 305 } },
  { id: "storage-10x10", name: "10 × 10 storage unit", hint: "10 ft × 10 ft × 8 ft", bin: { w: 305, h: 244, d: 305 } },
  { id: "container-20", name: "20-ft shipping container", hint: "Standard dry van", bin: { w: 235, h: 239, d: 590 } },
  { id: "closet", name: "Walk-in closet", hint: "Small dressing room", bin: { w: 180, h: 240, d: 120 } },
  { id: "studio", name: "Studio room", hint: "Single-room apartment", bin: { w: 400, h: 270, d: 350 } },
];

export type CatalogItem = { name: string; w: number; h: number; d: number; rotation: RotationMode };

export const ITEM_CATALOG: CatalogItem[] = [
  { name: "Small box", w: 35, h: 35, d: 35, rotation: "free" },
  { name: "Medium box", w: 50, h: 40, d: 40, rotation: "free" },
  { name: "Large box", w: 60, h: 50, d: 50, rotation: "free" },
  { name: "Sofa", w: 220, h: 85, d: 95, rotation: "upright" },
  { name: "Armchair", w: 90, h: 90, d: 85, rotation: "upright" },
  { name: "Queen mattress", w: 203, h: 30, d: 153, rotation: "free" },
  { name: "Fridge", w: 70, h: 175, d: 70, rotation: "upright" },
  { name: "Washer", w: 60, h: 85, d: 65, rotation: "upright" },
  { name: "Bicycle", w: 180, h: 110, d: 60, rotation: "upright" },
  { name: "Dining table", w: 160, h: 75, d: 90, rotation: "upright" },
  { name: "Dining chair", w: 45, h: 90, d: 50, rotation: "upright" },
  { name: "Bookshelf", w: 80, h: 180, d: 30, rotation: "upright" },
  { name: "Suitcase", w: 75, h: 30, d: 50, rotation: "free" },
  { name: "Wardrobe", w: 120, h: 200, d: 60, rotation: "upright" },
  { name: "TV", w: 120, h: 70, d: 8, rotation: "upright" },
  { name: "Office chair", w: 65, h: 110, d: 65, rotation: "upright" },
];

export type Scenario = {
  id: string;
  name: string;
  blurb: string;
  spaceId: string;
  items: Array<CatalogItem & { qty: number }>;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "elevator-move",
    name: "Elevator load",
    blurb: "A sofa will not stand in a passenger lift unless you allow free rotation.",
    spaceId: "elevator",
    items: [
      { name: "Fridge", w: 70, h: 175, d: 70, rotation: "upright", qty: 1 },
      { name: "Medium box", w: 50, h: 40, d: 40, rotation: "free", qty: 4 },
      { name: "Suitcase", w: 75, h: 30, d: 50, rotation: "free", qty: 2 },
      { name: "Sofa", w: 220, h: 85, d: 95, rotation: "upright", qty: 1 },
      { name: "Bicycle", w: 180, h: 110, d: 60, rotation: "upright", qty: 1 },
    ],
  },
  {
    id: "storage-move",
    name: "5 × 10 move-in",
    blurb: "A typical apartment load into a 5 × 10 unit.",
    spaceId: "storage-5x10",
    items: [
      { name: "Sofa", w: 220, h: 85, d: 95, rotation: "upright", qty: 1 },
      { name: "Queen mattress", w: 203, h: 30, d: 153, rotation: "free", qty: 1 },
      { name: "Fridge", w: 70, h: 175, d: 70, rotation: "upright", qty: 1 },
      { name: "Dining table", w: 160, h: 75, d: 90, rotation: "upright", qty: 1 },
      { name: "Dining chair", w: 45, h: 90, d: 50, rotation: "upright", qty: 4 },
      { name: "Large box", w: 60, h: 50, d: 50, rotation: "free", qty: 6 },
      { name: "Bookshelf", w: 80, h: 180, d: 30, rotation: "upright", qty: 1 },
    ],
  },
  {
    id: "container",
    name: "Export crate",
    blurb: "Mixed cargo in a 20-ft dry container.",
    spaceId: "container-20",
    items: [
      { name: "Large box", w: 60, h: 50, d: 50, rotation: "free", qty: 18 },
      { name: "Fridge", w: 70, h: 175, d: 70, rotation: "upright", qty: 2 },
      { name: "Washer", w: 60, h: 85, d: 65, rotation: "upright", qty: 2 },
      { name: "Wardrobe", w: 120, h: 200, d: 60, rotation: "upright", qty: 2 },
      { name: "Sofa", w: 220, h: 85, d: 95, rotation: "upright", qty: 1 },
    ],
  },
];

export function makeItem(partial: {
  name: string;
  w: number;
  h: number;
  d: number;
  qty?: number;
  rotation?: RotationMode;
  color?: string;
  colorIndex?: number;
}): ItemDef {
  return {
    id: uid("item"),
    name: partial.name,
    w: partial.w,
    h: partial.h,
    d: partial.d,
    qty: partial.qty ?? 1,
    rotation: partial.rotation ?? "upright",
    color: partial.color ?? nextColor(partial.colorIndex ?? 0),
  };
}

export function itemsFromScenario(scenario: Scenario): ItemDef[] {
  return scenario.items.map((item, i) => makeItem({ ...item, colorIndex: i }));
}

export function defaultScenario(): { bin: Bin; items: ItemDef[]; spaceId: string } {
  const scene = SCENARIOS[0]!;
  const space = SPACE_PRESETS.find((s) => s.id === scene.spaceId)!;
  return { bin: { ...space.bin }, items: itemsFromScenario(scene), spaceId: space.id };
}
