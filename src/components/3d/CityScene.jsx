import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { sceneState } from '../../animations/gsapTimeline';

useGLTF.preload('/assets/3d/future/future_skyline.glb');

export default function CityScene({ cityRef }) {
  const { scene } = useGLTF('/assets/3d/future/future_skyline.glb');
  const cityModel = useMemo(() => scene.clone(), [scene]);

  useFrame((_, delta) => {
    if (!cityRef.current) return;

    if (sceneState.cityVisible < 0.005) {
      cityRef.current.visible = false;
      return;
    }

    cityRef.current.visible = true;

    // Delta-aware exponential smoothing
    const speed = 6;
    const t = 1 - Math.exp(-speed * delta);
    cityRef.current.position.x += (sceneState.cityPos.x - cityRef.current.position.x) * t;
    cityRef.current.position.y += (sceneState.cityPos.y - cityRef.current.position.y) * t;
    cityRef.current.position.z += (sceneState.cityPos.z - cityRef.current.position.z) * t;

    if (sceneState.cityScale !== undefined) {
      const curS = cityRef.current.scale.x;
      const targetS = sceneState.cityScale;
      const ns = curS + (targetS - curS) * t;
      cityRef.current.scale.set(ns, ns, ns);
    }

    // Smooth material opacity crossfade
    const opacity = Math.min(1, sceneState.cityVisible * 1.5);
    if (opacity < 0.99) {
      cityRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = opacity;
        }
      });
    } else {
      cityRef.current.traverse((child) => {
        if (child.isMesh && child.material && child.material.opacity < 0.99) {
          child.material.transparent = false;
          child.material.opacity = 1;
        }
      });
    }
  });

  return (
    <group ref={cityRef} position={[0, -15, 0]}>
      <primitive object={cityModel} />
    </group>
  );
}
