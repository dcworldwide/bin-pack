import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(prefix: string) {
  const n = crypto.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 8);
  return `${prefix}_${n}`;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
