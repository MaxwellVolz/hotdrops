'use client';

import { useRef, useState } from 'react';
import { useFrame, useSpring } from '@react-three/fiber';
import { Cylinder, Plane, Text, Sphere } from '@react-three/drei';
import { Mesh } from 'three';
import { Product } from '@/types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'North Beach Coit Tower',
    description: 'Iconic Coit Tower replica with intricate detail',
    price: 49.99,
    totalQuantity: 250,
    availableQuantity: 187,
    modelPath: '/models/coit-tower.glb',
    position: [0, 1, 0],
  },
];

export default function NorthBeachModel() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground plane */}
      <Plane args={[12, 12]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#4a7c59" />
      </Plane>

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
              color={hovered ? "#ffd700" : "#d4af37"}
              roughness={0.3}
            />
          </Cylinder>

          {/* Tower details */}
          <Cylinder args={[0.35, 0.35, 0.3, 16]} position={[0, 1.8, 0]}>
            <meshStandardMaterial color={hovered ? "#e6c200" : "#c19b26"} />
          </Cylinder>

          <Text
            position={[0, 3.5, 0]}
            fontSize={0.25}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {product.name}
          </Text>

          <Text
            position={[0, 3, 0]}
            fontSize={0.15}
            color="gray"
            anchorX="center"
            anchorY="middle"
          >
            ${product.price} • Limited Edition
          </Text>
        </group>
      ))}

    </group>
  );
}

