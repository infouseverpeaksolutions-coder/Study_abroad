import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { sceneState } from '../../animations/gsapTimeline';

useGLTF.preload('/assets/3d/lookout/lookout_student.glb');

export default function AmbitionScene({ lookoutRef }) {
  const { scene } = useGLTF('/assets/3d/lookout/lookout_student.glb');
  const lookoutModel = useMemo(() => scene.clone(), [scene]);

  useFrame(() => {
    if (!lookoutRef.current) return;

    if (sceneState.lookoutVisible < 0.01) {
      lookoutRef.current.visible = false;
      return;
    }

    lookoutRef.current.visible = true;

    lookoutRef.current.position.x = THREE.MathUtils.lerp(lookoutRef.current.position.x, sceneState.lookoutPos.x, 0.1);
    lookoutRef.current.position.y = THREE.MathUtils.lerp(lookoutRef.current.position.y, sceneState.lookoutPos.y, 0.1);
    lookoutRef.current.position.z = THREE.MathUtils.lerp(lookoutRef.current.position.z, sceneState.lookoutPos.z, 0.1);

    if (sceneState.lookoutRotY !== undefined) {
      lookoutRef.current.rotation.y = THREE.MathUtils.lerp(lookoutRef.current.rotation.y, sceneState.lookoutRotY, 0.08);
    }
  });

  return (
    <group ref={lookoutRef} position={[0, 0, 0]}>
      <primitive object={lookoutModel} />
    </group>
  );
}
