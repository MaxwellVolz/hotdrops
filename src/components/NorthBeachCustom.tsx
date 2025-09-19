'use client';

import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Light Easter/San Francisco inspired color palette for buildings
const softColors = [
  '#FFFFFF', // Pure white
  '#FEFEFE', // Off white
  '#F8F8FF', // Ghost white
  '#FFE4E1', // Misty rose (very light pink)
  '#FFEBF0', // Light pink
  '#FFF0F5', // Lavender blush
  '#E6E6FA', // Lavender (light purple)
  '#F0F8FF', // Alice blue (very light blue)
  '#E0F6FF', // Light cyan
  '#F5FFFA', // Mint cream (very light green)
  '#FFF8DC', // Cornsilk (very light yellow)
  '#FFFACD', // Lemon chiffon
];

const NorthBeachCustom = React.forwardRef<THREE.Group>((props, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/3d/north_beach_web.glb');

  useEffect(() => {
    if (groupRef.current && scene) {
      // Clear any existing children
      groupRef.current.clear();

      // Clone the scene to avoid modifying the original
      const clonedScene = scene.clone();

      // Traverse and find building meshes
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Enable shadows
          child.castShadow = true;
          child.receiveShadow = true;

          // Check if this is a building mesh (you may need to adjust this condition)
          if (child.name.toLowerCase().includes('building') ||
              child.name.toLowerCase().includes('house') ||
              child.name.toLowerCase().includes('structure')) {

            // Clone the material to avoid modifying shared materials
            if (child.material) {
              const clonedMaterial = Array.isArray(child.material)
                ? child.material.map(mat => mat.clone())
                : child.material.clone();

              // Apply random color from our palette
              const randomColor = softColors[Math.floor(Math.random() * softColors.length)];

              if (Array.isArray(clonedMaterial)) {
                clonedMaterial.forEach(mat => {
                  if (mat instanceof THREE.MeshStandardMaterial) {
                    mat.color = new THREE.Color(randomColor);
                    mat.color.multiplyScalar(0.95);
                  }
                });
              } else if (clonedMaterial instanceof THREE.MeshStandardMaterial) {
                clonedMaterial.color = new THREE.Color(randomColor);
                clonedMaterial.color.multiplyScalar(0.95);
              }

              child.material = clonedMaterial;
            }
          }
        }
      });

      // Add the cloned scene to our group
      groupRef.current.add(clonedScene);
    }
  }, [scene]);

  return <group ref={ref || groupRef} {...props} />;
});

NorthBeachCustom.displayName = 'NorthBeachCustom';

export default NorthBeachCustom;

useGLTF.preload('/3d/north_beach_web.glb');