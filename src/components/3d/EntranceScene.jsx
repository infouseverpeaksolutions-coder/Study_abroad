import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { sceneState } from '../../animations/gsapTimeline';

useGLTF.preload('/assets/3d/university/university-entrance.glb');

export default function EntranceScene({ entranceRef }) {
  const { scene } = useGLTF('/assets/3d/university/university-entrance.glb');
  const entranceModel = useMemo(() => scene.clone(), [scene]);

  useFrame(() => {
    if (!entranceRef.current) return;

    if (sceneState.entranceVisible < 0.005) {
      entranceRef.current.visible = false;
      return;
    }

    entranceRef.current.visible = true;
    entranceRef.current.position.set(
      sceneState.entrancePos.x,
      sceneState.entrancePos.y,
      sceneState.entrancePos.z
    );

    const opacity = Math.min(1, sceneState.entranceVisible * 1.5);
    if (opacity < 0.99) {
      entranceRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = opacity;
        }
      });
    } else {
      entranceRef.current.traverse((child) => {
        if (child.isMesh && child.material && child.material.opacity < 0.99) {
          child.material.transparent = false;
          child.material.opacity = 1;
        }
      });
    }
  });

  return (
    <group ref={entranceRef} position={[0, -20, 0]}>
      <primitive object={entranceModel} />
    </group>
  );
}
