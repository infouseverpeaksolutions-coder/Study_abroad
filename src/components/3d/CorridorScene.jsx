import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { sceneState } from '../../animations/gsapTimeline';

useGLTF.preload('/assets/3d/university/corridor.glb');

export default function CorridorScene({ corridorRef }) {
  const { scene } = useGLTF('/assets/3d/university/corridor.glb');
  const corridorModel = useMemo(() => scene.clone(), [scene]);

  useFrame(() => {
    if (!corridorRef.current) return;

    if (sceneState.corridorVisible < 0.005) {
      corridorRef.current.visible = false;
      return;
    }

    corridorRef.current.visible = true;
    corridorRef.current.position.set(
      sceneState.corridorPos.x,
      sceneState.corridorPos.y,
      sceneState.corridorPos.z
    );

    const opacity = Math.min(1, sceneState.corridorVisible * 1.5);
    if (opacity < 0.99) {
      corridorRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = opacity;
        }
      });
    } else {
      corridorRef.current.traverse((child) => {
        if (child.isMesh && child.material && child.material.opacity < 0.99) {
          child.material.transparent = false;
          child.material.opacity = 1;
        }
      });
    }
  });

  return (
    <group ref={corridorRef} position={[0, -30, 0]}>
      <primitive object={corridorModel} />
      {/* Corridor Downlights & Door 204 Focus Light */}
      <pointLight position={[0, 3.4, 2.0]} intensity={1.4} color="#fffbeb" distance={14} />
      <pointLight position={[0, 3.4, -6.0]} intensity={1.4} color="#fffbeb" distance={14} />
      <pointLight position={[1.8, 1.8, -7.0]} intensity={2.2} color="#fef08a" distance={6} />
      <pointLight position={[0, 2.0, -12.5]} intensity={2.0} color="#bae6fd" distance={8} />
    </group>
  );
}
