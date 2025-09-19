'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import { Suspense, useRef, useEffect } from 'react';
import { Vector3 } from 'three';
import NorthBeachModel from './NorthBeachModel';
import LoadingSpinner from './LoadingSpinner';
import CTABox from './CTABox';

function CameraAnimation() {
  const { camera } = useThree();
  const startPosition = useRef(new Vector3(-15, 15, 20));
  const targetPosition = useRef(new Vector3(0, 1, 2));
  const animationProgress = useRef(0);
  const isAnimating = useRef(true);

  useEffect(() => {
    camera.position.copy(startPosition.current);
  }, [camera]);

  useFrame((state, delta) => {
    if (isAnimating.current && animationProgress.current < 1) {
      animationProgress.current += delta * 0.4;

      if (animationProgress.current >= 1) {
        animationProgress.current = 1;
        isAnimating.current = false;
      }

      const t = 1 - Math.pow(1 - animationProgress.current, 3);
      camera.position.lerpVectors(startPosition.current, targetPosition.current, t);
    }
  });

  return null;
}

export default function Scene3D() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_49%,rgba(255,255,255,0.03)_50%,transparent_51%)] bg-[length:20px_20px]" />

      <Canvas
        camera={{ position: [0, 1, 2], fov: 80 }}
        shadows
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <CameraAnimation />
          <fogExp2 attach="fog" args={['#1e293b', 0.15]} />
          <Environment preset="city" />
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[0, 10, 0]} intensity={0.5} color="#60a5fa" />

          <NorthBeachModel />

          <OrbitControls
            target={[0, 0, 0]}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={10}
            maxPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={0.2}
          />
        </Suspense>
      </Canvas>

      {/* Premium header */}
      <div className="absolute top-6 left-6 z-10">
        <div className="backdrop-blur-md bg-white/10 p-4 rounded-2xl border border-white/20">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
            HotDrops
          </h1>
          <p className="text-blue-100 text-sm font-medium">
            Limited Runs. Infinite stories.
          </p>
        </div>
      </div>

      {/* Traction indicators */}
      <div className="absolute bottom-6 left-6 z-10 flex gap-4">
        <div className="backdrop-blur-md bg-white/10 p-3 rounded-xl border border-white/20">
          <div className="text-sm font-semibold text-white">187 Sold</div>
          <div className="text-xs text-blue-200">This Month</div>
        </div>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <CTABox />
      </Suspense>

      <div className="absolute bottom-6 right-6 z-10">
        <div className="backdrop-blur-md bg-white/10 p-3 rounded-xl border border-white/20">
          <p className="text-xs text-blue-200">
            🖱️ Drag to explore • 🔍 Scroll to zoom
          </p>
        </div>
      </div>
    </div>
  );
}