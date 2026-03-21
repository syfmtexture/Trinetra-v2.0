'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  data: number[]; // array of confidences (e.g. 0 to 1)
  shatterIndex?: number;
}

export default function Rotatable3DBarChart({ data, shatterIndex }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create an array of mock data if not provided
  const chartData = data.length > 0 ? data : Array.from({ length: 20 }, () => Math.random());

  const bars = useMemo(() => {
    return chartData.map((val, idx) => {
      const height = val * 5; 
      const isShatter = shatterIndex === idx;
      const xPos = (idx - chartData.length / 2) * 0.4;
      
      // Color logic: >= 0.5 is red (fake), < 0.5 is green (real). Shatter is amber.
      const color = isShatter ? '#FFA657' : (val >= 0.5 ? '#F85149' : '#D2FF00');
      
      return (
        <group key={idx} position={[xPos, height / 2 - 2, 0]}>
          <mesh>
            <boxGeometry args={[0.3, height, 0.3]} />
            <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
          </mesh>
          {isShatter && (
            <Text
              position={[0, height / 2 + 0.5, 0]}
              color="#FFA657"
              fontSize={0.3}
              anchorX="center"
              anchorY="middle"
            >
              SHATTER
            </Text>
          )}
        </group>
      );
    });
  }, [chartData, shatterIndex]);

  useFrame(() => {
    if (groupRef.current) {
      // Gentle auto-rotation
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <>
      <OrbitControls makeDefault enableZoom={true} enablePan={false} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      
      <group ref={groupRef}>
        <gridHelper args={[20, 20, '#444', '#222']} position={[0, -2, 0]} />
        {bars}
      </group>
    </>
  );
}
