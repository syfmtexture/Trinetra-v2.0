'use client';

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import LoginForm from '@/components/auth/LoginForm';
import ScannedGrid from '@/components/three/ScannedGrid';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#070709] flex items-center justify-center">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <Environment preset="city" />
          <ScannedGrid />
        </Canvas>
      </div>

      {/* Foreground Content */}
      <LoginForm />
    </div>
  );
}
