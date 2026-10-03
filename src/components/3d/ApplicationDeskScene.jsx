import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { sceneState } from '../../animations/gsapTimeline';

useGLTF.preload('/assets/3d/desk/application_desk.glb');

export default function ApplicationDeskScene({ deskRef }) {
  const { scene } = useGLTF('/assets/3d/desk/application_desk.glb');
  const deskModel = useMemo(() => scene.clone(), [scene]);

  useFrame(() => {
    if (!deskRef.current) return;

    if (sceneState.deskVisible < 0.01) {
      deskRef.current.visible = false;
      return;
    }

    deskRef.current.visible = true;

    deskRef.current.position.x = THREE.MathUtils.lerp(deskRef.current.position.x, sceneState.deskPos.x, 0.1);
    deskRef.current.position.y = THREE.MathUtils.lerp(deskRef.current.position.y, sceneState.deskPos.y, 0.1);
    deskRef.current.position.z = THREE.MathUtils.lerp(deskRef.current.position.z, sceneState.deskPos.z, 0.1);

    if (sceneState.deskRotY !== undefined) {
      deskRef.current.rotation.y = THREE.MathUtils.lerp(deskRef.current.rotation.y, sceneState.deskRotY, 0.08);
    }
  });

  return (
    <group ref={deskRef} position={[0, -10, 0]}>
      <primitive object={deskModel} />
    </group>
  );
}
