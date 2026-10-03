import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { sceneState } from '../../animations/gsapTimeline';

useGLTF.preload('/assets/3d/university/lobby.glb');

export default function LobbyScene({ lobbyRef }) {
  const { scene } = useGLTF('/assets/3d/university/lobby.glb');
  const lobbyModel = useMemo(() => scene.clone(), [scene]);

  useFrame(() => {
    if (!lobbyRef.current) return;

    if (sceneState.lobbyVisible < 0.005) {
      lobbyRef.current.visible = false;
      return;
    }

    lobbyRef.current.visible = true;
    lobbyRef.current.position.set(
      sceneState.lobbyPos.x,
      sceneState.lobbyPos.y,
      sceneState.lobbyPos.z
    );

    const opacity = Math.min(1, sceneState.lobbyVisible * 1.5);
    if (opacity < 0.99) {
      lobbyRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = opacity;
        }
      });
    } else {
      lobbyRef.current.traverse((child) => {
        if (child.isMesh && child.material && child.material.opacity < 0.99) {
          child.material.transparent = false;
          child.material.opacity = 1;
        }
      });
    }
  });

  return (
    <group ref={lobbyRef} position={[0, -25, 0]}>
      <primitive object={lobbyModel} />
      {/* Atrium Architectural Lighting */}
      <pointLight position={[0, 4.2, -1.8]} intensity={1.8} color="#fffbeb" distance={16} />
      <pointLight position={[5.2, 3.0, -1.0]} intensity={1.2} color="#bae6fd" distance={12} />
      <pointLight position={[-4.5, 2.5, 1.8]} intensity={1.0} color="#fef08a" distance={10} />
    </group>
  );
}
