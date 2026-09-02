import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { a as Plus, c as Copy, i as RotateCcw, l as Check, n as Trash2, o as Maximize2, r as Tag, s as Layers, t as TriangleAlert, u as Box } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B_IBR2DY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
/** Distinct item hues for the 3D scene — not brand chrome. Kept light enough to read on ink. */
var ITEM_PALETTE = [
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
	"#9a8ea8"
];
function nextColor(index) {
	return ITEM_PALETTE[index % ITEM_PALETTE.length];
}
function darken(hex, amount = .28) {
	const { r, g, b } = parseHex(hex);
	const k = 1 - amount;
	return rgbToHex(r * k, g * k, b * k);
}
function parseHex(hex) {
	const h = hex.replace("#", "");
	const n = Number.parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
	return {
		r: n >> 16 & 255,
		g: n >> 8 & 255,
		b: n & 255
	};
}
function rgbToHex(r, g, b) {
	const to = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
	return `#${to(r)}${to(g)}${to(b)}`;
}
var TO_CM = {
	cm: 1,
	m: 100,
	in: 2.54,
	ft: 30.48
};
var UNIT_LABEL = {
	cm: "cm",
	m: "m",
	in: "in",
	ft: "ft"
};
function toCm(value, unit) {
	return value * TO_CM[unit];
}
function fromCm(cm, unit) {
	return cm / TO_CM[unit];
}
function decimalsFor(unit) {
	if (unit === "m") return 3;
	if (unit === "cm") return 1;
	return 2;
}
function roundForUnit(cm, unit) {
	const n = fromCm(cm, unit);
	const f = 10 ** decimalsFor(unit);
	return Math.round(n * f) / f;
}
function formatLen(cm, unit) {
	return `${trimNum(roundForUnit(cm, unit))} ${UNIT_LABEL[unit]}`;
}
function formatVolume(cm3, unit) {
	const n = cm3 / TO_CM[unit] ** 3;
	if (n >= 100) return `${n.toFixed(0)} ${UNIT_LABEL[unit]}³`;
	if (n >= 10) return `${n.toFixed(1)} ${UNIT_LABEL[unit]}³`;
	if (n >= 1) return `${n.toFixed(2)} ${UNIT_LABEL[unit]}³`;
	return `${n.toFixed(3)} ${UNIT_LABEL[unit]}³`;
}
function trimNum(n) {
	if (!Number.isFinite(n)) return "0";
	return n.toFixed(3).replace(/\.?0+$/, "");
}
function parsePositive(raw) {
	const n = Number(raw);
	if (!Number.isFinite(n) || n <= 0) return null;
	return n;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	if (typeof crypto !== "undefined" && crypto.randomUUID) return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
var SPACE_PRESETS = [
	{
		id: "elevator",
		name: "Residential elevator",
		hint: "Typical passenger lift",
		bin: {
			w: 140,
			h: 220,
			d: 150
		}
	},
	{
		id: "freight-elevator",
		name: "Freight elevator",
		hint: "Service / goods lift",
		bin: {
			w: 180,
			h: 240,
			d: 250
		}
	},
	{
		id: "storage-5x5",
		name: "5 × 5 storage unit",
		hint: "5 ft × 5 ft × 8 ft",
		bin: {
			w: 152,
			h: 244,
			d: 152
		}
	},
	{
		id: "storage-5x10",
		name: "5 × 10 storage unit",
		hint: "5 ft × 10 ft × 8 ft",
		bin: {
			w: 152,
			h: 244,
			d: 305
		}
	},
	{
		id: "storage-10x10",
		name: "10 × 10 storage unit",
		hint: "10 ft × 10 ft × 8 ft",
		bin: {
			w: 305,
			h: 244,
			d: 305
		}
	},
	{
		id: "container-20",
		name: "20-ft shipping container",
		hint: "Standard dry van",
		bin: {
			w: 235,
			h: 239,
			d: 590
		}
	},
	{
		id: "closet",
		name: "Walk-in closet",
		hint: "Small dressing room",
		bin: {
			w: 180,
			h: 240,
			d: 120
		}
	},
	{
		id: "studio",
		name: "Studio room",
		hint: "Single-room apartment",
		bin: {
			w: 400,
			h: 270,
			d: 350
		}
	}
];
var ITEM_CATALOG = [
	{
		name: "Small box",
		w: 35,
		h: 35,
		d: 35,
		rotation: "free"
	},
	{
		name: "Medium box",
		w: 50,
		h: 40,
		d: 40,
		rotation: "free"
	},
	{
		name: "Large box",
		w: 60,
		h: 50,
		d: 50,
		rotation: "free"
	},
	{
		name: "Sofa",
		w: 220,
		h: 85,
		d: 95,
		rotation: "upright"
	},
	{
		name: "Armchair",
		w: 90,
		h: 90,
		d: 85,
		rotation: "upright"
	},
	{
		name: "Queen mattress",
		w: 203,
		h: 30,
		d: 153,
		rotation: "free"
	},
	{
		name: "Fridge",
		w: 70,
		h: 175,
		d: 70,
		rotation: "upright"
	},
	{
		name: "Washer",
		w: 60,
		h: 85,
		d: 65,
		rotation: "upright"
	},
	{
		name: "Bicycle",
		w: 180,
		h: 110,
		d: 60,
		rotation: "upright"
	},
	{
		name: "Dining table",
		w: 160,
		h: 75,
		d: 90,
		rotation: "upright"
	},
	{
		name: "Dining chair",
		w: 45,
		h: 90,
		d: 50,
		rotation: "upright"
	},
	{
		name: "Bookshelf",
		w: 80,
		h: 180,
		d: 30,
		rotation: "upright"
	},
	{
		name: "Suitcase",
		w: 75,
		h: 30,
		d: 50,
		rotation: "free"
	},
	{
		name: "Wardrobe",
		w: 120,
		h: 200,
		d: 60,
		rotation: "upright"
	},
	{
		name: "TV",
		w: 120,
		h: 70,
		d: 8,
		rotation: "upright"
	},
	{
		name: "Office chair",
		w: 65,
		h: 110,
		d: 65,
		rotation: "upright"
	}
];
var SCENARIOS = [
	{
		id: "elevator-move",
		name: "Elevator load",
		blurb: "A sofa will not stand in a passenger lift unless you allow free rotation.",
		spaceId: "elevator",
		items: [
			{
				name: "Fridge",
				w: 70,
				h: 175,
				d: 70,
				rotation: "upright",
				qty: 1
			},
			{
				name: "Medium box",
				w: 50,
				h: 40,
				d: 40,
				rotation: "free",
				qty: 4
			},
			{
				name: "Suitcase",
				w: 75,
				h: 30,
				d: 50,
				rotation: "free",
				qty: 2
			},
			{
				name: "Sofa",
				w: 220,
				h: 85,
				d: 95,
				rotation: "upright",
				qty: 1
			},
			{
				name: "Bicycle",
				w: 180,
				h: 110,
				d: 60,
				rotation: "upright",
				qty: 1
			}
		]
	},
	{
		id: "storage-move",
		name: "5 × 10 move-in",
		blurb: "A typical apartment load into a 5 × 10 unit.",
		spaceId: "storage-5x10",
		items: [
			{
				name: "Sofa",
				w: 220,
				h: 85,
				d: 95,
				rotation: "upright",
				qty: 1
			},
			{
				name: "Queen mattress",
				w: 203,
				h: 30,
				d: 153,
				rotation: "free",
				qty: 1
			},
			{
				name: "Fridge",
				w: 70,
				h: 175,
				d: 70,
				rotation: "upright",
				qty: 1
			},
			{
				name: "Dining table",
				w: 160,
				h: 75,
				d: 90,
				rotation: "upright",
				qty: 1
			},
			{
				name: "Dining chair",
				w: 45,
				h: 90,
				d: 50,
				rotation: "upright",
				qty: 4
			},
			{
				name: "Large box",
				w: 60,
				h: 50,
				d: 50,
				rotation: "free",
				qty: 6
			},
			{
				name: "Bookshelf",
				w: 80,
				h: 180,
				d: 30,
				rotation: "upright",
				qty: 1
			}
		]
	},
	{
		id: "container",
		name: "Export crate",
		blurb: "Mixed cargo in a 20-ft dry container.",
		spaceId: "container-20",
		items: [
			{
				name: "Large box",
				w: 60,
				h: 50,
				d: 50,
				rotation: "free",
				qty: 18
			},
			{
				name: "Fridge",
				w: 70,
				h: 175,
				d: 70,
				rotation: "upright",
				qty: 2
			},
			{
				name: "Washer",
				w: 60,
				h: 85,
				d: 65,
				rotation: "upright",
				qty: 2
			},
			{
				name: "Wardrobe",
				w: 120,
				h: 200,
				d: 60,
				rotation: "upright",
				qty: 2
			},
			{
				name: "Sofa",
				w: 220,
				h: 85,
				d: 95,
				rotation: "upright",
				qty: 1
			}
		]
	}
];
function makeItem(partial) {
	return {
		id: uid("item"),
		name: partial.name,
		w: partial.w,
		h: partial.h,
		d: partial.d,
		qty: partial.qty ?? 1,
		rotation: partial.rotation ?? "upright",
		color: partial.color ?? nextColor(partial.colorIndex ?? 0)
	};
}
function itemsFromScenario(scenario) {
	return scenario.items.map((item, i) => makeItem({
		...item,
		colorIndex: i
	}));
}
function defaultScenario() {
	const scene = SCENARIOS[0];
	const space = SPACE_PRESETS.find((s) => s.id === scene.spaceId);
	return {
		bin: { ...space.bin },
		items: itemsFromScenario(scene),
		spaceId: space.id
	};
}
var STORAGE_KEY = "stow:v1";
var seed = defaultScenario();
function persist(state) {
	if (typeof localStorage === "undefined") return;
	const payload = {
		unit: state.unit,
		bin: state.bin,
		items: state.items,
		spaceId: state.spaceId
	};
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
	} catch {}
}
var usePackStore = create((set, get) => ({
	unit: "cm",
	bin: seed.bin,
	items: seed.items,
	spaceId: seed.spaceId,
	selectedId: null,
	explode: 0,
	showLabels: true,
	cameraNonce: 0,
	hydrated: false,
	setUnit: (unit) => {
		set({ unit });
		persist(get());
	},
	setBin: (partial) => {
		set((s) => ({
			bin: {
				...s.bin,
				...partial
			},
			spaceId: null
		}));
		persist(get());
	},
	applySpacePreset: (id) => {
		const preset = SPACE_PRESETS.find((p) => p.id === id);
		if (!preset) return;
		set({
			bin: { ...preset.bin },
			spaceId: id,
			cameraNonce: get().cameraNonce + 1
		});
		persist(get());
	},
	loadScenario: (scenario) => {
		const space = SPACE_PRESETS.find((p) => p.id === scenario.spaceId);
		if (!space) return;
		set({
			bin: { ...space.bin },
			items: itemsFromScenario(scenario),
			spaceId: space.id,
			selectedId: null,
			cameraNonce: get().cameraNonce + 1
		});
		persist(get());
	},
	addItem: (item) => {
		const items = get().items;
		const next = {
			id: item?.id ?? `item_${crypto.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 8)}`,
			name: item?.name ?? "New item",
			w: item?.w ?? 50,
			h: item?.h ?? 40,
			d: item?.d ?? 40,
			qty: item?.qty ?? 1,
			color: item?.color ?? nextColor(items.length),
			rotation: item?.rotation ?? "upright"
		};
		set({
			items: [...items, next],
			selectedId: next.id
		});
		persist(get());
	},
	updateItem: (id, partial) => {
		set((s) => ({ items: s.items.map((it) => it.id === id ? {
			...it,
			...partial
		} : it) }));
		persist(get());
	},
	removeItem: (id) => {
		set((s) => ({
			items: s.items.filter((it) => it.id !== id),
			selectedId: s.selectedId === id ? null : s.selectedId
		}));
		persist(get());
	},
	duplicateItem: (id) => {
		const src = get().items.find((it) => it.id === id);
		if (!src) return;
		get().addItem({
			...src,
			id: void 0,
			name: src.name
		});
	},
	clearItems: () => {
		set({
			items: [],
			selectedId: null
		});
		persist(get());
	},
	setSelected: (id) => set({ selectedId: id }),
	setExplode: (v) => set({ explode: v }),
	setShowLabels: (v) => set({ showLabels: v }),
	resetCamera: () => set({ cameraNonce: get().cameraNonce + 1 }),
	hydrate: () => {
		if (get().hydrated) return;
		if (typeof localStorage === "undefined") {
			set({ hydrated: true });
			return;
		}
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (parsed?.bin && Array.isArray(parsed.items)) {
					set({
						unit: parsed.unit ?? "cm",
						bin: parsed.bin,
						items: parsed.items,
						spaceId: parsed.spaceId ?? null,
						hydrated: true
					});
					return;
				}
			}
		} catch {}
		set({ hydrated: true });
	}
}));
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
			ghost: "hover:bg-muted text-foreground",
			outline: "bg-transparent text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.10)] hover:bg-muted",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11",
			"icon-sm": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-11 w-full min-w-0 rounded-md bg-muted px-3 text-sm text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-[box-shadow,background-color] duration-150 placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:opacity-40", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium tracking-wide text-muted-foreground", className),
		...props
	});
}
var UNITS = [
	"cm",
	"m",
	"in",
	"ft"
];
function SpacePanel() {
	const unit = usePackStore((s) => s.unit);
	const setUnit = usePackStore((s) => s.setUnit);
	const bin = usePackStore((s) => s.bin);
	const setBin = usePackStore((s) => s.setBin);
	const spaceId = usePackStore((s) => s.spaceId);
	const applySpacePreset = usePackStore((s) => s.applySpacePreset);
	const loadScenario = usePackStore((s) => s.loadScenario);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-medium text-foreground",
					children: "The space"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs leading-relaxed text-muted-foreground",
					children: "Elevator, storage unit, crate — any rectangular volume."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Preset",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
						value: spaceId ?? "",
						onChange: (v) => {
							if (v) applySpacePreset(v);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Custom"
						}), SPACE_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.id,
							children: p.name
						}, p.id))]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Units",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
						value: unit,
						onChange: (v) => setUnit(v),
						children: UNITS.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: u,
							children: u
						}, u))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DimInput, {
						label: "Width X",
						value: roundForUnit(bin.w, unit),
						onCommit: (n) => setBin({ w: toCm(n, unit) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DimInput, {
						label: "Height Y",
						value: roundForUnit(bin.h, unit),
						onCommit: (n) => setBin({ h: toCm(n, unit) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DimInput, {
						label: "Depth Z",
						value: roundForUnit(bin.d, unit),
						onCommit: (n) => setBin({ d: toCm(n, unit) })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Try a sample load" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: SCENARIOS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => loadScenario(s),
						className: "rounded-lg bg-muted/60 px-3 py-2.5 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-colors duration-150 hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium text-foreground",
							children: s.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs leading-relaxed text-muted-foreground",
							children: s.blurb
						})]
					}, s.id))
				})]
			})
		]
	});
}
function AddItemBar() {
	const addItem = usePackStore((s) => s.addItem);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[1fr_auto] gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
			value: "",
			onChange: (v) => {
				const cat = ITEM_CATALOG.find((c) => c.name === v);
				if (!cat) return;
				addItem({ ...cat });
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "",
				children: "Add from catalog…"
			}), ITEM_CATALOG.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: c.name,
				children: c.name
			}, c.name))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "secondary",
			onClick: () => addItem({
				name: "Custom item",
				w: 50,
				h: 40,
				d: 40,
				rotation: "free"
			}),
			children: "Custom"
		})]
	});
}
function DimInput({ label, value, onCommit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: "number",
			inputMode: "decimal",
			min: 0,
			step: "any",
			defaultValue: value,
			onBlur: (e) => {
				const n = parsePositive(e.target.value);
				if (n == null) {
					e.target.value = String(value);
					return;
				}
				onCommit(n);
			},
			onKeyDown: (e) => {
				if (e.key === "Enter") e.target.blur();
			}
		}, value)
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex min-w-0 flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function NativeSelect({ value, onChange, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		value,
		onChange: (e) => onChange(e.target.value),
		className: className ?? "h-11 w-full min-w-0 rounded-md bg-muted px-3 text-sm text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
		children
	});
}
function RotationSelect({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
		value,
		onChange: (v) => onChange(v),
		className: "h-9 w-full min-w-0 rounded-md bg-muted px-3 text-sm text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "upright",
				children: "Upright"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "free",
				children: "Free rotate"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "none",
				children: "No rotate"
			})
		]
	});
}
function ItemList() {
	const items = usePackStore((s) => s.items);
	const clearItems = usePackStore((s) => s.clearItems);
	const selectedId = usePackStore((s) => s.selectedId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-medium text-foreground",
						children: "Objects"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: items.length === 0 ? "Nothing to pack yet." : `${items.length} kind${items.length === 1 ? "" : "s"}`
					})]
				}), items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: clearItems,
					children: "Clear"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddItemBar, {}),
			items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyItems, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCard, {
					item,
					active: selectedId === item.id
				}) }, item.id))
			})
		]
	});
}
function EmptyItems() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-muted/40 px-4 py-6 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mx-auto mb-2 size-4 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-foreground",
				children: "Add boxes, furniture, or a custom piece."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Catalog items already know whether they should stay upright."
			})
		]
	});
}
function ItemCard({ item, active }) {
	const unit = usePackStore((s) => s.unit);
	const updateItem = usePackStore((s) => s.updateItem);
	const removeItem = usePackStore((s) => s.removeItem);
	const duplicateItem = usePackStore((s) => s.duplicateItem);
	const setSelected = usePackStore((s) => s.setSelected);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("rounded-xl bg-card p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-[box-shadow] duration-150", active && "shadow-[0_0_0_1px_rgba(200,204,212,0.55)]"),
		onClick: () => setSelected(item.id),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-3 shrink-0 rounded-sm",
						style: { background: item.color },
						"aria-hidden": true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: item.name,
						onChange: (e) => updateItem(item.id, { name: e.target.value }),
						className: "h-9",
						"aria-label": "Item name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						"aria-label": "Duplicate",
						onClick: (e) => {
							e.stopPropagation();
							duplicateItem(item.id);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						"aria-label": "Remove",
						onClick: (e) => {
							e.stopPropagation();
							removeItem(item.id);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 flex flex-wrap gap-1.5",
				children: ITEM_PALETTE.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": `Color ${c}`,
					onClick: (e) => {
						e.stopPropagation();
						updateItem(item.id, { color: c });
					},
					className: cn("size-6 rounded-md", item.color === c ? "ring-2 ring-ring ring-offset-2 ring-offset-card" : ""),
					style: { background: c }
				}, c))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniDim, {
						label: "W",
						value: roundForUnit(item.w, unit),
						onCommit: (n) => updateItem(item.id, { w: toCm(n, unit) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniDim, {
						label: "H",
						value: roundForUnit(item.h, unit),
						onCommit: (n) => updateItem(item.id, { h: toCm(n, unit) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniDim, {
						label: "D",
						value: roundForUnit(item.d, unit),
						onCommit: (n) => updateItem(item.id, { d: toCm(n, unit) })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Qty",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						inputMode: "numeric",
						min: 1,
						max: 99,
						value: item.qty,
						onChange: (e) => {
							const n = Math.floor(Number(e.target.value));
							if (!Number.isFinite(n)) return;
							updateItem(item.id, { qty: Math.min(99, Math.max(1, n)) });
						},
						className: "h-9"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Rotation",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotationSelect, {
						value: item.rotation,
						onChange: (rotation) => updateItem(item.id, { rotation })
					})
				})]
			})
		]
	});
}
function MiniDim({ label, value, onCommit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: "number",
			inputMode: "decimal",
			min: 0,
			step: "any",
			defaultValue: value,
			className: "h-9",
			onBlur: (e) => {
				const n = parsePositive(e.target.value);
				if (n == null) {
					e.target.value = String(value);
					return;
				}
				onCommit(n);
			},
			onKeyDown: (e) => {
				if (e.key === "Enter") e.target.blur();
			}
		}, value)
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-muted text-muted-foreground",
		ok: "bg-ok/15 text-ok",
		warn: "bg-warn/15 text-warn",
		danger: "bg-destructive/15 text-destructive"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({
			variant,
			className
		})),
		...props
	});
}
function ResultPanel({ result }) {
	const unit = usePackStore((s) => s.unit);
	const setSelected = usePackStore((s) => s.setSelected);
	const selectedId = usePackStore((s) => s.selectedId);
	const packedCount = result.placements.length;
	const leftoverCount = result.unpacked.length;
	const pct = Math.round(result.fillRatio * 100);
	const remaining = Math.max(0, result.binVolume - result.usedVolume);
	const ok = leftoverCount === 0 && packedCount > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-medium text-foreground",
					children: "Result"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						packedCount,
						" packed",
						leftoverCount > 0 ? ` · ${leftoverCount} left out` : ""
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: ok ? "ok" : leftoverCount > 0 ? "danger" : "default",
					children: packedCount === 0 && leftoverCount === 0 ? "Empty" : ok ? "All fit" : "Won't all fit"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between font-mono text-xs tabular-nums text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fill" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-foreground",
							children: [pct, "%"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("h-full rounded-full transition-[width] duration-300", leftoverCount > 0 ? "bg-warn" : "bg-ok"),
							style: { width: `${Math.min(100, pct)}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-[11px] tabular-nums text-muted-foreground",
						children: [
							formatVolume(result.usedVolume, unit),
							" used · ",
							formatVolume(remaining, unit),
							" free"
						]
					})
				]
			}),
			leftoverCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-destructive/10 p-3 shadow-[0_0_0_1px_rgba(180,92,78,0.28)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-2 text-sm font-medium text-destructive",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" }),
						"Cannot fit ",
						leftoverCount,
						" piece",
						leftoverCount === 1 ? "" : "s"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: result.unpacked.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-xs leading-relaxed",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-left text-foreground",
							onClick: () => setSelected(u.itemId),
							children: u.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block text-muted-foreground",
							children: u.reason
						})]
					}, u.instanceId))
				})]
			}),
			ok && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2 rounded-xl bg-ok/10 p-3 text-xs leading-relaxed text-foreground shadow-[0_0_0_1px_rgba(125,154,126,0.28)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 size-4 shrink-0 text-ok" }), "Everything fits. Drag the view to inspect, or explode the stack to see each piece."]
			}),
			packedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "max-h-48 space-y-1 overflow-auto pr-1",
				children: result.placements.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSelected(p.instanceId),
					className: cn("flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition-colors duration-150 hover:bg-muted", selectedId === p.instanceId && "bg-muted"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-2.5 shrink-0 rounded-sm",
							style: { background: p.color }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate text-foreground",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 font-mono tabular-nums text-muted-foreground",
							children: [
								formatLen(p.w, unit),
								"×",
								formatLen(p.h, unit),
								"×",
								formatLen(p.d, unit)
							]
						})
					]
				}) }, p.instanceId))
			})
		]
	});
}
var PackingCanvas = (0, import_react.lazy)(() => import("./packing-canvas-DESY1RG5.mjs").then((m) => ({ default: m.PackingCanvas })));
function Viewport({ result }) {
	const bin = usePackStore((s) => s.bin);
	const unit = usePackStore((s) => s.unit);
	const selectedId = usePackStore((s) => s.selectedId);
	const setSelected = usePackStore((s) => s.setSelected);
	const explode = usePackStore((s) => s.explode);
	const setExplode = usePackStore((s) => s.setExplode);
	const showLabels = usePackStore((s) => s.showLabels);
	const setShowLabels = usePackStore((s) => s.setShowLabels);
	const cameraNonce = usePackStore((s) => s.cameraNonce);
	const resetCamera = usePackStore((s) => s.resetCamera);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative flex min-h-[42vh] flex-1 flex-col overflow-hidden bg-background lg:min-h-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0",
				children: mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewportFallback, {}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackingCanvas, {
						bin,
						placements: result.placements,
						selectedId,
						onSelect: setSelected,
						explode,
						showLabels,
						unit,
						cameraNonce
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewportFallback, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3 sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AxisLegend, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto flex items-center gap-1 rounded-xl bg-background/80 p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							"aria-label": "Toggle dimension labels",
							onClick: () => setShowLabels(!showLabels),
							className: cn(showLabels && "bg-muted"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							"aria-label": "Reset camera",
							onClick: resetCamera,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							"aria-label": "Fit view",
							onClick: resetCamera,
							className: "hidden sm:inline-flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, {})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto mx-auto flex max-w-md items-center gap-3 rounded-xl bg-background/80 px-3 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-16 shrink-0 text-[11px] font-medium tracking-wide text-muted-foreground",
						children: "Explode"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 100,
						value: Math.round(explode * 100),
						onChange: (e) => setExplode(Number(e.target.value) / 100),
						className: "h-11 w-full cursor-pointer accent-primary",
						"aria-label": "Explode packing"
					})]
				})
			})
		]
	});
}
function AxisLegend() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "pointer-events-none space-y-1 rounded-xl bg-background/80 px-3 py-2 font-mono text-[10px] tracking-wide text-muted-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-axis-x" }), " X width"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-axis-y" }), " Y height"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-axis-z" }), " Z depth"]
			})
		]
	});
}
function ViewportFallback() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-full w-full bg-background",
		"aria-hidden": true
	});
}
var EPS = 1e-6;
var MAX_INSTANCES = 250;
function volumeOf(w, h, d) {
	return w * h * d;
}
function snap(n) {
	if (Math.abs(n) < 1e-6) return 0;
	return Math.round(n * 1e3) / 1e3;
}
function orientations(w, h, d, mode) {
	if (mode === "none") return [{
		w,
		h,
		d
	}];
	if (mode === "upright") {
		const list = [{
			w,
			h,
			d
		}];
		if (Math.abs(w - d) > EPS) list.push({
			w: d,
			h,
			d: w
		});
		return list;
	}
	const perms = [
		{
			w,
			h,
			d
		},
		{
			w,
			h: d,
			d: h
		},
		{
			w: h,
			h: w,
			d
		},
		{
			w: h,
			h: d,
			d: w
		},
		{
			w: d,
			h: w,
			d: h
		},
		{
			w: d,
			h,
			d: w
		}
	];
	const seen = /* @__PURE__ */ new Set();
	const unique = [];
	for (const p of perms) {
		const key = `${p.w.toFixed(4)}:${p.h.toFixed(4)}:${p.d.toFixed(4)}`;
		if (seen.has(key)) continue;
		seen.add(key);
		unique.push(p);
	}
	return unique;
}
function inside(bin, box) {
	return box.x >= -1e-6 && box.y >= -1e-6 && box.z >= -1e-6 && box.x + box.w <= bin.w + EPS && box.y + box.h <= bin.h + EPS && box.z + box.d <= bin.d + EPS;
}
function overlaps(a, b) {
	return a.x + a.w > b.x + EPS && b.x + b.w > a.x + EPS && a.y + a.h > b.y + EPS && b.y + b.h > a.y + EPS && a.z + a.d > b.z + EPS && b.z + b.d > a.z + EPS;
}
function collides(placed, box) {
	for (const p of placed) if (overlaps(p, box)) return true;
	return false;
}
function canPlace(bin, placed, box) {
	return inside(bin, box) && !collides(placed, box);
}
function dropAxis(bin, placed, box, axis) {
	const origin = axis === "x" ? box.x : axis === "y" ? box.y : box.z;
	if (origin <= EPS) return {
		...box,
		[axis]: 0
	};
	let lo = 0;
	let hi = origin;
	for (let i = 0; i < 28; i++) {
		const mid = (lo + hi) / 2;
		if (canPlace(bin, placed, {
			...box,
			[axis]: origin - mid
		})) lo = mid;
		else hi = mid;
	}
	if (lo < .001) return {
		...box,
		[axis]: snap(origin)
	};
	return {
		...box,
		[axis]: snap(origin - lo)
	};
}
function settle(bin, placed, box) {
	let next = dropAxis(bin, placed, box, "y");
	next = dropAxis(bin, placed, next, "z");
	next = dropAxis(bin, placed, next, "x");
	return next;
}
function pointKey(x, y, z) {
	return `${snap(x)}:${snap(y)}:${snap(z)}`;
}
function candidatePoints(placed) {
	const seen = /* @__PURE__ */ new Set();
	const pts = [];
	const add = (x, y, z) => {
		const nx = snap(x);
		const ny = snap(y);
		const nz = snap(z);
		const k = pointKey(nx, ny, nz);
		if (seen.has(k)) return;
		seen.add(k);
		pts.push([
			nx,
			ny,
			nz
		]);
	};
	add(0, 0, 0);
	for (const p of placed) {
		add(p.x + p.w, p.y, p.z);
		add(p.x, p.y + p.h, p.z);
		add(p.x, p.y, p.z + p.d);
		add(p.x + p.w, p.y, p.z + p.d);
		add(p.x + p.w, p.y + p.h, p.z);
		add(p.x, p.y + p.h, p.z + p.d);
	}
	pts.sort((a, b) => a[1] - b[1] || a[2] - b[2] || a[0] - b[0]);
	return pts;
}
function tooLarge(bin, oris) {
	return !oris.some((o) => o.w <= bin.w + EPS && o.h <= bin.h + EPS && o.d <= bin.d + EPS);
}
function findPlacement(bin, placed, oris) {
	const points = candidatePoints(placed);
	let best = null;
	let bestScore = Infinity;
	for (const ori of oris) {
		if (ori.w > bin.w + EPS || ori.h > bin.h + EPS || ori.d > bin.d + EPS) continue;
		for (const [x, y, z] of points) {
			const raw = {
				x,
				y,
				z,
				w: ori.w,
				h: ori.h,
				d: ori.d
			};
			if (!canPlace(bin, placed, raw)) continue;
			const box = settle(bin, placed, raw);
			const score = box.y * 0xe8d4a51000 + box.z * 1e6 + box.x + ori.w * ori.h * 1e-6;
			if (score < bestScore) {
				bestScore = score;
				best = box;
			}
		}
	}
	return best;
}
function expand(items) {
	const instances = [];
	let truncated = 0;
	for (const item of items) {
		const qty = Math.max(0, Math.floor(item.qty));
		for (let i = 0; i < qty; i++) {
			if (instances.length >= MAX_INSTANCES) {
				truncated += qty - i;
				break;
			}
			instances.push({
				instanceId: `${item.id}#${i + 1}`,
				item,
				index: i
			});
		}
	}
	instances.sort((a, b) => {
		const va = volumeOf(a.item.w, a.item.h, a.item.d);
		const vb = volumeOf(b.item.w, b.item.h, b.item.d);
		if (vb !== va) return vb - va;
		const ma = Math.max(a.item.w, a.item.h, a.item.d);
		const mb = Math.max(b.item.w, b.item.h, b.item.d);
		if (mb !== ma) return mb - ma;
		return a.item.name.localeCompare(b.item.name) || a.index - b.index;
	});
	return {
		instances,
		truncated
	};
}
function packBin(bin, items) {
	const binVolume = Math.max(0, volumeOf(bin.w, bin.h, bin.d));
	const placements = [];
	const unpacked = [];
	const placedBoxes = [];
	if (bin.w <= 0 || bin.h <= 0 || bin.d <= 0) return {
		placements,
		unpacked,
		bin,
		usedVolume: 0,
		unpackedVolume: 0,
		binVolume: 0,
		fillRatio: 0
	};
	const { instances, truncated } = expand(items);
	if (truncated > 0) unpacked.push({
		instanceId: "truncated",
		itemId: "truncated",
		name: `${truncated} extra piece${truncated === 1 ? "" : "s"}`,
		w: 0,
		h: 0,
		d: 0,
		color: "#666666",
		reason: `Packing is capped at ${MAX_INSTANCES} pieces. Remove some items and try again.`
	});
	for (const inst of instances) {
		const { item } = inst;
		const oris = orientations(item.w, item.h, item.d, item.rotation);
		const vol = volumeOf(item.w, item.h, item.d);
		let reason = null;
		if (item.w <= 0 || item.h <= 0 || item.d <= 0) reason = "Dimensions must be greater than zero.";
		else if (tooLarge(bin, oris)) reason = `Too large for this space ${item.rotation === "upright" ? "while kept upright" : item.rotation === "none" ? "in the orientation you entered" : "even when rotated"}.`;
		else {
			const remaining = binVolume - placements.reduce((s, p) => s + volumeOf(p.w, p.h, p.d), 0);
			const found = findPlacement(bin, placedBoxes, oris);
			if (found) {
				placedBoxes.push(found);
				placements.push({
					instanceId: inst.instanceId,
					itemId: item.id,
					name: item.qty > 1 ? `${item.name} ${inst.index + 1}` : item.name,
					color: item.color,
					x: found.x,
					y: found.y,
					z: found.z,
					w: found.w,
					h: found.h,
					d: found.d
				});
				continue;
			}
			if (vol > remaining + EPS) reason = "Not enough leftover volume.";
			else reason = "Volume remains, but no leftover pocket matches this shape. Try free rotation or a larger space.";
		}
		unpacked.push({
			instanceId: inst.instanceId,
			itemId: item.id,
			name: item.qty > 1 ? `${item.name} ${inst.index + 1}` : item.name,
			w: item.w,
			h: item.h,
			d: item.d,
			color: item.color,
			reason: reason ?? "Does not fit."
		});
	}
	const usedVolume = placements.reduce((s, p) => s + volumeOf(p.w, p.h, p.d), 0);
	return {
		placements,
		unpacked,
		bin,
		usedVolume,
		unpackedVolume: unpacked.reduce((s, u) => s + volumeOf(u.w, u.h, u.d), 0),
		binVolume,
		fillRatio: binVolume > 0 ? usedVolume / binVolume : 0
	};
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	const hydrate = usePackStore((s) => s.hydrate);
	const bin = usePackStore((s) => s.bin);
	const items = usePackStore((s) => s.items);
	const unit = usePackStore((s) => s.unit);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	const result = (0, import_react.useMemo)(() => packBin(bin, items), [bin, items]);
	const leftover = result.unpacked.length;
	const [tab, setTab] = (0, import_react.useState)("space");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-dvh flex-col bg-background text-foreground lg:h-dvh lg:overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl font-medium tracking-tight text-foreground",
					children: "Stow"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs text-muted-foreground",
					children: "Pack a space. See it in 3D."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: leftover > 0 ? "danger" : result.placements.length ? "ok" : "default",
					children: leftover > 0 ? `${leftover} left out` : result.placements.length ? "Fits" : "Empty"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "hidden font-mono text-[11px] tabular-nums text-muted-foreground sm:inline",
					children: [
						formatLen(bin.w, unit),
						" × ",
						formatLen(bin.h, unit),
						" × ",
						formatLen(bin.d, unit)
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1 flex-col lg:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, { result }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex w-full shrink-0 flex-col border-t border-border bg-card lg:h-full lg:w-[380px] lg:border-t-0 lg:border-l",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex shrink-0 gap-1 border-b border-border p-2 lg:hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
								active: tab === "space",
								onClick: () => setTab("space"),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { className: "size-4" }),
								children: "Space"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
								active: tab === "items",
								onClick: () => setTab("items"),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4" }),
								children: "Objects"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
								active: tab === "result",
								onClick: () => setTab("result"),
								children: "Result"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden min-h-0 flex-1 flex-col overflow-y-auto lg:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
								className: "border-b border-border p-5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpacePanel, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
								className: "border-b border-border p-5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemList, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
								className: "p-5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultPanel, { result })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-h-0 flex-1 overflow-y-auto p-4 lg:hidden",
						children: [
							tab === "space" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpacePanel, {}),
							tab === "items" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemList, {}),
							tab === "result" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultPanel, { result })
						]
					})
				]
			})]
		})]
	});
}
function TabBtn({ active, onClick, children, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors duration-150", active ? "bg-muted text-foreground" : "text-muted-foreground"),
		children: [icon, children]
	});
}
//#endregion
export { formatLen as n, darken as r, routes_exports as t };
