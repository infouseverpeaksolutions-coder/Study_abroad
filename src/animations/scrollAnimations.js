/**
 * scrollAnimations.js
 * Centralized Framer Motion & Three.js animation controller.
 * 
 * Drives the continuous cinematic journey:
 * SCENE 01: REAL EARTH
 * SCENE 02: DESTINATIONS
 * SCENE 03: AIRPLANE ENTRY
 * SCENE 04: STRATOSPHERIC FLIGHT
 * SCENE 05: DESCENT & ARRIVAL
 * SCENE 06: UNIVERSITY CAMPUS
 * SCENE 07: APPLICATION JOURNEY
 * SCENE 08: FINAL CTA
 */

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export const JOURNEY_STEPS = [
  { id: 0, label: '01 • Earth Horizon', targetId: '#hero' },
  { id: 1, label: '02 • Destinations', targetId: '#destinations' },
  { id: 2, label: '03 • Flight Transit', targetId: '#flight' },
  { id: 3, label: '04 • University Campus', targetId: '#arrival' },
  { id: 4, label: '05 • Application Pathway', targetId: '#journey' },
  { id: 5, label: '06 • Global Future', targetId: '#visa' },
];

/**
 * Evaluates the full 3D cinematic state for any scroll progress p in [0, 1].
 * Evaluated inside Three.js useFrame with zero React state overhead.
 */
