export const ITEM_PALETTE = [
  "#c45c5c",
  "#6aa56a",
  "#5a7ab5",
  "#c4a574",
  "#7a8f8a",
  "#b08968",
  "#6d8a9e",
  "#9a7a6a",
  "#7d9a7e",
  "#8a8f6d",
];

export function nextColor(index: number) {
  return ITEM_PALETTE[((index % ITEM_PALETTE.length) + ITEM_PALETTE.length) % ITEM_PALETTE.length]!;
}

export function darken(hex: string, amount = 0.28) {
  const n = hex.replace("#", "");
  if (n.length !== 6) return hex;
  const t = Math.max(0, Math.min(1, amount));
  const ch = (i: number) =>
    Math.round(parseInt(n.slice(i, i + 2), 16) * (1 - t))
      .toString(16)
      .padStart(2, "0");
  return `#${ch(0)}${ch(2)}${ch(4)}`;
}
