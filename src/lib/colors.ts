/** Distinct item hues for the 3D scene — not brand chrome. Kept light enough to read on ink. */
export const ITEM_PALETTE = [
  "#8fb398",
  "#8ea0c4",
  "#c4a07c",
  "#7eb0b0",
  "#c49b8c",
  "#b3b07a",
  "#8a9bb0",
  "#c4887a",
  "#79a894",
  "#c2ae88",
  "#87a087",
  "#9a8ea8",
] as const;

export function nextColor(index: number): string {
  return ITEM_PALETTE[index % ITEM_PALETTE.length]!;
}

export function darken(hex: string, amount = 0.28): string {
  const { r, g, b } = parseHex(hex);
  const k = 1 - amount;
  return rgbToHex(r * k, g * k, b * k);
}

export function parseHex(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const n = Number.parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}
