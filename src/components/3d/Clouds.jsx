import React, { useMemo } from 'react';
import * as THREE from 'three';

export default function Clouds({ cloudsRef, opacity = 0.8 }) {
  // Puffy sunlit cumulus cloud formations matching the cinematic flight image
  const cloudClusters = useMemo(() => {
    const arr = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const clusterPuffs = [];
      const puffCount = 4 + Math.floor(Math.random() * 4);
      for (let p = 0; p < puffCount; p++) {
        clusterPuffs.push({
          pos: [
            (Math.random() - 0.5) * 2.2,
            (Math.random() - 0.2) * 0.8,
            (Math.random() - 0.5) * 1.8
          ],
          scale: 0.8 + Math.random() * 0.9,
        });
      }

      arr.push({
        id: `cumulus-${i}`,
        pos: [
          (Math.random() - 0.5) * 36,
          -2.4 + (Math.random() - 0.5) * 1.2,
          -18 + Math.random() * 32
        ],
        scale: 1.1 + Math.random() * 1.4,
        puffs: clusterPuffs,
      });
    }
    return arr;
  }, []);

  if (opacity <= 0.01) return null;

  return (
    <group ref={cloudsRef}>
      {cloudClusters.map((c) => (
        <group key={c.id} position={c.pos} scale={[c.scale, c.scale * 0.48, c.scale]}>
          {c.puffs.map((puff, pi) => (
            <mesh key={pi} position={puff.pos} scale={puff.scale}>
              <sphereGeometry args={[1.2, 14, 14]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#dbeafe"
                emissiveIntensity={0.05}
                roughness={0.92}
                metalness={0.0}
                transparent={true}
                opacity={opacity * 0.9}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
