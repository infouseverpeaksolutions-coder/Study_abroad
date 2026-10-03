import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import DestinationMarkers from './DestinationMarkers';
import { sceneState } from '../../animations/gsapTimeline';

// Preload all high-resolution NASA satellite textures
useTexture.preload('/assets/3d/earth/earth-color.jpg');
useTexture.preload('/assets/3d/earth/earth-normal.jpg');
useTexture.preload('/assets/3d/earth/earth-specular.jpg');
useTexture.preload('/assets/3d/earth/earth-clouds.png');
useTexture.preload('/assets/3d/earth/earth-night.jpg');

// Physically believable Rayleigh Atmospheric Rim Glow Shader
const AtmosphereRimShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldNormal;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldNormal;
    uniform vec3 uGlowColor;
    uniform vec3 uSunDirection;
    uniform float uOpacity;

    void main() {
      vec3 viewDir = normalize(-vPosition);
      float vDotN = dot(viewDir, normalize(vNormal));

      // Delicate exponential Fresnel rim curve: strictly at the glancing horizon
      float rim = pow(1.0 - max(vDotN, 0.0), 5.2);

      // Realistic forward scattering: stronger on sunlit side, softly diminishing on dark side
      vec3 normSun = normalize(uSunDirection);
      float sunFacing = max(0.0, dot(normalize(vWorldNormal), normSun));
      float sunScatter = 0.2 + 0.8 * pow(sunFacing, 1.5);

      vec3 col = uGlowColor * (0.85 + 0.3 * sunScatter);
      gl_FragColor = vec4(col, rim * uOpacity * (0.1 + 0.9 * sunScatter));
    }
  `
};

export default function EarthScene({ earthRef, isMobile = false }) {
  const cloudsRef = useRef();
  const earthMeshRef = useRef();
  const atmosphereRef = useRef();
  const [destIndex, setDestIndex] = useState(0);
  const [destGlow, setDestGlow] = useState(0);
  const lastDestIndexRef = useRef(0);

  // Load high-resolution NASA satellite textures
  const [colorMap, normalMap, specularMap, cloudsMap, nightMap] = useTexture([
    '/assets/3d/earth/earth-color.jpg',
    '/assets/3d/earth/earth-normal.jpg',
    '/assets/3d/earth/earth-specular.jpg',
    '/assets/3d/earth/earth-clouds.png',
    '/assets/3d/earth/earth-night.jpg',
  ]);

  // Configure color space & anisotropy for sharpness
  useEffect(() => {
    if (colorMap) {
      colorMap.colorSpace = THREE.SRGBColorSpace;
      colorMap.anisotropy = 8;
    }
    if (nightMap) {
      nightMap.colorSpace = THREE.SRGBColorSpace;
      nightMap.anisotropy = 8;
    }
    if (normalMap) normalMap.anisotropy = 8;
    if (specularMap) specularMap.anisotropy = 8;
    if (cloudsMap) cloudsMap.anisotropy = 8;
  }, [colorMap, nightMap, normalMap, specularMap, cloudsMap]);

  const RADIUS = 2.0;
  const sunDirection = useMemo(() => new THREE.Vector3(7, 3.5, 5).normalize(), []);

  // Earth PBR Material with customized shader for realistic night lights
  const earthMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map: colorMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughnessMap: specularMap,
      roughness: 0.72,
      metalness: 0.08,
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uSunDirection = { value: sunDirection };
      shader.uniforms.uNightTexture = { value: nightMap };
      shader.uniforms.uNightIntensity = { value: 1.35 };

      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
         varying vec3 vWorldNormalCustom;
         varying vec2 vCustomUv;`
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vCustomUv = uv;
         vWorldNormalCustom = normalize((modelMatrix * vec4(normal, 0.0)).xyz);`
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>
         varying vec3 vWorldNormalCustom;
         varying vec2 vCustomUv;
         uniform vec3 uSunDirection;
         uniform sampler2D uNightTexture;
         uniform float uNightIntensity;`
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
         // Physically-based terminator calculation:
         // 1.0 on deep night side, 0.0 on bright daylight side, with soft twilight terminator
         float sunDot = dot(normalize(vWorldNormalCustom), normalize(uSunDirection));
         float nightFactor = 1.0 - smoothstep(-0.20, 0.16, sunDot);

         vec4 nightCol = texture2D(uNightTexture, vCustomUv);
         // Golden/amber urban cluster light temperature
         vec3 urbanGold = vec3(1.0, 0.88, 0.62) * uNightIntensity;
         totalEmissiveRadiance += nightCol.rgb * nightFactor * urbanGold;`
      );
    };

    return mat;
  }, [colorMap, normalMap, specularMap, nightMap, sunDirection]);

  // Atmosphere Rim Material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: AtmosphereRimShader.vertexShader,
      fragmentShader: AtmosphereRimShader.fragmentShader,
      uniforms: {
        uGlowColor: { value: new THREE.Color('#6EA8FF') },
        uSunDirection: { value: sunDirection },
        uOpacity: { value: 0.75 },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
    });
  }, [sunDirection]);

  useFrame((state, delta) => {
    if (!earthRef.current) return;

    if (sceneState.earthVisible < 0.01) {
      earthRef.current.visible = false;
      return;
    }

    earthRef.current.visible = true;

    // Delta-aware exponential smoothing for buttery transforms
    const speed = 6;
    const t = 1 - Math.exp(-speed * delta);

    earthRef.current.position.x += (sceneState.earthPos.x - earthRef.current.position.x) * t;
    earthRef.current.position.y += (sceneState.earthPos.y - earthRef.current.position.y) * t;
    earthRef.current.position.z += (sceneState.earthPos.z - earthRef.current.position.z) * t;

    const targetS = sceneState.earthScale;
    const curS = earthRef.current.scale.x;
    const ns = curS + (targetS - curS) * t;
    earthRef.current.scale.set(ns, ns, ns);

    // Earth axial rotation: base scroll scrub rotation + gentle idle rotation
    if (earthMeshRef.current) {
      earthMeshRef.current.rotation.y = sceneState.earthRotY + state.clock.getElapsedTime() * 0.012;
      earthMeshRef.current.rotation.x = sceneState.earthRotX;
    }

    // Clouds rotate independently and slightly faster, creating natural weather drift
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = sceneState.earthRotY * 1.04 + state.clock.getElapsedTime() * 0.018;
      cloudsRef.current.rotation.x = sceneState.earthRotX * 0.96;
    }

    // Fade earth out when descending deep into atmosphere/clouds
    if (earthMaterial) {
      earthMaterial.opacity = sceneState.earthOpacity !== undefined ? sceneState.earthOpacity : 1.0;
      earthMaterial.transparent = earthMaterial.opacity < 0.99;
    }

    // Update active destination index
    if (sceneState.activeDestIndex !== lastDestIndexRef.current) {
      lastDestIndexRef.current = sceneState.activeDestIndex;
      setDestIndex(sceneState.activeDestIndex);
    }

    if (Math.abs(sceneState.destinationsGlow - destGlow) > 0.05) {
      setDestGlow(sceneState.destinationsGlow);
    }
  });

  return (
    <group ref={earthRef} position={[1.1, -0.1, 0]}>
      {/* 1. Main Realistic Planetary Sphere (Adaptive 128x128 on desktop / 64x64 on mobile) */}
      <mesh ref={earthMeshRef} material={earthMaterial} receiveShadow castShadow>
        <sphereGeometry args={[RADIUS, isMobile ? 64 : 128, isMobile ? 64 : 128]} />

        {/* Real Geographic Destination Markers & Connection Arcs */}
        <DestinationMarkers
          earthRef={earthRef}
          activeIndex={destIndex}
          glowIntensity={destGlow}
        />
      </mesh>

      {/* 2. Independent Real Atmospheric Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[RADIUS * 1.008, isMobile ? 48 : 96, isMobile ? 48 : 96]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.38}
          blending={THREE.NormalBlending}
          depthWrite={false}
          roughness={1.0}
        />
      </mesh>

      {/* 3. Subtle Rayleigh Atmospheric Scattering Shell (Hugged tight to the limb) */}
      <mesh ref={atmosphereRef} scale={[1.018, 1.018, 1.018]} material={atmosphereMaterial}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
      </mesh>
    </group>
  );
}
