export type Unit = "cm" | "m" | "in" | "ft";

export type RotationMode = "free" | "upright" | "none";

export type ItemDef = {
  id: string;
  name: string;
  w: number;
  h: number;
  d: number;
  qty: number;
  color: string;
  rotation: RotationMode;
};

export type Bin = {
  w: number;
  h: number;
  d: number;
};

export type Placement = {
  instanceId: string;
  itemId: string;
  name: string;
  color: string;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
};

export type UnpackedItem = {
  instanceId: string;
  itemId: string;
  name: string;
  w: number;
  h: number;
  d: number;
  color: string;
  reason: string;
};

export type PackResult = {
  placements: Placement[];
  unpacked: UnpackedItem[];
  bin: Bin;
  usedVolume: number;
  unpackedVolume: number;
  binVolume: number;
  fillRatio: number;
};

export type Project = {
  id: string;
  name: string;
  unit: Unit;
  bin: Bin;
  items: ItemDef[];
  spaceId: string | null;
  explode: number;
  showLabels: boolean;
};
