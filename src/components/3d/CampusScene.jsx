import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { sceneState } from '../../animations/gsapTimeline';

useGLTF.preload('/assets/3d/campus/campus.glb');

export default function CampusScene({ campusRef }) {
  const { scene } = useGLTF('/assets/3d/campus/campus.glb');

  // Optimized clone of the GLTF campus model
  const campusModel = useMemo(() => scene.clone(), [scene]);

  useFrame((_, delta) => {
    if (!campusRef.current) return;

    if (sceneState.campusVisible < 0.005) {
      campusRef.current.visible = false;
      return;
    }

    campusRef.current.visible = true;

    // Delta-aware exponential smoothing for buttery motion
    const speed = 6;
    const t = 1 - Math.exp(-speed * delta);
    campusRef.current.position.x += (sceneState.campusPos.x - campusRef.current.position.x) * t;
    campusRef.current.position.y += (sceneState.campusPos.y - campusRef.current.position.y) * t;
    campusRef.current.position.z += (sceneState.campusPos.z - campusRef.current.position.z) * t;

    // Smooth material opacity crossfade
    const opacity = Math.min(1, (sceneState.campusOpacity ?? 1) * Math.min(1, sceneState.campusVisible * 1.5));
    if (opacity < 0.99) {
      campusRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = opacity;
        }
      });
    } else {
      campusRef.current.traverse((child) => {
        if (child.isMesh && child.material && child.material.opacity < 0.99) {
          child.material.transparent = false;
          child.material.opacity = 1;
        }
      });
    }
  });

  return (
    <group ref={campusRef} position={[0, -6, 4]}>
      <primitive object={campusModel} />
    </group>
  );
}
