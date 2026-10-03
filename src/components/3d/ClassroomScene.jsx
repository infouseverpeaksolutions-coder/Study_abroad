import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { sceneState } from '../../animations/gsapTimeline';

useGLTF.preload('/assets/3d/university/classroom.glb');

export default function ClassroomScene({ classroomRef }) {
  const { scene } = useGLTF('/assets/3d/university/classroom.glb');
  const classroomModel = useMemo(() => scene.clone(), [scene]);

  useFrame(() => {
    if (!classroomRef.current) return;

    if (sceneState.classroomVisible < 0.005) {
      classroomRef.current.visible = false;
      return;
    }

    classroomRef.current.visible = true;
    classroomRef.current.position.set(
      sceneState.classroomPos.x,
      sceneState.classroomPos.y,
      sceneState.classroomPos.z
    );

    const opacity = Math.min(1, sceneState.classroomVisible * 1.5);
    if (opacity < 0.99) {
      classroomRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = opacity;
        }
      });
    } else {
      classroomRef.current.traverse((child) => {
        if (child.isMesh && child.material && child.material.opacity < 0.99) {
          child.material.transparent = false;
          child.material.opacity = 1;
        }
      });
    }
  });

  return (
    <group ref={classroomRef} position={[0, -35, 0]}>
      <primitive object={classroomModel} />
      {/* Clean, natural academic morning daylight streaming from left windows */}
      <directionalLight position={[-8, 6, 1]} intensity={2.0} color="#fffbf0" />
      {/* Interactive 85" Screen Glow */}
      <pointLight position={[1.2, 2.4, -5.8]} intensity={1.6} color="#38bdf8" distance={10} />
      {/* Soft Balanced Lecture Room Fill */}
      <ambientLight intensity={0.7} color="#f8fafc" />
    </group>
  );
}
