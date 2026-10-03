import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

import EarthScene from './EarthScene';
import AirplaneScene from './AirplaneScene';
import AtmosphereCloudPass from './AtmosphereCloudPass';
import CityScene from './CityScene';
import CampusScene from './CampusScene';
import EntranceScene from './EntranceScene';
import LobbyScene from './LobbyScene';
import CorridorScene from './CorridorScene';
import ClassroomScene from './ClassroomScene';
import EnvironmentLighting from './EnvironmentLighting';
import { sceneState } from '../../animations/gsapTimeline';
import { useDevicePerformance } from '../../hooks/useDevicePerformance';

// Cinematic Camera Controller: delta-aware exponential smoothing for buttery 60fps tracking
function CameraController() {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0.3, 0, 0));

  useFrame((_, delta) => {
    const { camPos, camTarget, camFov } = sceneState;

    // Delta-aware exponential smoothing: identical feel at any framerate
    // Lower speed = silkier motion (6 = ~83ms half-life)
    const speed = 6;
    const t = 1 - Math.exp(-speed * delta);

    camera.position.x += (camPos.x - camera.position.x) * t;
    camera.position.y += (camPos.y - camera.position.y) * t;
    camera.position.z += (camPos.z - camera.position.z) * t;

    currentTarget.current.x += (camTarget.x - currentTarget.current.x) * t;
    currentTarget.current.y += (camTarget.y - currentTarget.current.y) * t;
    currentTarget.current.z += (camTarget.z - currentTarget.current.z) * t;

    camera.lookAt(currentTarget.current);

    if (camFov && Math.abs(camera.fov - camFov) > 0.05) {
      camera.fov += (camFov - camera.fov) * t * 0.5;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

export default function SceneCanvas({ isVisible = true }) {
  const earthRef = useRef();
  const planeRef = useRef();
  const cityRef = useRef();
  const campusRef = useRef();
  const entranceRef = useRef();
  const lobbyRef = useRef();
  const corridorRef = useRef();
  const classroomRef = useRef();

  const { dpr, maxParticles, isMobile } = useDevicePerformance();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-navy-950">
      <Canvas
        camera={{ position: [0, 0.2, 5.2], fov: 45, near: 0.1, far: 200 }}
        dpr={[1, Math.min(2, dpr)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <CameraController />
        <EnvironmentLighting />

        {/* Subtle, sparse deep-space star field */}
        <Stars
          radius={90}
          depth={50}
          count={Math.min(480, maxParticles)}
          factor={2.2}
          saturation={0.15}
          fade={true}
          speed={0.1}
        />

        {/* Continuous Cinematic Journey: Space → Earth → Flight → Campus → Classroom */}
        <Suspense fallback={null}>
          <EarthScene earthRef={earthRef} isMobile={isMobile} />
          <AirplaneScene planeRef={planeRef} />
          <AtmosphereCloudPass />
          <CityScene cityRef={cityRef} />
          <CampusScene campusRef={campusRef} />
          <EntranceScene entranceRef={entranceRef} />
          <LobbyScene lobbyRef={lobbyRef} />
          <CorridorScene corridorRef={corridorRef} />
          <ClassroomScene classroomRef={classroomRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
