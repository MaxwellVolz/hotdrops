'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense, useRef, useEffect } from 'react';
import * as THREE from 'three';
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

function DynamicAmbientLight({ speed = 0.05 }: { speed?: number }) {
  const lightRef = useRef<THREE.AmbientLight>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime * speed;
    const radius = 20;
    const angle = time;
    const y = Math.sin(angle) * radius;
    const sunHeight = y / radius; // -1 to 1

    if (lightRef.current) {
      if (sunHeight > 0) {
        // Day - subtle ambient light
        lightRef.current.intensity = 0.05 * sunHeight + 0.01;
        lightRef.current.color.setHex(0xffffff); // White light
      } else {
        // Night - very dim blue ambient light
        lightRef.current.intensity = 0.005;
        lightRef.current.color.setHex(0x4488ff); // Blue light
      }
    }
  });

  return <ambientLight ref={lightRef} intensity={0.01} />;
}

function OrbitingSun({ speed = 0.05 }: { speed?: number }) {
  const sunRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();

  useFrame((state) => {
    const time = state.clock.elapsedTime * speed;
    const radius = 20;

    // Vertical rotation around scene for day/night cycle with offset
    const angle = time;
    const x = Math.cos(angle) * radius + 3; // Offset from center
    const y = Math.sin(angle) * radius + 2; // Slight vertical offset
    const z = 2; // Offset from center depth

    // Update sun visual position
    if (sunRef.current) {
      sunRef.current.position.set(x, y, z);
      // Remove pulsing - keep constant scale
      sunRef.current.scale.setScalar(1);
    }

    // Update sun glow
    if (glowRef.current) {
      glowRef.current.position.set(x, y, z);
      glowRef.current.lookAt(state.camera.position);
    }

    // Update directional light position pointing towards origin
    if (lightRef.current) {
      lightRef.current.position.set(x, y, z);
      lightRef.current.target.position.set(0, 0, 0);
      lightRef.current.target.updateMatrixWorld();

      // Intensity based on height - only when above horizon (y > 0)
      const intensityMultiplier = Math.max(0, y / radius);
      lightRef.current.intensity = 2.5 * intensityMultiplier;
    }

    // Day/night cycle effects
    const sunHeight = y / radius; // -1 to 1
    const dayIntensity = Math.max(0, sunHeight);
    const nightIntensity = Math.max(0, -sunHeight);

    // Update scene background color for day/night with smoother transitions
    if (scene.background instanceof THREE.Color) {
      // Smooth transition from night to day with muted colors
      const dayColor = new THREE.Color('#6B9DC2'); // Muted sky blue
      const sunsetColor = new THREE.Color('#D4824A'); // Muted orange sunset
      const nightColor = new THREE.Color('#0A0A15'); // Darker night

      let targetColor;
      if (sunHeight > 0.8) {
        // High noon - pure day
        targetColor = dayColor;
      } else if (sunHeight > 0.1) {
        // Daytime - blend day to sunset
        const t = (sunHeight - 0.1) / 0.7;
        targetColor = new THREE.Color().lerpColors(sunsetColor, dayColor, t);
      } else if (sunHeight > -0.1) {
        // Sunset/sunrise - orange glow
        targetColor = sunsetColor;
      } else if (sunHeight > -0.8) {
        // Twilight - blend sunset to night
        const t = (sunHeight + 0.8) / 0.7;
        targetColor = new THREE.Color().lerpColors(nightColor, sunsetColor, t);
      } else {
        // Deep night
        targetColor = nightColor;
      }

      // Smooth lerp to target color
      scene.background.lerp(targetColor, 0.02);
    } else {
      // Set initial background if not set
      scene.background = new THREE.Color('#6B9DC2');
    }
  });

  return (
    <>
      {/* Visual sun */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#FFD700"
        />
      </mesh>

      {/* Dramatic directional light */}
      <directionalLight
        ref={lightRef}
        intensity={4}
        color="#FFF8DC"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.002}
        shadow-normalBias={0.05}
      />
    </>
  );
}

function OrbitingMoon({ speed = 0.05 }: { speed?: number }) {
  const moonRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime * speed;
    const radius = 18;

    // Moon rotates vertically opposite to sun for day/night cycle with offset
    const angle = time + Math.PI;
    const x = Math.cos(angle) * radius - 2; // Different offset from sun
    const y = Math.sin(angle) * radius + 1; // Slight vertical offset
    const z = -1; // Different depth offset

    // Update moon visual position
    if (moonRef.current) {
      moonRef.current.position.set(x, y, z);
    }

    // Update moon glow
    if (glowRef.current) {
      glowRef.current.position.set(x, y, z);
      glowRef.current.lookAt(state.camera.position);
    }

    // Update moonlight
    if (lightRef.current) {
      lightRef.current.position.set(x, y, z);
      lightRef.current.target.position.set(0, 0, 0);
      lightRef.current.target.updateMatrixWorld();

      // Moonlight intensity - only when above horizon (y > 0), less intense than sun
      const intensityMultiplier = Math.max(0, y / radius);
      lightRef.current.intensity = 0.5 * intensityMultiplier;
    }
  });

  return (
    <>

      {/* Visual moon */}
      <mesh ref={moonRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#f5f5f5"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Soft moonlight */}
      <directionalLight
        ref={lightRef}
        intensity={0.4}
        color="#b3ccff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.001}
        shadow-normalBias={0.02}
      />
    </>
  );
}


export default function Scene3D() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_49%,rgba(255,255,255,0.03)_50%,transparent_51%)] bg-[length:20px_20px]" />

      <Canvas
        camera={{ position: [0, 1, 2], fov: 80 }}
        shadows={{ type: THREE.PCFSoftShadowMap }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <CameraAnimation />
          <OrbitingSun speed={1} />
          <OrbitingMoon speed={1} />
          {/* <fogExp2 attach="fog" args={['#1e293b', 0.15]} /> */}
          <DynamicAmbientLight speed={0.05} />


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