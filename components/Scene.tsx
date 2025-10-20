
"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

function Petal() {
  return (
    <mesh rotation={[0.2, 0.4, 0]}>
      <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
      <meshStandardMaterial metalness={0.2} roughness={0.4} color="#8bd3dd" />
    </mesh>
  );
}

export default function scene() {
  return (
    <div className="h-[360px] w-full rounded-2xl border border-black/5 shadow-sm">
      <Canvas camera={{ position: [2.5, 2, 2.5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 2]} intensity={0.9} />
        <Suspense fallback={null}>
          <Petal />
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
