'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { Model as NorthBeachGenerated } from './NorthBeachGenerated';
import { useLoading } from '@/contexts/LoadingContext';

export default function NorthBeachModel() {
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const { setLoaded } = useLoading();

  // Load the GLB with animations
  const { animations } = useGLTF('/3d/north_beach_web.glb');
  const { actions } = useAnimations(animations, modelRef);

  useEffect(() => {
    // Play all animations and loop them
    Object.values(actions).forEach((action) => {
      if (action) {
        action.play();
        action.setLoop(THREE.LoopRepeat, Infinity);
      }
    });
  }, [actions]);

  useEffect(() => {
    // Enable shadows for all meshes in the model
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
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
