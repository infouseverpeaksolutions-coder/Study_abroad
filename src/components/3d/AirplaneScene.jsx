import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import Clouds from './Clouds';
import { sceneState } from '../../animations/gsapTimeline';

useGLTF.preload('/assets/3d/airplane/airplane.glb');

// Dynamic daytime summer sky backdrop matching media_1790937424060.png
function SkyBackdrop({ visible, opacity = 1 }) {
  const meshRef = useRef();

  const skyTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // High-altitude atmospheric sky gradient (Zenith deep sapphire to horizon brilliant cyan/white)
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0.0, '#0369a1'); // Deep sapphire blue
    grad.addColorStop(0.35, '#0284c7'); // Radiant sky blue
    grad.addColorStop(0.70, '#38bdf8'); // Brilliant cerulean
    grad.addColorStop(0.92, '#bae6fd'); // Sunlit atmospheric haze
    grad.addColorStop(1.0, '#f0f9ff'); // Horizon white cloud rim

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle sun flare in upper right
    const sunGrad = ctx.createRadialGradient(380, 80, 10, 380, 80, 240);
    sunGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.45)');
    sunGrad.addColorStop(0.4, 'rgba(224, 242, 254, 0.2)');
    sunGrad.addColorStop(1.0, 'rgba(224, 242, 254, 0)');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, 512, 512);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.material.opacity = opacity;
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={meshRef} position={[2, 3, -20]}>
      <planeGeometry args={[75, 48]} />
      <meshBasicMaterial
        map={skyTexture}
        transparent={true}
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function AirplaneScene({ planeRef }) {
  const { scene } = useGLTF('/assets/3d/airplane/airplane.glb');
  const cloudsGroupRef = useRef();
  const airplaneModel = useMemo(() => scene.clone(), [scene]);

  useFrame((state, delta) => {
    if (!planeRef.current) return;

    const visibility = sceneState.planeVisible;

    if (visibility < 0.005) {
      planeRef.current.visible = false;
      if (cloudsGroupRef.current) cloudsGroupRef.current.visible = false;
      return;
    }

    planeRef.current.visible = true;
    if (cloudsGroupRef.current) {
      cloudsGroupRef.current.visible = sceneState.cloudsOpacity > 0.01;
    }

    // Smooth opacity fade on all airplane materials during transition
    if (visibility < 0.99) {
      planeRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = visibility;
        }
      });
    } else {
      planeRef.current.traverse((child) => {
        if (child.isMesh && child.material && child.material.opacity < 0.99) {
          child.material.transparent = false;
          child.material.opacity = 1;
        }
      });
    }

    // Direct synchronous mutation driven by GSAP timeline
    planeRef.current.position.set(
      sceneState.planePos.x,
      sceneState.planePos.y,
      sceneState.planePos.z
    );

    // Realistic banking and pitch with subtle flight micro-turbulence
    const t = state.clock.elapsedTime;
    const microPitch = Math.sin(t * 2.2) * 0.008;
    const microRoll = Math.cos(t * 1.8) * 0.006;

    planeRef.current.rotation.order = 'YXZ';
    planeRef.current.rotation.set(
      sceneState.planeRot.pitch + microPitch,
      sceneState.planeRot.yaw,
      sceneState.planeRot.roll + microRoll
    );

    // Continuous cloud movement beneath cruising airliner
    if (cloudsGroupRef.current && sceneState.cloudsOpacity > 0.01) {
      cloudsGroupRef.current.children.forEach((c) => {
        c.position.z += 0.045;
        if (c.position.z > 14) c.position.z = -18;
      });
    }
  });

  const isFlightActive = sceneState.planeVisible > 0.005;

  return (
    <group>
      {/* 1. Brilliant Summer Stratosphere Sky Backdrop matching reference image */}
      <SkyBackdrop visible={isFlightActive} opacity={Math.min(1, sceneState.planeVisible * 1.5)} />

      {/* Global Flight Atmosphere & Sunlight */}
      {isFlightActive && (
        <group>
          <directionalLight position={[12, 16, 10]} intensity={3.6} color="#fff8ee" />
          <ambientLight intensity={1.1} color="#bae6fd" />
          <directionalLight position={[-4, -8, 2]} intensity={0.8} color="#e0f2fe" />
        </group>
      )}

      {/* 2. Realistic Boeing 787 Commercial Airliner (Matching media_1790937424060.png) */}
      <group ref={planeRef} scale={0.78}>
        <primitive object={airplaneModel} />
      </group>

      {/* 3. Soft Puffy Sunlit Cumulus Clouds Carpet */}
      <Clouds cloudsRef={cloudsGroupRef} opacity={sceneState.cloudsOpacity} />
    </group>
  );
}
