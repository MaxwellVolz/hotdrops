'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame, useSpring } from '@react-three/fiber';
import { Cylinder, Text, Sphere, Box } from '@react-three/drei';
import FadedPlane from './FadedPlane';
import { Mesh } from 'three';
import { Product } from '@/types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Coit Cigs',
    description: 'Premium collectible with intricate detail',
    price: 49.99,
    totalQuantity: 250,
    availableQuantity: 187,
    modelPath: '/models/coit-cigs.glb',
    position: [0, 1, 0],
  },
];

// Building positions and properties
const buildingData = [
  { args: [0.8, 1.5, 0.8], position: [-2.5, -0.25, -1], color: "#6b7280" },
  { args: [0.6, 1.2, 0.6], position: [2.2, -0.4, -0.5], color: "#9ca3af" },
  { args: [0.7, 0.9, 0.7], position: [-1.8, -0.55, 1.5], color: "#6b7280" },
  { args: [0.5, 1.8, 0.5], position: [2.8, -0.1, 0.8], color: "#4b5563" },
  { args: [0.9, 1.1, 0.6], position: [-3, -0.45, 0.5], color: "#9ca3af" },
  { args: [0.6, 1.4, 0.7], position: [1.5, -0.3, -1.8], color: "#6b7280" },
  { args: [0.8, 1.0, 0.5], position: [-1.2, -0.5, -0.8], color: "#4b5563" },
  { args: [0.6, 1.3, 0.8], position: [-4.2, -0.35, -0.8], color: "#6b7280" },
  { args: [0.8, 1.0, 0.7], position: [3.8, -0.5, 0.2], color: "#9ca3af" },
  { args: [0.7, 1.6, 0.5], position: [-2.8, -0.2, 2.5], color: "#4b5563" },
  { args: [0.5, 1.4, 0.9], position: [1.8, -0.3, 2.2], color: "#6b7280" },
  { args: [0.9, 0.8, 0.6], position: [-1.2, -0.6, -2.8], color: "#9ca3af" },
  { args: [0.7, 1.5, 0.8], position: [4.5, -0.25, -1.2], color: "#4b5563" },
  { args: [0.6, 1.1, 0.6], position: [-3.5, -0.45, -2.1], color: "#6b7280" },
  { args: [0.8, 1.2, 0.7], position: [0.8, -0.4, 3.2], color: "#9ca3af" },
  { args: [0.4, 2.1, 0.4], position: [-5.5, 0.05, 1.2], color: "#6b7280" },
  { args: [0.8, 0.9, 0.8], position: [4.8, -0.55, -1.5], color: "#4b5563" },
  { args: [0.6, 1.7, 0.6], position: [-0.5, -0.15, 3.8], color: "#9ca3af" },
  { args: [0.7, 1.2, 0.8], position: [3.2, -0.4, 3.5], color: "#6b7280" },
  { args: [0.5, 1.5, 0.7], position: [-4.8, -0.25, -2.5], color: "#4b5563" },
  { args: [0.9, 1.3, 0.6], position: [5.2, -0.35, 1.8], color: "#9ca3af" },
  { args: [0.6, 0.9, 0.9], position: [-4.5, -0.55, 3.8], color: "#6b7280" },
  { args: [0.8, 1.6, 0.5], position: [2.5, -0.2, -4.1], color: "#4b5563" },
  { args: [1.2, 0.7, 0.9], position: [-6.2, -0.65, -0.2], color: "#9ca3af" },
  { args: [0.8, 1.9, 0.6], position: [5.5, -0.05, 0.8], color: "#6b7280" },
  { args: [0.6, 1.1, 1.0], position: [2.5, -0.45, 4.5], color: "#4b5563" },
  { args: [0.9, 1.4, 0.8], position: [-3.8, -0.3, 4.2], color: "#9ca3af" },
  { args: [0.7, 0.8, 0.7], position: [1.2, -0.6, -4.2], color: "#6b7280" },
  { args: [0.5, 1.6, 0.5], position: [-1.5, -0.2, -3.5], color: "#4b5563" },
  { args: [0.8, 1.0, 0.6], position: [4.2, -0.5, -3.8], color: "#9ca3af" },
  { args: [0.6, 1.3, 0.9], position: [-5.8, -0.35, 2.8], color: "#6b7280" },
  { args: [1.0, 0.6, 0.8], position: [6.2, -0.7, -2.2], color: "#4b5563" },
  { args: [0.7, 1.8, 0.6], position: [-7.5, -0.1, 1.5], color: "#6b7280" },
  { args: [0.9, 1.2, 0.8], position: [6.8, -0.4, -1.2], color: "#9ca3af" },
  { args: [0.6, 1.5, 0.7], position: [-2.2, -0.25, 5.8], color: "#4b5563" },
  { args: [0.8, 0.9, 1.0], position: [4.8, -0.55, 5.2], color: "#6b7280" },
  { args: [0.5, 2.0, 0.5], position: [-6.8, 0, -3.8], color: "#9ca3af" },
  { args: [1.1, 0.8, 0.9], position: [7.2, -0.6, 2.5], color: "#4b5563" },
  { args: [0.7, 1.4, 0.6], position: [-5.5, -0.3, -4.5], color: "#6b7280" },
  { args: [0.9, 1.1, 0.8], position: [1.8, -0.45, -5.8], color: "#9ca3af" },
  { args: [0.6, 1.6, 0.8], position: [-8.2, -0.2, -0.8], color: "#6b7280" },
  { args: [0.8, 1.3, 0.6], position: [7.8, -0.35, 0.5], color: "#4b5563" },
  { args: [0.7, 0.9, 1.2], position: [-0.8, -0.55, 6.5], color: "#9ca3af" },
  { args: [1.0, 1.7, 0.7], position: [3.5, -0.15, 6.8], color: "#6b7280" },
  { args: [0.5, 1.2, 0.9], position: [-7.8, -0.4, 4.2], color: "#4b5563" },
  { args: [0.9, 0.8, 0.6], position: [8.5, -0.6, -2.8], color: "#9ca3af" },
];

