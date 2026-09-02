import type { Unit } from "./types";

const TO_CM: Record<Unit, number> = {
  cm: 1,
  m: 100,
  in: 2.54,
  ft: 30.48,
};

export const UNIT_LABEL: Record<Unit, string> = {
  cm: "cm",
  m: "m",
  in: "in",
  ft: "ft",
};

export function toCm(value: number, unit: Unit): number {
  return value * TO_CM[unit];
}

export function fromCm(cm: number, unit: Unit): number {
  return cm / TO_CM[unit];
}

export function decimalsFor(unit: Unit): number {
  if (unit === "m") return 3;
  if (unit === "cm") return 1;
  return 2;
}

export function roundForUnit(cm: number, unit: Unit): number {
  const n = fromCm(cm, unit);
  const d = decimalsFor(unit);
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

export function formatLen(cm: number, unit: Unit): string {
  const n = roundForUnit(cm, unit);
  return `${trimNum(n)} ${UNIT_LABEL[unit]}`;
}

export function formatVolume(cm3: number, unit: Unit): string {
  const factor = TO_CM[unit] ** 3;
  const n = cm3 / factor;
  if (n >= 100) return `${n.toFixed(0)} ${UNIT_LABEL[unit]}³`;
  if (n >= 10) return `${n.toFixed(1)} ${UNIT_LABEL[unit]}³`;
  if (n >= 1) return `${n.toFixed(2)} ${UNIT_LABEL[unit]}³`;
  return `${n.toFixed(3)} ${UNIT_LABEL[unit]}³`;
}

export function trimNum(n: number): string {
  if (!Number.isFinite(n)) return "0";
  const s = n.toFixed(3);
  return s.replace(/\.?0+$/, "");
}

export function parsePositive(raw: string): number | null {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}
