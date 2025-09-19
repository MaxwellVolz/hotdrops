'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { Model } from './NorthBeachGenerated';

export default function NorthBeachModel() {
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);

  // Get animations from the generated model
  const { actions } = useAnimations([], modelRef);

  useEffect(() => {
    // Play the topAction animation and loop it
    if (actions.topAction) {
      actions.topAction.play();
      actions.topAction.setLoop(THREE.LoopRepeat, Infinity);
    }
  }, [actions]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Model ref={modelRef} />
    </group>
  );
}
