'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { Suspense, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Vector3 } from 'three';
import NorthBeachModel from './NorthBeachModel';
import LoadingSpinner from './LoadingSpinner';
import CTABox from './CTABox';
import ProductGallery from './ProductGallery';
import Weather from './Weather';
import { useLoading } from '@/contexts/LoadingContext';

function CameraAnimation() {
  const { camera } = useThree();
  const { isLoaded } = useLoading();
  const startPosition = useRef(new Vector3(-10, 15, 15));
  const targetPosition = useRef(new Vector3(-2, 1, 2));
  const animationProgress = useRef(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    camera.position.copy(startPosition.current);
  }, [camera]);

  useEffect(() => {
    if (isLoaded) {
      isAnimating.current = true;
    }
  }, [isLoaded]);

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
    const radius = 30;

    // Vertical rotation around scene for day/night cycle with offset
    // Sun now takes moon's previous position (rotated back 30 degrees)
    const angle = time - (30 * Math.PI / 180);
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

    // Update directional light position - 20 degrees ahead of visual sun
    if (lightRef.current) {
      const lightAngle = angle + (20 * Math.PI / 180); // 20 degrees ahead in orbit
      const lightX = Math.cos(lightAngle) * radius + 3;
      const lightY = Math.sin(lightAngle) * radius + 2;
      const lightZ = 2;

      lightRef.current.position.set(lightX, lightY, lightZ);
      lightRef.current.target.position.set(0, 0, 0);
      lightRef.current.target.updateMatrixWorld();

      // Intensity based on light height - only when above horizon (lightY > 0)
      const intensityMultiplier = Math.max(0, lightY / radius);
      lightRef.current.intensity = 2.5 * intensityMultiplier;
    }

    // Day/night cycle effects
    const sunHeight = y / radius; // -1 to 1

    // Update scene background color with natural day/night progression
    if (scene.background instanceof THREE.Color) {
      // Natural sky color progression
      const sunriseColor = new THREE.Color('#FF6B6B'); // Soft red sunrise
      const morningColor = new THREE.Color('#87CEEB'); // Sky blue morning
      const noonColor = new THREE.Color('#87CEFA'); // Light sky blue noon
      const twilightColor = new THREE.Color('#8A2BE2'); // Blue violet twilight
      const nightColor = new THREE.Color('#0B0B0F'); // Very dark blue night

      let targetColor;

      // Sun above horizon (day cycle)
      if (sunHeight > 0.7) {
        // High noon
        targetColor = noonColor;
      } else if (sunHeight > 0.3) {
        // Morning to noon
        const t = (sunHeight - 0.3) / 0.4;
        targetColor = new THREE.Color().lerpColors(morningColor, noonColor, t);
      } else if (sunHeight > 0.1) {
        // Late morning
        const t = (sunHeight - 0.1) / 0.2;
        targetColor = new THREE.Color().lerpColors(sunriseColor, morningColor, t);
      } else if (sunHeight > 0.0) {
        // Just at sunrise
        targetColor = sunriseColor;
      }
      // Sun below horizon (night cycle)
      else if (sunHeight > -0.1) {
        // Immediate twilight after sunset
        const t = (sunHeight + 0.1) / 0.1;
        targetColor = new THREE.Color().lerpColors(twilightColor, sunriseColor, t);
      } else if (sunHeight > -0.3) {
        // Early night
        const t = (sunHeight + 0.3) / 0.2;
        targetColor = new THREE.Color().lerpColors(nightColor, twilightColor, t);
      } else {
        // Deep night - stays dark
        targetColor = nightColor;
      }

      // Smooth color transition
      scene.background.lerp(targetColor, 0.015);
    } else {
      // Set initial background
      scene.background = new THREE.Color('#FF6B6B');
    }
  });

  return (
    <>
      {/* Visual sun */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[8, 32, 32]} />
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
    const radius = 25;

    // Moon rotates directly opposite to sun (180 degrees apart)
    const sunAngle = time - (30 * Math.PI / 180); // Sun's current angle
    const angle = sunAngle + Math.PI; // Moon is 180 degrees opposite
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

      // Moonlight intensity - only when above horizon (y > 0), brighter than before
      const intensityMultiplier = Math.max(0, y / radius);
      lightRef.current.intensity = 1.5 * intensityMultiplier;
    }
  });

  return (
    <>

      {/* Visual moon */}
      <mesh ref={moonRef}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#f5f5f5"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Brighter moonlight */}
      <directionalLight
        ref={lightRef}
        intensity={1.2}
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
  const [rainEnabled, setRainEnabled] = useState(false);

  const toggleRain = () => {
    setRainEnabled(!rainEnabled);
  };

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
          <OrbitingSun speed={.1} />
          <OrbitingMoon speed={.1} />
          {/* <fogExp2 attach="fog" args={['#1e293b', 0.15]} /> */}
          <DynamicAmbientLight speed={0.05} />


          <NorthBeachModel />

          <Weather enabled={rainEnabled} intensity={0.5} />

          {/* Soft spotlight on Coit Tower at 0,0,0 */}
          <spotLight
            position={[2, 5, 2]}
            target-position={[0, 0, 0]}
            angle={Math.PI / 6}
            penumbra={0.8}
            intensity={2}
            color="#fff8dc"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={0.1}
            shadow-camera-far={20}
            shadow-bias={-0.0001}
          />

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

          <EffectComposer>
            <DepthOfField
              focusDistance={0.0}
              focalLength={0.03}
              bokehScale={10}
              height={720}
            />
            <Bloom
              intensity={0.03}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.9}
            />
            <Noise opacity={0.01} />
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Premium header */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 md:top-6 z-10 transition-all duration-500 w-[calc(100%-2rem)] md:w-auto max-w-md md:max-w-none">
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 p-3 md:p-6 rounded-xl border border-white/10 shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all duration-300 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2 tracking-tight" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
            Coit Cache
          </h1>
          <p className="text-blue-100/90 text-xs md:text-sm font-medium tracking-wide md:max-w-xs" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.2)' }}>
            A pocket-sized Coit Tower. Store your keepsakes in a San Francisco icon.
          </p>
        </div>
      </div>

      <LoadingSpinner />

      <Suspense fallback={null}>
        <CTABox />
      </Suspense>

      <ProductGallery rainEnabled={rainEnabled} toggleRain={toggleRain} />

      <div className="hidden md:block absolute top-4 right-4 md:top-6 md:right-6 z-10">
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 px-3 py-2 rounded-xl border border-white/10 shadow-lg">
          <p className="text-xs text-white/70 font-medium">Drag to explore</p>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-10">
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 px-2 py-1 rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/15">
          <div className="flex items-center gap-1 text-[10px] text-white/50">
            <span>🔒</span>
            <span>Powered by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
}