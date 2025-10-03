'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function Weather({ enabled = true, intensity = 0.5 }: { enabled?: boolean; intensity?: number }) {
  const { scene } = useThree();
  const rainRef = useRef<THREE.Points>(null);

  // Create rain particles
  const rainParticles = useMemo(() => {
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Spread particles in a cube around the scene
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      // Random fall speed for each particle
      velocities[i] = 0.1 + Math.random() * 0.2;
    }

    return { positions, velocities };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(rainParticles.positions, 3));
    return geo;
  }, [rainParticles.positions]);

  // Animate rain
  useFrame(() => {
    if (!enabled || !rainRef.current) return;

    const positions = rainRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < positions.length / 3; i++) {
      // Move particle down
      positions[i * 3 + 1] -= rainParticles.velocities[i] * intensity;

      // Reset particle to top if it falls below ground
      if (positions[i * 3 + 1] < -2) {
        positions[i * 3 + 1] = 30;
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      }
    }

    rainRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // Add fog to scene
  useFrame(() => {
    if (enabled && !scene.fog) {
      scene.fog = new THREE.FogExp2('#1e293b', 0.08 * intensity);
    } else if (!enabled && scene.fog) {
      scene.fog = null;
    } else if (enabled && scene.fog instanceof THREE.FogExp2) {
      // Adjust fog density based on intensity
      scene.fog.density = 0.08 * intensity;
    }
  });

  if (!enabled) return null;

  return (
    <points ref={rainRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}
