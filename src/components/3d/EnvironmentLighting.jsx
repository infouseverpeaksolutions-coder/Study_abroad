import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { sceneState } from '../../animations/gsapTimeline';

export default function EnvironmentLighting() {
  const ambientLightRef = useRef();
  const sunLightRef = useRef();
  const fillLightRef = useRef();

  useFrame(() => {
    const warmth = sceneState.sunWarmth || 0;

    if (ambientLightRef.current) {
      // Space ambient: subtle deep navy; Atmospheric/Campus ambient: rich soft skylight
      ambientLightRef.current.intensity = 0.22 + warmth * 0.45;
      ambientLightRef.current.color.set(warmth > 0.1 ? '#c7d9e8' : '#030814');
    }

    if (sunLightRef.current) {
      // Crisp sunlight in space, warm golden daylight on campus grounds
      sunLightRef.current.intensity = 2.6 + warmth * 0.6;
      sunLightRef.current.color.set(warmth > 0.1 ? '#fff8ee' : '#ffffff');
    }

    if (fillLightRef.current) {
      fillLightRef.current.intensity = 0.6 + warmth * 0.4;
      fillLightRef.current.color.set(warmth > 0.1 ? '#93c5fd' : '#1e3a5f');
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.22} color="#030814" />
      <directionalLight
        ref={sunLightRef}
        position={[7, 3.5, 5]}
        intensity={2.6}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Subtle soft-blue fill on terminator edge */}
      <pointLight ref={fillLightRef} position={[-8, -2, -4]} intensity={0.6} color="#1e3a5f" distance={30} />
    </>
  );
}
