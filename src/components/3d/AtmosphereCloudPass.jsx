import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneState } from '../../animations/gsapTimeline';

export default function AtmosphereCloudPass() {
  const groupRef = useRef();
  const mistRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;

    const opacity = sceneState.cloudPassOpacity || 0;
    if (opacity < 0.01) {
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.visible = true;

    if (mistRef.current) {
      mistRef.current.material.opacity = opacity;
      mistRef.current.rotation.z = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 1.2]} visible={false}>
      {/* Frontal Atmospheric Mist Screen for entering atmosphere */}
      <mesh ref={mistRef}>
        <planeGeometry args={[14, 10]} />
        <meshBasicMaterial
          color="#9fc7e8"
          transparent={true}
          opacity={0}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Layered Cloud Wisps */}
      {[-1.5, 0, 1.5].map((x, i) => (
        <mesh key={i} position={[x, (i - 1) * 0.4, -0.5]}>
          <planeGeometry args={[5, 3]} />
          <meshBasicMaterial
            color="#f1f5f9"
            transparent={true}
            opacity={0.35}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
