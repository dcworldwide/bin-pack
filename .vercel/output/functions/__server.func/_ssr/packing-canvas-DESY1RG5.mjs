import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as useThree, n as Html, o as Quaternion, r as Canvas, s as Vector3, t as OrbitControls, u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { n as formatLen, r as darken } from "./routes-B_IBR2DY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/packing-canvas-DESY1RG5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cameraFit(bin) {
	const diag = Math.max(Math.hypot(bin.w, bin.h, bin.d), 1);
	return {
		diag,
		near: Math.max(diag * .08, 2),
		far: Math.max(diag * 30, 200),
		position: [
			bin.w * .5 + diag * .85,
			bin.h * .5 + diag * .55,
			bin.d * .5 + diag * .9
		],
		target: [
			bin.w / 2,
			bin.h / 2,
			bin.d / 2
		]
	};
}
function PackingCanvas(props) {
	const { bin } = props;
	const fit = cameraFit(bin);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
		className: "h-full w-full touch-none",
		dpr: [1, 2],
		camera: {
			position: fit.position,
			fov: 42,
			near: fit.near,
			far: fit.far
		},
		gl: {
			antialias: true,
			alpha: false,
			preserveDrawingBuffer: true,
			powerPreference: "high-performance",
			toneMapping: 0
		},
		onPointerMissed: () => props.onSelect(null),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
				attach: "background",
				args: ["#0c0d0f"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: 1 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraRig, {
				bin,
				nonce: props.cameraNonce
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
				makeDefault: true,
				enableDamping: true,
				dampingFactor: .08,
				minDistance: fit.diag * .25,
				maxDistance: fit.diag * 6,
				target: fit.target,
				maxPolarAngle: Math.PI * .49
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				position: [
					bin.w / 2,
					-.4,
					bin.d / 2
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [Math.max(bin.w, bin.d) * 3, Math.max(bin.w, bin.d) * 3] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#14161a" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Container, {
				bin,
				unit: props.unit,
				showLabels: props.showLabels
			}),
			props.placements.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackedBox, {
				placement: p,
				bin,
				explode: props.explode,
				selected: props.selectedId === p.instanceId || props.selectedId === p.itemId,
				showLabel: props.showLabels && (props.selectedId === p.instanceId || props.selectedId === p.itemId),
				unit: props.unit,
				onSelect: props.onSelect
			}, p.instanceId))
		]
	});
}
function CameraRig({ bin, nonce }) {
	const { camera, controls } = useThree();
	(0, import_react.useEffect)(() => {
		const fit = cameraFit(bin);
		camera.position.set(...fit.position);
		camera.near = fit.near;
		camera.far = fit.far;
		camera.updateProjectionMatrix();
		const orbit = controls;
		if (orbit?.target && typeof orbit.update === "function") {
			orbit.target.set(...fit.target);
			orbit.update();
		}
	}, [
		bin.w,
		bin.h,
		bin.d,
		nonce,
		camera,
		controls
	]);
	return null;
}
function Container({ bin, unit, showLabels }) {
	const { w, h, d } = bin;
	const tick = Math.max(Math.min(w, h, d) * .05, 4);
	const t = Math.max(Math.min(w, h, d) * .012, 1.1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WireCube, {
			w,
			h,
			d,
			thickness: t,
			color: "#cfd3db"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
			a: [
				0,
				0,
				0
			],
			b: [
				w,
				0,
				0
			],
			thickness: t * 1.6,
			color: "#e07070"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
			a: [
				0,
				0,
				0
			],
			b: [
				0,
				h,
				0
			],
			thickness: t * 1.6,
			color: "#7dce7d"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
			a: [
				0,
				0,
				0
			],
			b: [
				0,
				0,
				d
			],
			thickness: t * 1.6,
			color: "#7aa0e0"
		}),
		showLabels && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
				position: [
					w / 2,
					-tick,
					0
				],
				center: true,
				style: { pointerEvents: "none" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DimTag, {
					color: "var(--color-axis-x)",
					label: `X width  ${formatLen(w, unit)}`
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
				position: [
					-tick,
					h / 2,
					0
				],
				center: true,
				style: { pointerEvents: "none" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DimTag, {
					color: "var(--color-axis-y)",
					label: `Y height  ${formatLen(h, unit)}`
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
				position: [
					0,
					-tick,
					d / 2
				],
				center: true,
				style: { pointerEvents: "none" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DimTag, {
					color: "var(--color-axis-z)",
					label: `Z depth  ${formatLen(d, unit)}`
				})
			})
		] })
	] });
}
function WireCube({ w, h, d, thickness, color, ox = 0, oy = 0, oz = 0 }) {
	const edges = (0, import_react.useMemo)(() => {
		const x0 = ox;
		const x1 = ox + w;
		const y0 = oy;
		const y1 = oy + h;
		const z0 = oz;
		const z1 = oz + d;
		return [
			[[
				x0,
				y0,
				z0
			], [
				x1,
				y0,
				z0
			]],
			[[
				x1,
				y0,
				z0
			], [
				x1,
				y0,
				z1
			]],
			[[
				x1,
				y0,
				z1
			], [
				x0,
				y0,
				z1
			]],
			[[
				x0,
				y0,
				z1
			], [
				x0,
				y0,
				z0
			]],
			[[
				x0,
				y1,
				z0
			], [
				x1,
				y1,
				z0
			]],
			[[
				x1,
				y1,
				z0
			], [
				x1,
				y1,
				z1
			]],
			[[
				x1,
				y1,
				z1
			], [
				x0,
				y1,
				z1
			]],
			[[
				x0,
				y1,
				z1
			], [
				x0,
				y1,
				z0
			]],
			[[
				x0,
				y0,
				z0
			], [
				x0,
				y1,
				z0
			]],
			[[
				x1,
				y0,
				z0
			], [
				x1,
				y1,
				z0
			]],
			[[
				x1,
				y0,
				z1
			], [
				x1,
				y1,
				z1
			]],
			[[
				x0,
				y0,
				z1
			], [
				x0,
				y1,
				z1
			]]
		];
	}, [
		w,
		h,
		d,
		ox,
		oy,
		oz
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: edges.map((edge, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
		a: edge[0],
		b: edge[1],
		thickness,
		color
	}, i)) });
}
function Bar({ a, b, thickness, color }) {
	const { mid, quat, len } = (0, import_react.useMemo)(() => {
		const dir = new Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
		const length = dir.length() || .001;
		const quaternion = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0), dir.clone().normalize());
		return {
			mid: [
				(a[0] + b[0]) / 2,
				(a[1] + b[1]) / 2,
				(a[2] + b[2]) / 2
			],
			quat: quaternion,
			len: length
		};
	}, [a, b]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: mid,
		quaternion: quat,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			len,
			thickness,
			thickness
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color })]
	});
}
function DimTag({ color, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "whitespace-nowrap rounded-full px-2 py-1 font-mono text-[10px] tracking-wide text-foreground",
		style: {
			background: "color-mix(in oklab, var(--color-background) 82%, transparent)",
			boxShadow: `0 0 0 1px color-mix(in oklab, ${color} 65%, transparent)`
		},
		children: label
	});
}
function PackedBox({ placement, bin, explode, selected, showLabel, unit, onSelect }) {
	const { x, y, z, w, h, d } = placement;
	const cx = bin.w / 2;
	const cy = bin.h / 2;
	const cz = bin.d / 2;
	const px = x + w / 2;
	const py = y + h / 2;
	const pz = z + d / 2;
	const k = explode * .45;
	const pos = [
		px + (px - cx) * k,
		py + (py - cy) * k,
		pz + (pz - cz) * k
	];
	const edge = selected ? "#f2f0ea" : darken(placement.color, .4);
	const t = Math.max(Math.min(w, h, d) * .025, .7);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: pos,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				onClick: (e) => {
					e.stopPropagation();
					onSelect(placement.instanceId);
				},
				onPointerOver: () => {
					document.body.style.cursor = "pointer";
				},
				onPointerOut: () => {
					document.body.style.cursor = "";
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					w,
					h,
					d
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: placement.color })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WireCube, {
				w,
				h,
				d,
				thickness: t,
				color: edge,
				ox: -w / 2,
				oy: -h / 2,
				oz: -d / 2
			}),
			showLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
				position: [
					0,
					h / 2 + Math.max(h * .08, 4),
					0
				],
				center: true,
				style: { pointerEvents: "none" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-background/90 px-2 py-1 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.1)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-medium text-foreground",
						children: placement.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-mono text-[10px] text-muted-foreground",
						children: [
							formatLen(w, unit),
							" × ",
							formatLen(h, unit),
							" × ",
							formatLen(d, unit)
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { PackingCanvas };
