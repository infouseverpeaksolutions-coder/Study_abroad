import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DESTINATIONS, latLonToVector3 } from '../../data/destinationsData';

export default function DestinationMarkers({ earthRef, activeIndex, glowIntensity = 1 }) {
  const RADIUS = 2.0;
  const pulsesRef = useRef([]);
  const rippleRingRef = useRef();

  // Geographic destination pins
  const markers = useMemo(() => {
    return DESTINATIONS.map((dest) => {
      const pos = latLonToVector3(dest.lat, dest.lon, RADIUS + 0.02);
      const normal = pos.clone().normalize();
      return { ...dest, pos, normal };
    });
  }, []);

  // WebGL Data Globe intercontinental connection arcs (matching webgl-data-globe.vercel.app)
  const flightCurves = useMemo(() => {
    const pairs = [
      [0, 1], // UK to Canada
      [0, 3], // UK to USA
      [0, 4], // UK to Germany
      [1, 3], // Canada to USA
      [4, 2], // Germany to Australia
      [2, 5], // Australia to New Zealand
    ];

    return pairs.map(([idxA, idxB], i) => {
      const vA = markers[idxA].pos;
      const vB = markers[idxB].pos;
      const mid = vA.clone().add(vB).multiplyScalar(0.5);
      const dist = vA.distanceTo(vB);
      mid.normalize().multiplyScalar(RADIUS + Math.min(0.85, dist * 0.38));

      const curve = new THREE.QuadraticBezierCurve3(vA, mid, vB);
      const points = curve.getPoints(40);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return { curve, geometry, id: `arc-${i}`, offset: (i * 0.18) % 1.0 };
    });
  }, [markers]);

  // Traveling data pulses & concentric ripple animation
  useFrame((state) => {
    if (glowIntensity < 0.02) return;
    const time = state.clock.getElapsedTime();

    // Animate traveling optical light pulses along each curve
    flightCurves.forEach((item, i) => {
      const mesh = pulsesRef.current[i];
      if (mesh) {
        const progress = (time * 0.28 + item.offset) % 1.0;
        const pt = item.curve.getPointAt(progress);
        mesh.position.copy(pt);
      }
    });

    // Animate concentric pulse ring on active marker
    if (rippleRingRef.current) {
      const scale = 1.0 + (time * 1.5 % 1.5) * 0.9;
      rippleRingRef.current.scale.set(scale, scale, 1);
      if (rippleRingRef.current.material) {
        rippleRingRef.current.material.opacity = Math.max(0, 0.8 - (scale - 1.0) * 0.7) * glowIntensity;
      }
    }
  });

  if (glowIntensity < 0.02) return null;

  const activeMarker = markers[activeIndex] || markers[0];

  return (
    <group>
      {/* 1. Concentric Animated Ripple Ring on Active Marker */}
      <group position={activeMarker.pos} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), activeMarker.normal)}>
        <mesh ref={rippleRingRef}>
          <ringGeometry args={[0.045, 0.09, 32]} />
          <meshBasicMaterial
            color="#65D9E8"
            transparent={true}
            opacity={0.8}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 2. Destination Node Beacons */}
      {markers.map((m, idx) => {
        const isActive = activeIndex === idx;
        return (
          <group key={m.id} position={m.pos}>
            {/* Core Beacon Sphere */}
            <mesh>
              <sphereGeometry args={[isActive ? 0.038 : 0.024, 16, 16]} />
              <meshBasicMaterial
                color={isActive ? '#65D9E8' : '#93C5FD'}
                transparent={true}
                opacity={Math.min(1.0, glowIntensity * (isActive ? 1.0 : 0.7))}
              />
            </mesh>

            {/* Static Halo Ring */}
            <mesh>
              <ringGeometry args={[0.042, isActive ? 0.08 : 0.055, 24]} />
              <meshBasicMaterial
                color={isActive ? '#65D9E8' : '#6EA8FF'}
                transparent={true}
                opacity={Math.min(0.8, glowIntensity * (isActive ? 0.6 : 0.25))}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}

      {/* 3. Glowing Data Flight Arcs */}
      {flightCurves.map((item) => (
        <line key={item.id} geometry={item.geometry}>
          <lineBasicMaterial
            color="#7EC8D8"
            transparent={true}
            opacity={glowIntensity * 0.45}
            linewidth={1.2}
          />
        </line>
      ))}

      {/* 4. Traveling Optical Pulse Packets (Data Globe feature) */}
      {flightCurves.map((item, i) => (
        <mesh
          key={`pulse-${item.id}`}
          ref={(el) => (pulsesRef.current[i] = el)}
        >
          <sphereGeometry args={[0.026, 12, 12]} />
          <meshBasicMaterial
            color="#FFFFFF"
            transparent={true}
            opacity={glowIntensity * 0.95}
          />
        </mesh>
      ))}
    </group>
  );
}
