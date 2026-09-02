export type Unit = "cm" | "m" | "in" | "ft";

export type RotationMode = "free" | "upright" | "none";

export type ItemDef = {
  id: string;
  name: string;
  /** Width along X, stored in centimeters. */
  w: number;
  /** Height along Y, stored in centimeters. */
  h: number;
  /** Depth along Z, stored in centimeters. */
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