export function evaluateCinematicJourney(progress) {
  const p = clamp(progress, 0, 1);

  // Default Camera
  let camPos = { x: 0, y: 0.25, z: 4.6 };
  let camTarget = { x: 0.1, y: 0, z: 0 };
  let camFov = 45;

  // Earth State
  let earthVisible = true;
  let earthOpacity = 1.0;
  let earthScale = 1.15;
  let earthPos = { x: 1.1, y: -0.1, z: 0 };
  let earthRotY = 0.2 + p * 1.8;
  let earthRotX = 0.12;
  let destinationsGlow = 0;
  let activeDestIndex = 0;

  // Airplane State
  let airplaneVisible = false;
  let planePos = { x: -5, y: 0, z: 0 };
  let planeRot = { pitch: 0, roll: 0, yaw: 0 };
  let cloudsOpacity = 0;

  // Campus State
  let campusVisible = false;
  let campusOpacity = 0;
  let campusPos = { x: 0, y: -4, z: 0 };
  let sunWarmth = 0;

  let activeChapterIndex = 0;

  if (p < 0.20) {
    // -------------------------------------------------------------
    // SCENE 01: REAL EARTH ("YOUR WORLD STARTS HERE")
    // -------------------------------------------------------------
    activeChapterIndex = 0;
    const u = p / 0.20;
    const eu = easeInOutCubic(u);

    camPos = { x: 0, y: lerp(0.18, 0.32, eu), z: lerp(4.5, 4.8, eu) };
    camTarget = { x: 0.1, y: 0, z: 0 };

    earthVisible = true;
    earthOpacity = 1.0;
    earthScale = lerp(1.2, 1.08, eu);
    earthPos = { x: lerp(1.25, 0.95, eu), y: lerp(-0.15, -0.05, eu), z: 0 };
    earthRotY = 0.2 + u * 0.45;
    destinationsGlow = 0;

    airplaneVisible = false;
    campusVisible = false;

  } else if (p < 0.42) {
    // -------------------------------------------------------------
    // SCENE 02: DESTINATIONS (UK, USA, Canada, Australia, Germany, NZ)
    // -------------------------------------------------------------
    activeChapterIndex = 1;
    const u = (p - 0.20) / 0.22;
    const eu = easeInOutCubic(u);

    camPos = { x: lerp(0, -0.2, eu), y: lerp(0.32, 0.5, eu), z: lerp(4.8, 5.5, eu) };
    camTarget = { x: lerp(0.1, 0, eu), y: 0, z: 0 };

    earthVisible = true;
    earthOpacity = 1.0;
    earthScale = lerp(1.08, 0.90, eu);
    earthPos = { x: lerp(0.95, -0.35, eu), y: lerp(-0.05, 0, eu), z: 0 };
    earthRotY = 0.65 + eu * 1.6;
    destinationsGlow = smoothstep(0.1, 0.6, u);
    activeDestIndex = Math.min(5, Math.floor(u * 6));

    airplaneVisible = false;
    campusVisible = false;

  } else if (p < 0.54) {
    // -------------------------------------------------------------
    // SCENE 03: AIRPLANE (Airliner enters frame diagonally)
    // -------------------------------------------------------------
    activeChapterIndex = 2;
    const u = (p - 0.42) / 0.12;
    const eu = easeInOutCubic(u);

    // Earth descends and unloads
    earthOpacity = Math.max(0, 1.0 - u * 2.2);
    earthVisible = earthOpacity > 0.02;
    earthPos = { x: -0.35, y: lerp(0, -6, eu), z: 0 };

    // Camera transitions smoothly to flight trajectory
    camPos = { x: lerp(-0.2, -0.2, eu), y: lerp(0.5, 1.2, eu), z: lerp(5.5, 5.2, eu) };
    camTarget = { x: lerp(0, 0.2, eu), y: lerp(0, 0.2, eu), z: -0.8 };

    // Airliner enters from the left into diagonal cruise angle
    airplaneVisible = true;
    planePos = {
      x: lerp(-5.0, 0.0, eu),
      y: lerp(0.4, 0.1, eu),
      z: lerp(1.0, -0.6, eu)
    };
    planeRot = {
      pitch: lerp(0.04, 0.09, eu),
      roll: lerp(-0.12, -0.22, eu),
      yaw: lerp(-0.65, -0.75, eu)
    };
    cloudsOpacity = smoothstep(0.3, 0.9, u) * 0.4;

    campusVisible = false;

  } else if (p < 0.72) {
    // -------------------------------------------------------------
    // SCENE 04: FLIGHT (Stratospheric cruise in 3/4 commercial profile)
    // -------------------------------------------------------------
    activeChapterIndex = 3;
    const u = (p - 0.54) / 0.18;
    const eu = easeInOutCubic(u);

    earthVisible = false;

    airplaneVisible = true;
    planePos = {
      x: lerp(0.0, 1.2, u),
      y: lerp(0.1, 0.4, u),
      z: lerp(-0.6, -3.5, u)
    };
    planeRot = {
      pitch: lerp(0.09, 0.14, u),
      roll: lerp(-0.22, -0.30, u),
      yaw: lerp(-0.75, -0.82, u)
    };

    // Camera tracks alongside aircraft
    camPos = {
      x: lerp(-0.2, 0.4, eu),
      y: lerp(1.2, 1.5, eu),
      z: lerp(5.2, 4.6, eu)
    };
    camTarget = {
      x: lerp(0.2, 0.8, eu),
      y: lerp(0.2, 0.35, eu),
      z: lerp(-0.8, -2.6, eu)
    };

    cloudsOpacity = smoothstep(0.0, 0.4, u) * Math.max(0, 1 - (u - 0.7) * 3);

    campusVisible = false;

  } else if (p < 0.86) {
    // -------------------------------------------------------------
    // SCENE 05: ARRIVAL (Descent toward university grounds)
    // -------------------------------------------------------------
    activeChapterIndex = 4;
    const u = (p - 0.72) / 0.14;
    const eu = easeInOutCubic(u);

    earthVisible = false;

    // Airliner flies forward into distance and clears
    airplaneVisible = u < 0.6;
    planePos = {
      x: lerp(1.2, 4.0, u),
      y: lerp(0.4, 1.8, u),
      z: lerp(-3.5, -14, u)
    };
    cloudsOpacity = Math.max(0, 0.4 - u * 0.8);

    // Campus environment appears below
    campusVisible = true;
    campusOpacity = smoothstep(0.1, 0.6, u);
    campusPos = {
      x: 0,
      y: lerp(-6, -0.2, eu),
      z: lerp(4, 0, eu)
    };

    // Camera descends from flight altitude to campus avenue
    camPos = {
      x: lerp(0.4, 0, eu),
      y: lerp(1.5, 4.0, eu),
      z: lerp(4.6, 18.0, eu)
    };
    camTarget = {
      x: lerp(0.8, 0, eu),
      y: lerp(0.35, 3.2, eu),
      z: lerp(-2.6, -5.5, eu)
    };

    sunWarmth = smoothstep(0.2, 0.9, u);

  } else {
    // -------------------------------------------------------------
    // SCENE 06: UNIVERSITY CAMPUS (Neoclassical portico & avenue)
    // -------------------------------------------------------------
    activeChapterIndex = 5;
    const u = (p - 0.86) / 0.14;
    const eu = easeInOutCubic(u);

    earthVisible = false;
    airplaneVisible = false;

    campusVisible = true;
    campusOpacity = 1.0;
    campusPos = { x: 0, y: -0.2, z: 0 };

    // Camera glides down the grand tree-lined avenue toward entrance
    camPos = {
      x: 0,
      y: lerp(4.0, 2.6, eu),
      z: lerp(18.0, 11.5, eu)
    };
    camTarget = {
      x: 0,
      y: lerp(3.2, 2.8, eu),
      z: -5.5
    };

    sunWarmth = 1.0;
  }

  return {
    progress: p,
    activeChapterIndex,
    camera: { pos: camPos, target: camTarget, fov: camFov },
    earth: {
      visible: earthVisible,
      opacity: earthOpacity,
      scale: earthScale,
      pos: earthPos,
      rotY: earthRotY,
      rotX: earthRotX,
      destinationsGlow,
      activeDestIndex
    },
    airplane: {
      visible: airplaneVisible,
      pos: planePos,
      rot: planeRot,
      cloudsOpacity
    },
    campus: {
      visible: campusVisible,
      opacity: campusOpacity,
      pos: campusPos,
      sunWarmth
    }
  };
}
