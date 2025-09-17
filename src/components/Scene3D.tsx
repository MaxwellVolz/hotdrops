'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import { Suspense } from 'react';
import NorthBeachModel from './NorthBeachModel';
import LoadingSpinner from './LoadingSpinner';
import CTABox from './CTABox';

export default function Scene3D() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-100 to-blue-50">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 50 }}
        shadows
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          <Center>
            <NorthBeachModel />
          </Center>

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>

      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">HotDrops</h1>
        <p className="text-lg text-gray-600">North Beach 3D Collectibles</p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <CTABox />
      </Suspense>

      <div className="absolute bottom-4 right-4 z-10">
        <p className="text-sm text-gray-500">
          Click and drag to explore • Scroll to zoom
        </p>
      </div>
    </div>
  );
}