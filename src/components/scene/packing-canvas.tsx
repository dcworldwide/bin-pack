import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { darken } from "@/lib/colors";
import { formatLen } from "@/lib/units";
import type { Bin, Placement, Unit } from "@/lib/types";

type Props = {
  bin: Bin;
  placements: Placement[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  explode: number;
  showLabels: boolean;
  unit: Unit;
  cameraNonce: number;
};

function cameraFit(bin: Bin) {
  const diag = Math.max(Math.hypot(bin.w, bin.h, bin.d), 1);
  return {
    diag,
    near: Math.max(diag * 0.08, 2),
    far: Math.max(diag * 30, 200),
    position: [bin.w * 0.5 + diag * 0.85, bin.h * 0.5 + diag * 0.55, bin.d * 0.5 + diag * 0.9] as [
      number,
      number,
      number,
    ],
    target: [bin.w / 2, bin.h / 2, bin.d / 2] as [number, number, number],
  };
}

export function PackingCanvas(props: Props) {
  const { bin } = props;
  const fit = cameraFit(bin);

  return (
    <Canvas
      className="h-full w-full touch-none"
      dpr={[1, 2]}
      camera={{
        position: fit.position,
        fov: 42,
        near: fit.near,
        far: fit.far,
      }}
      gl={{
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
        toneMapping: THREE.NoToneMapping,
      }}
      onPointerMissed={() => props.onSelect(null)}
    >
      <color attach="background" args={["#0c0d0f"]} />
      <ambientLight intensity={1} />
      <CameraRig bin={bin} nonce={props.cameraNonce} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={fit.diag * 0.25}
        maxDistance={fit.diag * 6}
        target={fit.target}
        maxPolarAngle={Math.PI * 0.49}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[bin.w / 2, -0.4, bin.d / 2]}>
        <planeGeometry args={[Math.max(bin.w, bin.d) * 3, Math.max(bin.w, bin.d) * 3]} />
        <meshBasicMaterial color="#14161a" />
      </mesh>
      <Container bin={bin} unit={props.unit} showLabels={props.showLabels} />
      {props.placements.map((p) => (
        <PackedBox
          key={p.instanceId}
          placement={p}
          bin={bin}
          explode={props.explode}
          selected={props.selectedId === p.instanceId || props.selectedId === p.itemId}
          showLabel={props.showLabels && (props.selectedId === p.instanceId || props.selectedId === p.itemId)}
          unit={props.unit}
          onSelect={props.onSelect}
        />
      ))}
    </Canvas>
  );
}

function CameraRig({ bin, nonce }: { bin: Bin; nonce: number }) {
  const { camera, controls } = useThree();

  useEffect(() => {
    const fit = cameraFit(bin);
    camera.position.set(...fit.position);
    camera.near = fit.near;
    camera.far = fit.far;
    camera.updateProjectionMatrix();
    const orbit = controls as unknown as { target: THREE.Vector3; update: () => void } | null;
    if (orbit?.target && typeof orbit.update === "function") {
      orbit.target.set(...fit.target);
      orbit.update();
    }
  }, [bin.w, bin.h, bin.d, nonce, camera, controls]);

  return null;
}

function Container({ bin, unit, showLabels }: { bin: Bin; unit: Unit; showLabels: boolean }) {
  const { w, h, d } = bin;
  const tick = Math.max(Math.min(w, h, d) * 0.05, 4);
  const t = Math.max(Math.min(w, h, d) * 0.012, 1.1);

  return (
    <group>
      <WireCube w={w} h={h} d={d} thickness={t} color="#cfd3db" />
      <Bar a={[0, 0, 0]} b={[w, 0, 0]} thickness={t * 1.6} color="#e07070" />
      <Bar a={[0, 0, 0]} b={[0, h, 0]} thickness={t * 1.6} color="#7dce7d" />
      <Bar a={[0, 0, 0]} b={[0, 0, d]} thickness={t * 1.6} color="#7aa0e0" />
      {showLabels && (
        <>
          <Html position={[w / 2, -tick, 0]} center style={{ pointerEvents: "none" }}>
            <DimTag color="var(--color-axis-x)" label={`X width  ${formatLen(w, unit)}`} />
          </Html>
          <Html position={[-tick, h / 2, 0]} center style={{ pointerEvents: "none" }}>
            <DimTag color="var(--color-axis-y)" label={`Y height  ${formatLen(h, unit)}`} />
          </Html>
          <Html position={[0, -tick, d / 2]} center style={{ pointerEvents: "none" }}>
            <DimTag color="var(--color-axis-z)" label={`Z depth  ${formatLen(d, unit)}`} />
          </Html>
        </>
      )}
    </group>
  );
}

