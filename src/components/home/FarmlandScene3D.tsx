import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 1. Farmland Terrain with subtle rolling waves
const RollingFarmland: React.FC<{ mousePos: React.MutableRefObject<[number, number]> }> = ({ mousePos }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const rowsRef = useRef<THREE.Group>(null);

  // Generate terrain geometry
  const { geometry } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(36, 36, 48, 48);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Create rolling hills and furrowed crop waves
      const z =
        Math.sin(x * 0.25) * 0.8 +
        Math.cos(y * 0.3) * 0.6 +
        Math.sin(x * 1.2 + y * 0.8) * 0.15;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return { geometry: geo };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle subtle breathing wave
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.z = Math.sin(time * 0.05) * 0.02;
    }
    if (rowsRef.current) {
      // Gentle mouse parallax
      rowsRef.current.rotation.y = THREE.MathUtils.lerp(
        rowsRef.current.rotation.y,
        mousePos.current[0] * 0.08,
        0.05
      );
      rowsRef.current.rotation.x = THREE.MathUtils.lerp(
        rowsRef.current.rotation.x,
        -Math.PI / 3 + mousePos.current[1] * 0.05,
        0.05
      );
    }
  });

  return (
    <group ref={rowsRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -2.5, -4]}>
      {/* Base rich soil & lush crop terrain */}
      <mesh ref={meshRef} geometry={geometry} receiveShadow>
        <meshStandardMaterial
          color="#164A38"
          roughness={0.8}
          metalness={0.1}
          flatShading={false}
        />
      </mesh>

      {/* Farmland furrow lines / golden harvest crops */}
      {Array.from({ length: 9 }).map((_, idx) => {
        const offset = (idx - 4) * 2.8;
        return (
          <mesh
            key={idx}
            position={[offset, 0, 0.2]}
            rotation={[0, 0, 0]}
          >
            <cylinderGeometry args={[0.08, 0.08, 30, 8]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#C99A2E' : '#2E7D32'}
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// 2. Floating Golden Wheat Spikes
const FloatingWheatGroup: React.FC = () => {
  const wheatCount = 18;
  const items = useMemo(() => {
    return Array.from({ length: wheatCount }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 16,
        -1.5 + Math.random() * 4.5,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      rotation: [
        (Math.random() - 0.5) * 0.4,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.4,
      ] as [number, number, number],
      scale: 0.7 + Math.random() * 0.6,
      speed: 0.6 + Math.random() * 0.8,
    }));
  }, []);

  return (
    <group>
      {items.map((item, idx) => (
        <Float
          key={idx}
          speed={item.speed}
          rotationIntensity={0.6}
          floatIntensity={0.8}
          position={item.position}
        >
          <group scale={item.scale} rotation={item.rotation}>
            {/* Stalk stem */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.03, 2.2, 8]} />
              <meshStandardMaterial color="#DFB14E" roughness={0.5} metalness={0.2} />
            </mesh>
            {/* Grains cluster */}
            {Array.from({ length: 6 }).map((_, gIdx) => (
              <mesh key={gIdx} position={[0, 0.4 + gIdx * 0.22, 0]} rotation={[0, (gIdx * Math.PI) / 3, 0.2]}>
                <sphereGeometry args={[0.07, 8, 8]} />
                <meshStandardMaterial color="#C99A2E" roughness={0.4} metalness={0.3} />
              </mesh>
            ))}
          </group>
        </Float>
      ))}
    </group>
  );
};

// 3. Floating Green Organic Leaves
const FloatingLeaves: React.FC = () => {
  const leavesCount = 20;
  const leaves = useMemo(() => {
    return Array.from({ length: leavesCount }).map(() => ({
      position: [
        (Math.random() - 0.5) * 18,
        -1 + Math.random() * 6,
        (Math.random() - 0.5) * 12,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      scale: 0.4 + Math.random() * 0.5,
      speed: 0.8 + Math.random() * 1.2,
    }));
  }, []);

  return (
    <group>
      {leaves.map((leaf, idx) => (
        <Float
          key={idx}
          speed={leaf.speed}
          rotationIntensity={1.2}
          floatIntensity={1.0}
          position={leaf.position}
        >
          <mesh rotation={leaf.rotation} scale={leaf.scale}>
            {/* Curved organic leaf shape */}
            <coneGeometry args={[0.2, 0.8, 5]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#43A047' : '#2E7D32'}
              roughness={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// 4. Central Radiant Grace Cross & Aura
const GraceMonument: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = 0.6 + Math.sin(t * 0.8) * 0.12;
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.6, -1]}>
      {/* Radiant Sun Halo behind */}
      <mesh position={[0, 0.4, -0.2]}>
        <ringGeometry args={[0.9, 1.4, 32]} />
        <meshBasicMaterial color="#FFDF78" side={THREE.DoubleSide} transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0.4, -0.25]}>
        <circleGeometry args={[0.9, 32]} />
        <meshBasicMaterial color="#FFE699" side={THREE.DoubleSide} transparent opacity={0.25} />
      </mesh>

      {/* Main Cross Vertical Beam */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.24, 2.2, 0.24]} />
        <meshStandardMaterial color="#8E5E24" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Cross Horizontal Beam */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[1.4, 0.24, 0.24]} />
        <meshStandardMaterial color="#8E5E24" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Gold Inlay Trim */}
      <mesh position={[0, 0.4, 0.13]}>
        <boxGeometry args={[0.08, 2.1, 0.02]} />
        <meshBasicMaterial color="#FFDF78" />
      </mesh>
      <mesh position={[0, 0.85, 0.13]}>
        <boxGeometry args={[1.3, 0.08, 0.02]} />
        <meshBasicMaterial color="#FFDF78" />
      </mesh>

      {/* Central Radiance Point */}
      <pointLight color="#FFF3D1" intensity={2.5} distance={8} decay={2} position={[0, 0.85, 0.5]} />
    </group>
  );
};

// Main 3D Farmland Hero Component
export const FarmlandScene3D: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const mousePos = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mousePos.current = [
      (clientX / innerWidth) * 2 - 1,
      -(clientY / innerHeight) * 2 + 1,
    ];
  };

  // Fallback for non-WebGL devices or low-power modes
  if (!hasWebGL) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B3D2E]/20 via-[#063B2D]/40 to-[#0B3D2E]/90 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-[#C99A2E]/15 blur-3xl" />
      </div>
    );
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="absolute inset-0 w-full h-full pointer-events-auto overflow-hidden"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 1.2, 5.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        className="w-full h-full"
      >
        {/* Soft atmospheric lighting */}
        <ambientLight intensity={0.9} color="#FFF8E7" />
        {/* Golden Sun Directional Light */}
        <directionalLight
          position={[6, 8, 5]}
          intensity={1.8}
          color="#FFE9A0"
          castShadow
        />
        <directionalLight
          position={[-6, 4, 3]}
          intensity={0.7}
          color="#A8D5BA"
        />

        {/* 3D Scene Elements */}
        <RollingFarmland mousePos={mousePos} />
        <GraceMonument />
        <FloatingWheatGroup />
        <FloatingLeaves />

        {/* Floating Sunlit Harvest Dust / Spores */}
        <Sparkles
          count={70}
          scale={14}
          size={3}
          speed={0.4}
          color="#FFDF78"
          opacity={0.7}
        />
        <Sparkles
          count={35}
          scale={10}
          size={2.5}
          speed={0.3}
          color="#A5D6A7"
          opacity={0.6}
        />

        {/* Soft Orbit Controls with locked limits */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 3}
          maxAzimuthAngle={Math.PI / 12}
          minAzimuthAngle={-Math.PI / 12}
          rotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
};
