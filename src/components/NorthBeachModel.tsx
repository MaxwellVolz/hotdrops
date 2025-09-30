'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { Model as NorthBeachGenerated } from './NorthBeachGenerated';
import { useLoading } from '@/contexts/LoadingContext';

// Light Easter/San Francisco inspired color palette for buildings (excluding whites)
const softColors = [
  '#FFE4E1', // Misty rose (very light pink)
  '#FFEBF0', // Light pink
  '#FFF0F5', // Lavender blush
  '#E6E6FA', // Lavender (light purple)
  '#F0F8FF', // Alice blue (very light blue)
  '#E0F6FF', // Light cyan
  '#F5FFFA', // Mint cream (very light green)
  '#FFF8DC', // Cornsilk (very light yellow)
  '#FFFACD', // Lemon chiffon
  '#FFE4B5', // Moccasin (light peach)
  '#E0FFE0', // Light green
  '#FFE0FF', // Light magenta
];

export default function NorthBeachModel() {
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const { setLoaded } = useLoading();

  // Load the GLB with animations
  const { animations } = useGLTF('/3d/north_beach_web.glb');
  const { actions } = useAnimations(animations, modelRef);

  useEffect(() => {
    // Play the topAction animation and loop it
    if (actions.topAction) {
      actions.topAction.play();
      actions.topAction.setLoop(THREE.LoopRepeat, Infinity);
    }
  }, [actions]);

  useEffect(() => {
    // Enable shadows and apply colors to meshes in the model
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          // Apply different soft Easter colors to individual buildings while preserving roofs
          if (child.name === 'buildings' && child.geometry) {
            // Clone the original material to preserve roof properties
            const originalMaterial = Array.isArray(child.material) ? child.material[0] : child.material;

            if (originalMaterial instanceof THREE.MeshStandardMaterial) {
              // Create vertex colors for different buildings
              const geometry = child.geometry;
              const positionAttribute = geometry.getAttribute('position');
              const colorAttribute = new THREE.BufferAttribute(
                new Float32Array(positionAttribute.count * 3), 3
              );

              // Group vertices by approximate building positions and assign colors
              for (let i = 0; i < positionAttribute.count; i++) {
                const x = positionAttribute.getX(i);
                const z = positionAttribute.getZ(i);

                // Use position to determine which "building" this vertex belongs to
                const buildingIndex = Math.floor((x + 10) / 2) + Math.floor((z + 10) / 2) * 10;
                const colorIndex = buildingIndex % softColors.length;
                const softColor = new THREE.Color(softColors[colorIndex]);

                // Blend with original material color to preserve roof characteristics
                const originalColor = originalMaterial.color.clone();
                const blendedColor = originalColor.lerp(softColor, 0.6);

                colorAttribute.setXYZ(i, blendedColor.r, blendedColor.g, blendedColor.b);
              }

              geometry.setAttribute('color', colorAttribute);

              // Clone material and enable vertex colors while preserving other properties
              const material = originalMaterial.clone();
              material.vertexColors = true;

              child.material = material;
            }
          }
        }
      });

      setTimeout(() => {
        setLoaded();
      }, 500);
    }
  }, [setLoaded]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <NorthBeachGenerated ref={modelRef} />
    </group>
  );
}
