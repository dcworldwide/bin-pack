import type { Unit } from "./types";

const CM_PER: Record<Unit, number> = { cm: 1, m: 100, in: 2.54, ft: 30.48 };

export function toCm(n: number, unit: Unit) {
  return n * CM_PER[unit];
}

export function fromCm(cm: number, unit: Unit) {
  return cm / CM_PER[unit];
}

export function roundForUnit(cm: number, unit: Unit) {
  const v = fromCm(cm, unit);
  const digits = unit === "cm" ? 1 : unit === "m" ? 3 : 2;
  const f = 10 ** digits;
  return Math.round(v * f) / f;
}

export function formatLen(cm: number, unit: Unit) {
  const n = roundForUnit(cm, unit);
  return `${n} ${unit}`;
}

export function formatVolume(cm3: number, unit: Unit) {
  const v = fromCm(Math.cbrt(Math.max(0, cm3)), unit) ** 3;
  const digits = unit === "cm" ? 0 : unit === "m" ? 3 : 1;
  const f = 10 ** digits;
  return `${Math.round(v * f) / f} ${unit}³`;
}

export function parsePositive(raw: string): number | null {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function isUnit(v: unknown): v is Unit {
  return v === "cm" || v === "m" || v === "in" || v === "ft";
}