function WireCube({
  w,
  h,
  d,
  thickness,
  color,
  ox = 0,
  oy = 0,
  oz = 0,
}: {
  w: number;
  h: number;
  d: number;
  thickness: number;
  color: string;
  ox?: number;
  oy?: number;
  oz?: number;
}) {
  const edges = useMemo(() => {
    const x0 = ox;
    const x1 = ox + w;
    const y0 = oy;
    const y1 = oy + h;
    const z0 = oz;
    const z1 = oz + d;
    return [
      [[x0, y0, z0], [x1, y0, z0]],
      [[x1, y0, z0], [x1, y0, z1]],
      [[x1, y0, z1], [x0, y0, z1]],
      [[x0, y0, z1], [x0, y0, z0]],
      [[x0, y1, z0], [x1, y1, z0]],
      [[x1, y1, z0], [x1, y1, z1]],
      [[x1, y1, z1], [x0, y1, z1]],
      [[x0, y1, z1], [x0, y1, z0]],
      [[x0, y0, z0], [x0, y1, z0]],
      [[x1, y0, z0], [x1, y1, z0]],
      [[x1, y0, z1], [x1, y1, z1]],
      [[x0, y0, z1], [x0, y1, z1]],
    ] as Array<[[number, number, number], [number, number, number]]>;
  }, [w, h, d, ox, oy, oz]);

  return (
    <group>
      {edges.map((edge, i) => (
        <Bar key={i} a={edge[0]} b={edge[1]} thickness={thickness} color={color} />
      ))}
    </group>
  );
}

function Bar({
  a,
  b,
  thickness,
  color,
}: {
  a: [number, number, number];
  b: [number, number, number];
  thickness: number;
  color: string;
}) {
  const { mid, quat, len } = useMemo(() => {
    const dir = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    const length = dir.length() || 0.001;
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(1, 0, 0),
      dir.clone().normalize(),
    );
    return {
      mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2] as [number, number, number],
      quat: quaternion,
      len: length,
    };
  }, [a, b]);

  return (
    <mesh position={mid} quaternion={quat}>
      <boxGeometry args={[len, thickness, thickness]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function DimTag({ color, label }: { color: string; label: string }) {
  return (
    <div
      className="whitespace-nowrap rounded-full px-2 py-1 font-mono text-[10px] tracking-wide text-foreground"
      style={{
        background: "color-mix(in oklab, var(--color-background) 82%, transparent)",
        boxShadow: `0 0 0 1px color-mix(in oklab, ${color} 65%, transparent)`,
      }}
    >
      {label}
    </div>
  );
}

function PackedBox({
  placement,
  bin,
  explode,
  selected,
  showLabel,
  unit,
  onSelect,
}: {
  placement: Placement;
  bin: Bin;
  explode: number;
  selected: boolean;
  showLabel: boolean;
  unit: Unit;
  onSelect: (id: string | null) => void;
}) {
  const { x, y, z, w, h, d } = placement;
  const cx = bin.w / 2;
  const cy = bin.h / 2;
  const cz = bin.d / 2;
  const px = x + w / 2;
  const py = y + h / 2;
  const pz = z + d / 2;
  const k = explode * 0.45;
  const pos: [number, number, number] = [px + (px - cx) * k, py + (py - cy) * k, pz + (pz - cz) * k];
  const edge = selected ? "#f2f0ea" : darken(placement.color, 0.4);
  const t = Math.max(Math.min(w, h, d) * 0.025, 0.7);

  return (
    <group position={pos}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(placement.instanceId);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <boxGeometry args={[w, h, d]} />
        <meshBasicMaterial color={placement.color} />
      </mesh>
      <WireCube w={w} h={h} d={d} thickness={t} color={edge} ox={-w / 2} oy={-h / 2} oz={-d / 2} />
      {showLabel && (
        <Html position={[0, h / 2 + Math.max(h * 0.08, 4), 0]} center style={{ pointerEvents: "none" }}>
          <div className="rounded-md bg-background/90 px-2 py-1 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.1)]">
            <div className="text-[11px] font-medium text-foreground">{placement.name}</div>
            <div className="font-mono text-[10px] text-muted-foreground">
              {formatLen(w, unit)} × {formatLen(h, unit)} × {formatLen(d, unit)}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