export default function NorthBeachModel() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Calculate static opacities based on distance from origin
  const buildingsWithOpacity = useMemo(() => {
    const groundRadius = 10; // Half of ground plane size (20x20)
    return buildingData.map(building => {
      const [x, y, z] = building.position;
      const distance = Math.sqrt(x * x + z * z);
      const normalizedDistance = Math.min(distance / groundRadius, 1);
      // Linear interpolation from 100% at center to 20% at edge
      const opacity = 1.0 - (normalizedDistance * 0.8); // 1.0 -> 0.2
      return { ...building, opacity };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground plane with fade */}
      <FadedPlane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} />

      {/* Hill */}
      <Sphere args={[2.5, 16, 8]} position={[0, -2, 0]}>
        <meshStandardMaterial color="#5d8a6b" />
      </Sphere>

      {mockProducts.map((product) => (
        <group
          key={product.id}
          position={[
            product.position[0],
            product.position[1] + (hovered ? 0.3 : 0),
            product.position[2]
          ]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
        >
          {/* Coit Tower - Cylinder */}
          <Cylinder
            args={[0.4, 0.5, 3, 16]}
          >
            <meshStandardMaterial
              color={hovered ? "#f8fafc" : "#ffffff"}
              roughness={0.2}
            />
          </Cylinder>

          {/* Tower details */}
          <Cylinder args={[0.35, 0.35, 0.3, 16]} position={[0, 1.8, 0]}>
            <meshStandardMaterial color={hovered ? "#e2e8f0" : "#f1f5f9"} />
          </Cylinder>

          <Text
            position={[0, 4, 0]}
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {product.name}
          </Text>

          <Text
            position={[0, 3.5, 0]}
            fontSize={0.18}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.005}
            outlineColor="#92400e"
            strokeWidth={0.01}
            strokeColor="#d97706"
          >
            ${product.price} • Limited Edition
          </Text>
        </group>
      ))}

      {/* Dense Urban Cityscape with static opacity */}
      {buildingsWithOpacity.map((building, index) => (
        <Box
          key={index}
          args={building.args as [number, number, number]}
          position={building.position as [number, number, number]}
        >
          <meshStandardMaterial
            color={building.color}
            roughness={0.4}
            opacity={building.opacity}
            transparent
          />
        </Box>
      ))}

    </group>
  );
}

