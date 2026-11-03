import assert from "node:assert/strict";
import { test } from "node:test";
import { parsePersisted, projectFromLegacy } from "./projects.ts";

test("legacy v1 session becomes a named project", () => {
  const project = projectFromLegacy({
    unit: "m",
    bin: { w: 180, h: 240, d: 150 },
    items: [
      { id: "a", name: "Container", w: 60, h: 60, d: 50, qty: 8, color: "#5a7ab5", rotation: "free" },
    ],
    spaceId: null,
    explode: 0.2,
    showLabels: true,
  });
  assert.ok(project);
  assert.equal(project!.unit, "m");
  assert.equal(project!.items[0]!.name, "Container");
  assert.equal(project!.name, "Saved space");
});

test("v2 keeps the active project", () => {
  const raw = JSON.stringify({
    activeId: "p2",
    projects: [
      {
        id: "p1",
        name: "Milton Storage Unit",
        unit: "cm",
        bin: { w: 152, h: 244, d: 305 },
        items: [],
        spaceId: "storage-5x10",
        explode: 0,
        showLabels: true,
      },
      {
        id: "p2",
        name: "Brisbane Elevator",
        unit: "cm",
        bin: { w: 140, h: 220, d: 150 },
        items: [],
        spaceId: "elevator",
        explode: 0,
        showLabels: false,
      },
    ],
  });
  const parsed = parsePersisted(raw, null);
  assert.equal(parsed?.activeId, "p2");
  assert.equal(parsed?.projects.length, 2);
  assert.equal(parsed?.projects[1]!.name, "Brisbane Elevator");
});
