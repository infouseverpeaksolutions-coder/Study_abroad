import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { sceneState } from '../../animations/gsapTimeline';

useGLTF.preload('/assets/3d/worldmap/worldmap_landscape.glb');

export default function WorldMapScene({ mapRef }) {
  const { scene } = useGLTF('/assets/3d/worldmap/worldmap_landscape.glb');
  const mapModel = useMemo(() => scene.clone(), [scene]);

  useFrame(() => {
    if (!mapRef.current) return;

    if (sceneState.mapVisible < 0.01) {
      mapRef.current.visible = false;
      return;
    }

    mapRef.current.visible = true;

    mapRef.current.position.x = THREE.MathUtils.lerp(mapRef.current.position.x, sceneState.mapPos.x, 0.1);
    mapRef.current.position.y = THREE.MathUtils.lerp(mapRef.current.position.y, sceneState.mapPos.y, 0.1);
    mapRef.current.position.z = THREE.MathUtils.lerp(mapRef.current.position.z, sceneState.mapPos.z, 0.1);

    if (sceneState.mapRotY !== undefined) {
      mapRef.current.rotation.y = THREE.MathUtils.lerp(mapRef.current.rotation.y, sceneState.mapRotY, 0.08);
    }
    if (sceneState.mapScale !== undefined) {
      const s = THREE.MathUtils.lerp(mapRef.current.scale.x, sceneState.mapScale, 0.08);
      mapRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={mapRef} position={[0, -10, 0]}>
      <primitive object={mapModel} />
    </group>
  );
}
