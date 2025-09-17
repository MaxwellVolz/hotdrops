'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

export default function FadedPlane({ args, rotation, position }: {
  args: [number, number];
  rotation: [number, number, number];
  position: [number, number, number];
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(args[0], args[1], 32, 32);
    const positions = geo.attributes.position.array as Float32Array;
    const colors = new Float32Array(positions.length);

    const centerX = 0;
    const centerZ = 0;
    const maxDistance = Math.max(args[0], args[1]) / 2;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];

      const distance = Math.sqrt((x - centerX) ** 2 + (z - centerZ) ** 2);
      const normalizedDistance = Math.min(distance / maxDistance, 1);

      // Create radial fade effect with smoother falloff
      const alpha = Math.max(0, 1 - Math.pow(normalizedDistance, 2.5));

      colors[i] = alpha;     // R
      colors[i + 1] = alpha; // G
      colors[i + 2] = alpha; // B
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [args]);

  return (
    <mesh geometry={geometry} rotation={rotation} position={position}>
      <meshStandardMaterial
        color="#4a7c59"
        vertexColors
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}