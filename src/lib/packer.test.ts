import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { orientations, packBin } from "./packer.ts";
import type { ItemDef } from "./types.ts";

function item(partial: Partial<ItemDef> & Pick<ItemDef, "id" | "name" | "w" | "h" | "d">): ItemDef {
  return {
    qty: 1,
    color: "#888888",
    rotation: "free",
    ...partial,
  };
}

describe("orientations", () => {
  it("keeps a single pose when rotation is none", () => {
    assert.equal(orientations(2, 3, 4, "none").length, 1);
  });
  it("only yaw-swaps when upright", () => {
    const oris = orientations(2, 3, 4, "upright");
    assert.equal(oris.length, 2);
    assert.ok(oris.every((o) => o.h === 3));
  });
});

describe("packBin", () => {
  it("fills a cube with eight unit cubes", () => {
    const result = packBin({ w: 2, h: 2, d: 2 }, [
      item({ id: "c", name: "cube", w: 1, h: 1, d: 1, qty: 8, rotation: "none" }),
    ]);
    assert.equal(result.placements.length, 8);
    assert.equal(result.unpacked.length, 0);
    assert.ok(Math.abs(result.fillRatio - 1) < 1e-6);
  });

  it("reports items that are too large", () => {
    const result = packBin({ w: 10, h: 10, d: 10 }, [
      item({ id: "big", name: "Beam", w: 30, h: 2, d: 2, rotation: "upright" }),
    ]);
    assert.equal(result.placements.length, 0);
    assert.equal(result.unpacked.length, 1);
    assert.match(result.unpacked[0]!.reason, /too large/i);
  });

  it("rotates a long box so it fits", () => {
    const result = packBin({ w: 10, h: 4, d: 4 }, [
      item({ id: "rod", name: "Rod", w: 8, h: 3, d: 3, rotation: "free" }),
    ]);
    assert.equal(result.placements.length, 1);
    assert.equal(result.unpacked.length, 0);
  });

  it("refuses upright rotation that would tip a sofa", () => {
    const result = packBin({ w: 140, h: 220, d: 150 }, [
      item({ id: "sofa", name: "Sofa", w: 220, h: 85, d: 95, rotation: "upright" }),
    ]);
    assert.equal(result.placements.length, 0);
    assert.equal(result.unpacked.length, 1);
  });

  it("stands the sofa up when free rotation is allowed", () => {
    const result = packBin({ w: 140, h: 220, d: 150 }, [
      item({ id: "sofa", name: "Sofa", w: 220, h: 85, d: 95, rotation: "free" }),
    ]);
    assert.equal(result.placements.length, 1);
    assert.ok(result.placements[0]!.h <= 220 + 1e-6);
  });

  it("packs equal boxes into a grid without overlap", () => {
    const result = packBin({ w: 100, h: 40, d: 40 }, [
      item({ id: "b", name: "Box", w: 50, h: 40, d: 40, qty: 2, rotation: "none" }),
    ]);
    assert.equal(result.placements.length, 2);
    const [a, b] = result.placements;
    const overlap =
      a!.x < b!.x + b!.w &&
      a!.x + a!.w > b!.x &&
      a!.y < b!.y + b!.h &&
      a!.y + a!.h > b!.y &&
      a!.z < b!.z + b!.d &&
      a!.z + a!.d > b!.z;
    assert.equal(overlap, false);
    assert.ok(Math.abs(result.fillRatio - 1) < 1e-6);
  });
});
