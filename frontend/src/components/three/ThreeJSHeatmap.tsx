'use client';

import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  resolution?: number;
  gradcamBase64?: string;
}

/**
 * Decode a base64 image into pixel intensity data (0..1 per pixel).
 * Uses a hidden canvas to read the image data.
 * Returns a 2D grid of intensities (red channel = manipulation heat).
 */
function useGradcamData(gradcamBase64: string | undefined, gridSize: number) {
  const [heightGrid, setHeightGrid] = useState<Float32Array | null>(null);

  useEffect(() => {
    if (!gradcamBase64) {
      setHeightGrid(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = gridSize;
      canvas.height = gridSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw the gradcam image scaled to our grid resolution
      ctx.drawImage(img, 0, 0, gridSize, gridSize);
      const imageData = ctx.getImageData(0, 0, gridSize, gridSize);
      const pixels = imageData.data; // RGBA flat array

      const grid = new Float32Array(gridSize * gridSize);
      for (let i = 0; i < gridSize * gridSize; i++) {
        const r = pixels[i * 4] / 255;     // Red channel
        const g = pixels[i * 4 + 1] / 255; // Green channel  
        const b = pixels[i * 4 + 2] / 255; // Blue channel
        // Compute "heat" from the Grad-CAM: red/warm = high, blue/dark = low
        // Luminance-weighted with red bias since Grad-CAM uses JET colormap
        grid[i] = r * 0.6 + g * 0.25 + b * 0.15;
      }
      setHeightGrid(grid);
    };

    const src = gradcamBase64.startsWith('data:image')
      ? gradcamBase64
      : `data:image/png;base64,${gradcamBase64}`;
    img.src = src;
  }, [gradcamBase64, gridSize]);

  return heightGrid;
}

/**
 * Green → Yellow → Red based on normalized intensity
 */
function heatColor(t: number): [number, number, number] {
  if (t < 0.45) {
    // Green → Yellow-Green
    const s = t / 0.45;
    return [0.1 + s * 0.9, 0.8, 0.15];
  } else if (t < 0.7) {
    // Yellow → Orange
    const s = (t - 0.45) / 0.25;
    return [1.0, 0.8 - s * 0.4, 0.1];
  } else {
    // Orange → Red
    const s = (t - 0.7) / 0.3;
    return [1.0, 0.4 - s * 0.35, 0.1 - s * 0.05];
  }
}

function HeatmapMesh({ gradcamBase64, resolution }: { gradcamBase64?: string, resolution: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const realHeights = useGradcamData(gradcamBase64, resolution);

  // Fallback procedural data when no backend image is available
  const fallbackData = useMemo(() => {
    const arr = new Float32Array(resolution * resolution);
    const half = resolution / 2;
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const dx = i - half, dy = j - half;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const base = Math.max(0, half - dist) / half;
        arr[i * resolution + j] = base * base * 2.5 + Math.random() * 0.15 * base;
      }
    }
    return arr;
  }, [resolution]);

  // Use real data from Grad-CAM if available, else fallback
  const heightData = realHeights || fallbackData;

  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(10, 10, resolution - 1, resolution - 1);
    const pos = geom.attributes.position.array as Float32Array;
    const count = geom.attributes.position.count;
    const colors = new Float32Array(count * 3);

    // Normalize height data
    let maxH = 0;
    for (let i = 0; i < heightData.length; i++) {
      if (heightData[i] > maxH) maxH = heightData[i];
    }
    const scale = maxH > 0 ? 1 / maxH : 1;

    // Apply heights and colors
    for (let i = 0; i < count && i < heightData.length; i++) {
      const normalized = heightData[i] * scale; // 0..1
      pos[i * 3 + 2] = normalized * 3.5;       // Z displacement

      const [r, g, b] = heatColor(normalized);
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geom.computeVertexNormals();
    return geom;
  }, [heightData, resolution]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.003;
    }
  });

  return (
    <Center>
      <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]} geometry={geometry}>
        <meshStandardMaterial
          vertexColors={true}
          roughness={0.55}
          metalness={0.05}
          side={THREE.DoubleSide}
          flatShading={true}
        />
      </mesh>
    </Center>
  );
}

export default function ThreeJSHeatmap(props: Props) {
  return (
    <>
      <OrbitControls makeDefault enableZoom={true} enablePan={true} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 10, 7]} intensity={1.5} color="#FFFFFF" />
      <directionalLight position={[-5, -5, 5]} intensity={0.5} color="#FFFFFF" />

      <Suspense fallback={null}>
        <HeatmapMesh
          gradcamBase64={props.gradcamBase64}
          resolution={props.resolution || 50}
        />
      </Suspense>
    </>
  );
}
