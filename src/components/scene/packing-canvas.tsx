import { Html, Line, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
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
    position: [bin.w * 0.5 + diag * 0.85, bin.h * 0.5 + diag * 0.55, bin.d * 0.5 + diag * 0.9] as [number, number, number],
    target: [bin.w / 2, bin.h / 2, bin.d / 2] as [number, number, number],
  };
}

export function PackingCanvas(props: Props) {
  const fit = cameraFit(props.bin);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const tip = props.placements.find((p) => p.instanceId === hoveredId) ?? props.placements.find((p) => p.itemId === props.selectedId) ?? null;

  return (
    <Canvas
      className="h-full w-full touch-none"
      dpr={[1, 2]}
      camera={{ position: fit.position, fov: 42, near: fit.near, far: fit.far }}
      gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true, toneMapping: THREE.NoToneMapping }}
      onPointerMissed={() => props.onSelect(null)}
    >
      <color attach="background" args={["#0c0d0f"]} />
      <CameraRig bin={props.bin} nonce={props.cameraNonce} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={fit.diag * 0.25}
        maxDistance={fit.diag * 6}
        target={fit.target}
        maxPolarAngle={Math.PI * 0.49}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[props.bin.w / 2, -0.4, props.bin.d / 2]}>
        <planeGeometry args={[Math.max(props.bin.w, props.bin.d) * 3, Math.max(props.bin.w, props.bin.d) * 3]} />
        <meshBasicMaterial color="#14161a" />
      </mesh>
      <Container bin={props.bin} />
      {props.showLabels && <EdgeLabels bin={props.bin} unit={props.unit} />}
      {props.placements.map((p) => (
        <PackedBox
          key={p.instanceId}
          placement={p}
          bin={props.bin}
          explode={props.explode}
          selected={props.selectedId === p.itemId}
          hovered={hoveredId === p.instanceId}
          onSelect={props.onSelect}
          onHover={setHoveredId}
        />
      ))}
      {tip && <PieceTip placement={tip} bin={props.bin} explode={props.explode} unit={props.unit} />}
    </Canvas>
  );
}

function CameraRig({ bin, nonce }: { bin: Bin; nonce: number }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  useEffect(() => {
    const fit = cameraFit(bin);
    camera.position.set(...fit.position);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.near = fit.near;
      camera.far = fit.far;
      camera.updateProjectionMatrix();
    }
    const ctrl = controls as unknown as { target: THREE.Vector3; update: () => void } | null;
    ctrl?.target?.set(...fit.target);
    ctrl?.update?.();
  }, [bin.w, bin.h, bin.d, nonce, camera, controls]);
  return null;
}

function Container({ bin }: { bin: Bin }) {
  const box = useMemo(() => new THREE.BoxGeometry(bin.w, bin.h, bin.d), [bin.w, bin.h, bin.d]);
  const edges = useMemo(() => new THREE.EdgesGeometry(box), [box]);
  useEffect(() => () => { box.dispose(); edges.dispose(); }, [box, edges]);
  return (
    <group position={[bin.w / 2, bin.h / 2, bin.d / 2]}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#3a3d44" />
      </lineSegments>
      <mesh>
        <boxGeometry args={[bin.w, bin.h, bin.d]} />
        <meshBasicMaterial color="#c8ccd4" transparent opacity={0.03} depthWrite={false} />
      </mesh>
    </group>
  );
}

function makeLabelTexture(text: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 512, 96);
    ctx.font = "600 52px ui-sans-serif, system-ui, sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 256, 50);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function EdgeTag({
  text,
  color,
  position,
  rotation,
  width,
  height,
}: {
  text: string;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
}) {
  const tex = useMemo(() => makeLabelTexture(text, color), [text, color]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={position} rotation={rotation} renderOrder={2}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function EdgeLabels({ bin, unit }: { bin: Bin; unit: Unit }) {
  const diag = Math.max(Math.hypot(bin.w, bin.h, bin.d), 1);
  const height = Math.max(diag * 0.038, 7);
  const width = height * 3.2;
  const gap = height * 0.85;
  return (
    <group>
      <Line points={[[0, 0, bin.d], [bin.w, 0, bin.d]]} color="#c45c5c" lineWidth={2} />
      <Line points={[[0, 0, bin.d], [0, bin.h, bin.d]]} color="#6aa56a" lineWidth={2} />
      <Line points={[[bin.w, 0, 0], [bin.w, 0, bin.d]]} color="#5a7ab5" lineWidth={2} />
      <EdgeTag
        text={`X  ${formatLen(bin.w, unit)}`}
        color="#e7b0b0"
        position={[bin.w / 2, -gap, bin.d + gap * 0.35]}
        rotation={[0, 0, 0]}
        width={Math.min(width, bin.w * 0.92)}
        height={height}
      />
      <EdgeTag
        text={`Y  ${formatLen(bin.h, unit)}`}
        color="#b7d4b7"
        position={[-gap, bin.h / 2, bin.d + gap * 0.35]}
        rotation={[0, 0, Math.PI / 2]}
        width={Math.min(width, bin.h * 0.92)}
        height={height}
      />
      <EdgeTag
        text={`Z  ${formatLen(bin.d, unit)}`}
        color="#b7c6e4"
        position={[bin.w + gap, -gap, bin.d / 2]}
        rotation={[0, Math.PI / 2, 0]}
        width={Math.min(width, bin.d * 0.92)}
        height={height}
      />
    </group>
  );
}

function piecePosition(p: Placement, bin: Bin, explode: number): [number, number, number] {
  const cx = p.x + p.w / 2;
  const cy = p.y + p.h / 2;
  const cz = p.z + p.d / 2;
  return [cx + (cx - bin.w / 2) * explode, cy + (cy - bin.h / 2) * explode, cz + (cz - bin.d / 2) * explode];
}

function PackedBox({
  placement,
  bin,
  explode,
  selected,
  hovered,
  onSelect,
  onHover,
}: {
  placement: Placement;
  bin: Bin;
  explode: number;
  selected: boolean;
  hovered: boolean;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}) {
  const { w, h, d, color, itemId, instanceId } = placement;
  const box = useMemo(() => new THREE.BoxGeometry(w, h, d), [w, h, d]);
  const edges = useMemo(() => new THREE.EdgesGeometry(box), [box]);
  useEffect(() => () => { box.dispose(); edges.dispose(); }, [box, edges]);
  return (
    <group position={piecePosition(placement, bin, explode)}>
      <mesh
        geometry={box}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(itemId);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(instanceId);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = "auto";
        }}
      >
        <meshBasicMaterial color={color} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={selected || hovered ? "#ecece8" : darken(color, 0.38)} />
      </lineSegments>
    </group>
  );
}

function PieceTip({ placement, bin, explode, unit }: { placement: Placement; bin: Bin; explode: number; unit: Unit }) {
  const [x, y, z] = piecePosition(placement, bin, explode);
  return (
    <Html position={[x, y + placement.h / 2, z]} center sprite zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
      <div className="whitespace-nowrap rounded-md bg-background/92 px-2 py-1 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.12)]">
        <div className="text-[11px] font-medium text-foreground">{placement.name}</div>
        <div className="font-mono text-[10px] tabular-nums text-muted-foreground">
          {formatLen(placement.w, unit)} × {formatLen(placement.h, unit)} × {formatLen(placement.d, unit)}
        </div>
      </div>
    </Html>
  );
}
