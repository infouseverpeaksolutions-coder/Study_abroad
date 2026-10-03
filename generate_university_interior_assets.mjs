import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Polyfill FileReader for Node.js GLTFExporter binary export
globalThis.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
      if (this.onload) this.onload();
    });
  }
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function saveGLB(scene, filePath) {
  return new Promise((resolve, reject) => {
    ensureDir(path.dirname(filePath));
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (glb) => {
        fs.writeFileSync(filePath, Buffer.from(glb));
        console.log(`[GLB Exported] ${filePath} (${(fs.statSync(filePath).size / 1024).toFixed(1)} KB)`);
        resolve();
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}

// =========================================================================
// 1. UPDATED REALISTIC AIRPLANE (Matching media_1790937424060.png)
// White fuselage, oceanic blue livery, raked wingtips, polished turbofan engines
// =========================================================================
function buildAirplaneScene() {
  const root = new THREE.Group();
  root.name = 'Boeing787CinematicAirliner';

  // Materials
  const fuselageMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.14,
    metalness: 0.28,
  });

  const bellyBlueMat = new THREE.MeshStandardMaterial({
    color: 0x1d4ed8, // Rich oceanic navy blue matching user reference image
    roughness: 0.18,
    metalness: 0.40,
  });

  const cyanStripeMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8, // Sky-blue upper wave accent
    roughness: 0.22,
    metalness: 0.35,
  });

  const cockpitGlassMat = new THREE.MeshStandardMaterial({
    color: 0x091428,
    roughness: 0.04,
    metalness: 0.96,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.08,
    metalness: 0.96,
  });

  const titaniumMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.35,
    metalness: 0.85,
  });

  const whiteEmblemMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.1,
  });

  // 1. FUSELAGE HULL (Seamless aerodynamic Boeing 787 loft)
  const fuselagePoints = [
    new THREE.Vector2(0.04, -3.8),
    new THREE.Vector2(0.18, -3.5),
    new THREE.Vector2(0.32, -3.1),
    new THREE.Vector2(0.42, -2.6),
    new THREE.Vector2(0.48, -2.0),
    new THREE.Vector2(0.50, -1.0),
    new THREE.Vector2(0.50, 0.0),
    new THREE.Vector2(0.50, 1.8),
    new THREE.Vector2(0.48, 2.8),
    new THREE.Vector2(0.42, 3.6),
    new THREE.Vector2(0.32, 4.3),
    new THREE.Vector2(0.18, 5.0),
    new THREE.Vector2(0.06, 5.5),
  ];
  const fuselageGeo = new THREE.LatheGeometry(fuselagePoints, 48);
  fuselageGeo.rotateX(Math.PI / 2);
  const fuselage = new THREE.Mesh(fuselageGeo, fuselageMat);
  root.add(fuselage);

  // APU exhaust nozzle
  const apuGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 16);
  apuGeo.rotateX(Math.PI / 2);
  const apu = new THREE.Mesh(apuGeo, titaniumMat);
  apu.position.set(0, 0.08, 5.65);
  root.add(apu);

  // 2. TWO-TONE OCEANIC BLUE BELLY LIVERY (Matching media_1790937424060.png!)
  // Bottom half belly (royal navy blue #1d4ed8)
  const bellyPoints = [
    new THREE.Vector2(0.042, -3.68),
    new THREE.Vector2(0.182, -3.4),
    new THREE.Vector2(0.322, -3.0),
    new THREE.Vector2(0.422, -2.5),
    new THREE.Vector2(0.482, -1.9),
    new THREE.Vector2(0.503, -0.9),
    new THREE.Vector2(0.503, 0.0),
    new THREE.Vector2(0.503, 1.8),
    new THREE.Vector2(0.482, 2.7),
    new THREE.Vector2(0.422, 3.5),
    new THREE.Vector2(0.322, 4.2),
    new THREE.Vector2(0.182, 4.9),
    new THREE.Vector2(0.062, 5.4),
  ];
  const bellyGeo = new THREE.LatheGeometry(bellyPoints, 36, 1.5 * Math.PI, Math.PI);
  bellyGeo.rotateX(Math.PI / 2);
  const belly = new THREE.Mesh(bellyGeo, bellyBlueMat);
  root.add(belly);

  // Dynamic cyan wave accent stripes (#38bdf8) along both flanks
  const cyanGeo1 = new THREE.LatheGeometry(bellyPoints, 36, 1.45 * Math.PI, 0.09 * Math.PI);
  cyanGeo1.rotateX(Math.PI / 2);
  const cyanWave1 = new THREE.Mesh(cyanGeo1, cyanStripeMat);
  root.add(cyanWave1);

  const cyanGeo2 = new THREE.LatheGeometry(bellyPoints, 36, 0.46 * Math.PI, 0.09 * Math.PI);
  cyanGeo2.rotateX(Math.PI / 2);
  const cyanWave2 = new THREE.Mesh(cyanGeo2, cyanStripeMat);
  root.add(cyanWave2);

  // Passenger cabin windows and emergency exit stencils
  for (let s of [-1, 1]) {
    for (let z = -2.2; z <= 2.8; z += 0.22) {
      const winGeo = new THREE.BoxGeometry(0.04, 0.08, 0.12);
      const win = new THREE.Mesh(winGeo, cockpitGlassMat);
      win.position.set(s * 0.495, 0.12, z);
      root.add(win);
    }

    // Emergency doors (flush stencil)
    for (let z of [-2.4, 1.2, 3.2]) {
      const doorOutline = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.32, 0.16),
        new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.5 })
      );
      doorOutline.position.set(s * 0.496, 0.04, z);
      root.add(doorOutline);
    }
  }

  // 3. COCKPIT WINDSHIELD (4-panel 787 wraparound glass - flush aerodynamic)
  const windshieldGroup = new THREE.Group();
  windshieldGroup.position.set(0, 0.30, -2.85);

  for (let s of [-1, 1]) {
    const frontPane = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, 0.22), cockpitGlassMat);
    frontPane.position.set(s * 0.10, 0.02, -0.15);
    frontPane.rotation.set(0.36, s * -0.18, s * 0.05);
    windshieldGroup.add(frontPane);

    const sidePane = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.26), cockpitGlassMat);
    sidePane.position.set(s * 0.24, 0.01, 0.05);
    sidePane.rotation.set(0.28, s * -0.48, s * 0.10);
    windshieldGroup.add(sidePane);
  }
  root.add(windshieldGroup);

  // 4. SUPERCRITICAL HIGH-FLEX WINGS & RAKED WINGTIPS (Dreamliner Wing Flex!)
  for (let s of [-1, 1]) {
    const wingRoot = new THREE.Group();
    wingRoot.position.set(s * 0.48, -0.12, 0.2);

    // Inner Wing Segment
    const seg1Geo = new THREE.BoxGeometry(2.0, 0.06, 1.4);
    const seg1 = new THREE.Mesh(seg1Geo, fuselageMat);
    seg1.position.set(s * 1.0, 0.04, 0);
    seg1.rotation.set(0, s * -0.32, s * 0.06);
    wingRoot.add(seg1);

    // Chrome leading edge slat 1
    const slat1 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.065, 0.14), chromeMat);
    slat1.position.set(s * 1.0, 0.04, -0.65);
    slat1.rotation.set(0, s * -0.32, s * 0.06);
    wingRoot.add(slat1);

    // Mid Wing Segment (Graceful upward flex begins)
    const seg2Geo = new THREE.BoxGeometry(2.0, 0.05, 1.0);
    const seg2 = new THREE.Mesh(seg2Geo, fuselageMat);
    seg2.position.set(s * 2.85, 0.22, 0.65);
    seg2.rotation.set(0, s * -0.36, s * 0.14);
    wingRoot.add(seg2);

    // Chrome leading edge slat 2
    const slat2 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.055, 0.12), chromeMat);
    slat2.position.set(s * 2.85, 0.22, 0.18);
    slat2.rotation.set(0, s * -0.36, s * 0.14);
    wingRoot.add(slat2);

    // Outer Flex Segment & Raked Blended Wingtip
    const seg3Geo = new THREE.BoxGeometry(1.6, 0.04, 0.7);
    const seg3 = new THREE.Mesh(seg3Geo, fuselageMat);
    seg3.position.set(s * 4.45, 0.58, 1.45);
    seg3.rotation.set(0, s * -0.42, s * 0.28);
    wingRoot.add(seg3);

    // Signature Raked Wingtip (Aerodynamic swept blade tapering into the air in oceanic blue)
    const tipGeo = new THREE.ConeGeometry(0.18, 1.3, 16);
    tipGeo.rotateX(Math.PI / 2);
    tipGeo.scale(0.8, 0.15, 1.0);
    const tip = new THREE.Mesh(tipGeo, bellyBlueMat);
    tip.position.set(s * 5.25, 0.72, 1.95);
    tip.rotation.set(0.1, s * -0.45, s * 0.35);
    wingRoot.add(tip);

    // Navigation Strobe on wingtip
    const navGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const navMat = new THREE.MeshBasicMaterial({ color: s === -1 ? 0xef4444 : 0x10b981 });
    const nav = new THREE.Mesh(navGeo, navMat);
    nav.position.set(s * 5.4, 1.35, 2.15);
    wingRoot.add(nav);

    // Flap track canoe fairings under the wing
    const canoeZOffsets = [-0.15, 0.45, 1.05];
    const canoeXOffsets = [1.2, 2.3, 3.4];
    for (let c = 0; c < 3; c++) {
      const canoeGeo = new THREE.ConeGeometry(0.06, 0.8, 12);
      canoeGeo.rotateX(Math.PI / 2);
      const canoe = new THREE.Mesh(canoeGeo, fuselageMat);
      canoe.position.set(s * canoeXOffsets[c], -0.06 + c * 0.08, canoeZOffsets[c]);
      wingRoot.add(canoe);
    }

    root.add(wingRoot);

    // 5. HIGH-BYPASS TURBOFAN JET ENGINES (Trent 1000 / GEnx style)
    const engineMount = new THREE.Group();
    engineMount.position.set(s * 1.85, -0.48, -0.15);

    // Pylon strut connecting wing to engine
    const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 1.1), fuselageMat);
    pylon.position.set(0, 0.32, 0);
    pylon.rotation.x = -0.12;
    engineMount.add(pylon);

    // Main Engine Nacelle
    const nacelleGeo = new THREE.CylinderGeometry(0.40, 0.34, 1.85, 36);
    nacelleGeo.rotateX(Math.PI / 2);
    const nacelle = new THREE.Mesh(nacelleGeo, fuselageMat);
    engineMount.add(nacelle);

    // Oceanic blue cowl livery stripe
    const nacelleStripe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.402, 0.38, 0.3, 36, 1, true),
      bellyBlueMat
    );
    nacelleStripe.rotateX(Math.PI / 2);
    nacelleStripe.position.set(0, 0, -0.15);
    engineMount.add(nacelleStripe);

    // Scalloped / Chevron Noise-reduction Trailing Edge (The signature 787 chevrons!)
    const chevronGeo = new THREE.CylinderGeometry(0.345, 0.32, 0.35, 18);
    chevronGeo.rotateX(Math.PI / 2);
    const chevrons = new THREE.Mesh(chevronGeo, titaniumMat);
    chevrons.position.set(0, 0, 0.95);
    engineMount.add(chevrons);

    // Gleaming chrome polished intake lip ring
    const ringGeo = new THREE.TorusGeometry(0.39, 0.035, 16, 36);
    const ring = new THREE.Mesh(ringGeo, chromeMat);
    ring.position.set(0, 0, -0.92);
    engineMount.add(ring);

    // Engine Core Interior & Spinner Cone
    const fanBacking = new THREE.Mesh(new THREE.CircleGeometry(0.37, 24), titaniumMat);
    fanBacking.position.set(0, 0, -0.80);
    engineMount.add(fanBacking);

    // Aerodynamic Center Spinner Cone
    const spinnerGeo = new THREE.ConeGeometry(0.10, 0.32, 16);
    spinnerGeo.rotateX(-Math.PI / 2);
    const spinner = new THREE.Mesh(spinnerGeo, chromeMat);
    spinner.position.set(0, 0, -0.74);
    engineMount.add(spinner);

    // Individual Titanium Fan Blades inside the intake!
    for (let b = 0; b < 18; b++) {
      const angle = (b / 18) * Math.PI * 2;
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.28, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 })
      );
      blade.position.set(Math.cos(angle) * 0.22, Math.sin(angle) * 0.22, -0.81);
      blade.rotation.set(0, 0, angle + 0.35);
      engineMount.add(blade);
    }

    // Rear exhaust cone
    const exhaustCone = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.45, 16), titaniumMat);
    exhaustCone.position.set(0, 0, 1.25);
    exhaustCone.rotateX(Math.PI / 2);
    engineMount.add(exhaustCone);

    root.add(engineMount);
  }

  // 6. TAIL FIN (Vertical Stabilizer with Winged Emblem)
  const finGroup = new THREE.Group();
  finGroup.position.set(0, 1.35, 3.8);

  // Swept vertical fin in oceanic blue
  const finGeo = new THREE.BoxGeometry(0.10, 2.2, 1.45);
  const fin = new THREE.Mesh(finGeo, bellyBlueMat);
  fin.rotation.x = 0.52; // Gracefully swept back
  finGroup.add(fin);

  // White Winged Bird Emblem on both sides of fin (Directly matching media_1790937424060.png!)
  for (let s of [-1, 1]) {
    const emblemGroup = new THREE.Group();
    emblemGroup.position.set(s * 0.055, 0.15, -0.1);

    // Top primary wing feather
    const feather1 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.22, 0.55), whiteEmblemMat);
    feather1.rotation.set(0.68, 0, s * -0.05);
    emblemGroup.add(feather1);

    // Mid wing feather
    const feather2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.42), whiteEmblemMat);
    feather2.position.set(0, -0.15, -0.06);
    feather2.rotation.set(0.74, 0, s * -0.05);
    emblemGroup.add(feather2);

    // Lower wing feather
    const feather3 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.28), whiteEmblemMat);
    feather3.position.set(0, -0.28, -0.12);
    feather3.rotation.set(0.80, 0, s * -0.05);
    emblemGroup.add(feather3);

    finGroup.add(emblemGroup);
  }
  root.add(finGroup);

  // Horizontal Tailplanes
  for (let s of [-1, 1]) {
    const hTail = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.8), fuselageMat);
    hTail.position.set(s * 1.1, 0.35, 4.2);
    hTail.rotation.set(0, s * -0.28, s * 0.06);
    root.add(hTail);
  }

  return root;
}

// =========================================================================
// 2. MAIN UNIVERSITY ENTRANCE (Matching media_1790937424107.jpg)
// Sandstone Collegiate Gothic arch, banners "Better Futures Together", steps, doors
// =========================================================================
function buildUniversityEntranceScene() {
  const root = new THREE.Group();
  root.name = 'UniversityEntranceScene';

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0xd4c3a3, // Golden sandstone
    roughness: 0.85,
    metalness: 0.05,
  });

  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x3d271d,
    roughness: 0.55,
    metalness: 0.15,
  });

  const bannerMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a, // University royal blue
    roughness: 0.6,
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.3,
    metalness: 0.8,
  });

  const doorGlassMat = new THREE.MeshStandardMaterial({
    color: 0x79c7d9,
    roughness: 0.08,
    metalness: 0.5,
    transparent: true,
    opacity: 0.55,
  });

  const lanternGlowMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a, // Warm welcoming glow
  });

  // Base Plaza Pavement & Approach Steps
  const stepsGroup = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const stepGeo = new THREE.BoxGeometry(10 + i * 0.6, 0.18, 3.0 + i * 0.6);
    const step = new THREE.Mesh(stepGeo, stoneMat);
    step.position.set(0, -0.09 - i * 0.18, -1.2 + i * 0.4);
    stepsGroup.add(step);
  }
  root.add(stepsGroup);

  // Grand Sandstone Portal Wall
  const wallGeo = new THREE.BoxGeometry(12, 8, 1.2);
  const wall = new THREE.Mesh(wallGeo, stoneMat);
  wall.position.set(0, 4, -2.5);
  root.add(wall);

  // Flanking Buttress Towers
  for (let s of [-1, 1]) {
    const buttressGeo = new THREE.BoxGeometry(1.6, 9.5, 1.6);
    const buttress = new THREE.Mesh(buttressGeo, stoneMat);
    buttress.position.set(s * 4.2, 4.75, -2.2);
    root.add(buttress);

    // Decorative Spire Pinnacle
    const spireGeo = new THREE.ConeGeometry(0.7, 2.2, 8);
    const spire = new THREE.Mesh(spireGeo, stoneMat);
    spire.position.set(s * 4.2, 10.6, -2.2);
    root.add(spire);

    // University Banners hanging beside archway (matching uploaded image!)
    const bannerGeo = new THREE.BoxGeometry(1.0, 3.2, 0.04);
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.set(s * 2.8, 5.2, -1.85);
    root.add(banner);

    // Gold emblem on banner
    const emblemGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.06, 16);
    emblemGeo.rotateX(Math.PI / 2);
    const emblem = new THREE.Mesh(emblemGeo, goldAccentMat);
    emblem.position.set(s * 2.8, 5.8, -1.82);
    root.add(emblem);

    // Historic Wall Lantern
    const lanternArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.45), goldAccentMat);
    lanternArm.position.set(s * 2.1, 3.2, -1.7);
    root.add(lanternArm);

    const lanternBox = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.42, 0.26), lanternGlowMat);
    lanternBox.position.set(s * 2.1, 3.0, -1.45);
    root.add(lanternBox);
  }

  // Central Gothic Arch Portal (Cutout simulation)
  const archRimGeo = new THREE.TorusGeometry(1.8, 0.35, 16, 32, Math.PI);
  const archRim = new THREE.Mesh(archRimGeo, stoneMat);
  archRim.position.set(0, 3.2, -1.88);
  root.add(archRim);

  // Grand Entrance Double Doors (Wood & Beveled Glass)
  const doorFrameGeo = new THREE.BoxGeometry(3.2, 3.6, 0.3);
  const doorFrame = new THREE.Mesh(doorFrameGeo, darkWoodMat);
  doorFrame.position.set(0, 1.8, -2.4);
  root.add(doorFrame);

  // Left & Right Door leaves
  for (let s of [-1, 1]) {
    const doorLeaf = new THREE.Group();
    doorLeaf.position.set(s * 0.75, 1.7, -2.35);

    const leafGeo = new THREE.BoxGeometry(1.4, 3.2, 0.1);
    const leaf = new THREE.Mesh(leafGeo, darkWoodMat);
    doorLeaf.add(leaf);

    // Large glass window in door
    const glassGeo = new THREE.BoxGeometry(1.0, 2.2, 0.12);
    const glass = new THREE.Mesh(glassGeo, doorGlassMat);
    glass.position.set(0, 0.2, 0);
    doorLeaf.add(glass);

    // Brass handles
    const handleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.6, 12);
    const handle = new THREE.Mesh(handleGeo, goldAccentMat);
    handle.position.set(s * -0.55, 0, 0.08);
    doorLeaf.add(handle);

    root.add(doorLeaf);
  }

  // Stone Monument in foreground (matching "Global Minds Brighter Futures" in image!)
  const monumentGroup = new THREE.Group();
  monumentGroup.position.set(4.5, 0.6, 1.5);
  const monumentBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 0.6), stoneMat);
  monumentGroup.add(monumentBase);
  const plaque = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.8, 0.64), goldAccentMat);
  monumentGroup.add(plaque);
  root.add(monumentGroup);

  return root;
}

// =========================================================================
// 3. UNIVERSITY LOBBY / ATRIUM
// Polished terrazzo floor, reception desk, grand staircase, digital directory
// =========================================================================
function buildLobbyScene() {
  const root = new THREE.Group();
  root.name = 'UniversityLobbyScene';

  const terrazzoFloorMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.16,
    metalness: 0.25,
  });

  const wallAcousticMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.7,
  });

  const wallStoneMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.6,
  });

  const deskMarbleMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.2,
    metalness: 0.3,
  });

  const woodSlatsMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.45,
  });

  const glassRailingMat = new THREE.MeshStandardMaterial({
    color: 0x79c7d9,
    roughness: 0.05,
    metalness: 0.6,
    transparent: true,
    opacity: 0.4,
  });

  const screenDisplayMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
  });

  const ceilingLedMat = new THREE.MeshBasicMaterial({
    color: 0xfffbeb,
  });

  // Terrazzo Floor
  const floorGeo = new THREE.BoxGeometry(16, 0.2, 18);
  const floor = new THREE.Mesh(floorGeo, terrazzoFloorMat);
  floor.position.set(0, -0.1, 0);
  root.add(floor);

  // Ceiling with LED recessed troughs
  const ceilingGeo = new THREE.BoxGeometry(16, 0.2, 18);
  const ceiling = new THREE.Mesh(ceilingGeo, wallStoneMat);
  ceiling.position.set(0, 5.0, 0);
  root.add(ceiling);

  for (let z = -6; z <= 6; z += 3.0) {
    const lightTrough = new THREE.Mesh(new THREE.BoxGeometry(11, 0.04, 0.35), ceilingLedMat);
    lightTrough.position.set(0, 4.88, z);
    root.add(lightTrough);
  }

  // Left & Right Atrium Walls
  for (let s of [-1, 1]) {
    const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5.0, 18), wallAcousticMat);
    sideWall.position.set(s * 7.9, 2.5, 0);
    root.add(sideWall);

    // Warm vertical acoustic wood slats
    for (let z = -8; z <= 8; z += 0.5) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.6, 0.12), woodSlatsMat);
      slat.position.set(s * 7.78, 2.5, z);
      root.add(slat);
    }
  }

  // Rear Wall (Leading to Corridors) at z = -8.9 with center opening
  const backWallLeft = new THREE.Mesh(new THREE.BoxGeometry(5.5, 5.0, 0.2), wallAcousticMat);
  backWallLeft.position.set(-5.2, 2.5, -8.9);
  root.add(backWallLeft);

  const backWallRight = new THREE.Mesh(new THREE.BoxGeometry(5.5, 5.0, 0.2), wallAcousticMat);
  backWallRight.position.set(5.2, 2.5, -8.9);
  root.add(backWallRight);

  const backWallHeader = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.4, 0.2), wallAcousticMat);
  backWallHeader.position.set(0, 4.3, -8.9);
  root.add(backWallHeader);

  // Illuminated corridor portal vista through the rear archway
  const portalGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.8, 3.2),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85, side: THREE.DoubleSide })
  );
  portalGlow.position.set(0, 1.8, -9.05);
  root.add(portalGlow);

  // Central Reception & Information Counter
  const desk = new THREE.Group();
  desk.position.set(0, 0, -1.8);

  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.12, 1.4), deskMarbleMat);
  deskTop.position.set(0, 1.1, 0);
  desk.add(deskTop);

  const deskFront = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.05, 1.2), woodSlatsMat);
  deskFront.position.set(0, 0.55, 0);
  desk.add(deskFront);

  // Monitor screens on reception desk
  for (let s of [-1, 1]) {
    const mon = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.04), screenDisplayMat);
    mon.position.set(s * 1.1, 1.35, 0);
    desk.add(mon);
  }
  root.add(desk);

  // Digital Campus Directory Display on Wall (Mounted flat on left wall)
  const directoryScreen = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.6, 2.6), screenDisplayMat);
  directoryScreen.position.set(-7.7, 2.4, -2.5);
  root.add(directoryScreen);

  // Grand Staircase to Second Floor (on the right)
  const stairGroup = new THREE.Group();
  stairGroup.position.set(5.2, 0, -1.0);
  for (let i = 0; i < 14; i++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.18, 0.4), terrazzoFloorMat);
    step.position.set(0, i * 0.18 + 0.09, -i * 0.35);
    stairGroup.add(step);
  }
  // Glass Railing
  const stairRailing = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.0, 5.5), glassRailingMat);
  stairRailing.position.set(-1.25, 1.8, -2.4);
  stairRailing.rotation.x = 0.45;
  stairGroup.add(stairRailing);
  root.add(stairGroup);

  // Student Lounge Armchairs & Planter (on the left foreground)
  const loungeGroup = new THREE.Group();
  loungeGroup.position.set(-4.2, 0, 0.5);

  const chairMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.8 });
  for (let x of [-0.9, 0.9]) {
    const chair = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.75, 0.95), chairMat);
    chair.position.set(x, 0.38, 0);
    loungeGroup.add(chair);
  }
  // Coffee Table
  const table = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.4, 24), deskMarbleMat);
  table.position.set(0, 0.2, 0);
  loungeGroup.add(table);

  // Indoor Planter with Green Foliage
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.35, 0.75, 20), wallStoneMat);
  pot.position.set(0, 0.38, 1.6);
  loungeGroup.add(pot);

  const bushMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
  const plant = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), bushMat);
  plant.position.set(0, 1.15, 1.6);
  loungeGroup.add(plant);

  root.add(loungeGroup);

  // Directional Signboard pointing to Corridor
  const signMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.48, 0.08), signMat);
  signBoard.position.set(0, 3.8, -7.5);
  root.add(signBoard);

  const signTextGlow = new THREE.MeshBasicMaterial({ color: 0x79c7d9 });
  const signText = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.16, 0.09), signTextGlow);
  signText.position.set(0, 3.8, -7.49);
  root.add(signText);

  return root;
}

// =========================================================================
// 4. CORRIDOR (One-point perspective, classroom doors, Door 204, lockers)
// =========================================================================
function buildCorridorScene() {
  const root = new THREE.Group();
  root.name = 'UniversityCorridorScene';

  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.22,
    metalness: 0.15,
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.75,
  });

  const doorWoodMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.5,
  });

  const doorGlassMat = new THREE.MeshStandardMaterial({
    color: 0x79c7d9,
    roughness: 0.05,
    metalness: 0.4,
    transparent: true,
    opacity: 0.5,
  });

  const windowGlassMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    roughness: 0.05,
    metalness: 0.2,
    transparent: true,
    opacity: 0.35,
  });

  const doorPlateGoldMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.25,
    metalness: 0.85,
  });

  const lockerMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a, // Navy lockers
    roughness: 0.4,
    metalness: 0.7,
  });

  const ceilingLedMat = new THREE.MeshBasicMaterial({
    color: 0xfffbeb,
  });

  // Corridor Floor
  const floorGeo = new THREE.BoxGeometry(4.2, 0.2, 26);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.set(0, -0.1, 0);
  root.add(floor);

  // Ceiling with Continuous Linear LED Troffer down center
  const ceilingGeo = new THREE.BoxGeometry(4.2, 0.2, 26);
  const ceiling = new THREE.Mesh(ceilingGeo, wallMat);
  ceiling.position.set(0, 3.8, 0);
  root.add(ceiling);

  const centerLed = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 25.5), ceilingLedMat);
  centerLed.position.set(0, 3.7, 0);
  root.add(centerLed);

  // Left Wall: Panoramic Floor-to-Ceiling Windows Looking at Campus
  const leftWall = new THREE.Group();
  leftWall.position.set(-2.0, 1.8, 0);

  for (let z = -10; z <= 10; z += 4.0) {
    const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.8, 0.15), wallMat);
    mullion.position.set(0, 0, z);
    leftWall.add(mullion);

    const windowPane = new THREE.Mesh(new THREE.BoxGeometry(0.05, 3.2, 3.8), windowGlassMat);
    windowPane.position.set(0, 0, z + 2.0);
    leftWall.add(windowPane);
  }
  root.add(leftWall);

  // Far End Wall at z = -13.0 with scenic architectural window (NO BLACK VOID!)
  const endWall = new THREE.Group();
  endWall.position.set(0, 1.9, -13.0);

  const endWallBase = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.8, 0.2), wallMat);
  endWall.add(endWallBase);

  // Sunlit window at the end of the corridor
  const endWin = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 2.8, 0.25),
    new THREE.MeshBasicMaterial({ color: 0xbae6fd })
  );
  endWin.position.set(0, 0.2, 0);
  endWall.add(endWin);
  root.add(endWall);

  // Right Wall: Solid Wall with Rhythm of Classroom Doors & Lockers
  const rightWall = new THREE.Group();
  rightWall.position.set(2.0, 1.8, 0);

  const wallBase = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.8, 26), wallMat);
  rightWall.add(wallBase);

  // Doors along right wall (Rooms 201, 202, 203, 204 ordered along corridor)
  const roomData = [
    { z: 5.0, num: '201' },
    { z: 1.0, num: '202' },
    { z: -3.0, num: '203' },
    { z: -7.0, num: '204', isTarget: true }, // The target classroom!
  ];

  roomData.forEach((room) => {
    const doorGroup = new THREE.Group();
    doorGroup.position.set(-0.08, 0, room.z);

    // Door Slab
    const doorSlab = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.6, 1.3), doorWoodMat);
    doorGroup.add(doorSlab);

    // Glass Vision Panel in Door
    const visionGlass = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.35), doorGlassMat);
    visionGlass.position.set(0, 0.35, 0);
    doorGroup.add(visionGlass);

    // Room Number Plaque
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.45), doorPlateGoldMat);
    plaque.position.set(0, 1.1, 0);
    doorGroup.add(plaque);

    // Door Handle
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.18), doorPlateGoldMat);
    handle.position.set(0, -0.1, -0.5);
    doorGroup.add(handle);

    // Warm luminous interior light spilling through Door 204's vision panel
    if (room.isTarget) {
      const interiorGlow = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 1.0, 0.32),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      interiorGlow.position.set(0.08, 0.35, 0);
      doorGroup.add(interiorGlow);

      // Dedicated Door Plaque Banner
      const label = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.22, 0.65),
        new THREE.MeshBasicMaterial({ color: 0x1d4ed8 })
      );
      label.position.set(0, 1.35, 0);
      doorGroup.add(label);
    }

    rightWall.add(doorGroup);
  });

  // Student Lockers along wall between doors
  for (let z of [7.5, 3.0, -1.0, -5.0, -9.5]) {
    const lockerBank = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.2, 1.6), lockerMat);
    lockerBank.position.set(-0.18, -0.2, z);
    rightWall.add(lockerBank);
  }

  // Bulletin Notice Boards
  for (let z of [-11.0, 9.5]) {
    const corkMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 });
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.2, 1.8), corkMat);
    board.position.set(-0.06, 0.3, z);
    rightWall.add(board);
  }

  root.add(rightWall);
  return root;
}

// =========================================================================
// 5. CLASSROOM 204 (Tiered desks, active students, professor, presentation screen)
// =========================================================================
function buildClassroomScene() {
  const root = new THREE.Group();
  root.name = 'UniversityClassroomScene';

  const oakWoodMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Warm natural blonde oak
    roughness: 0.45,
  });

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.35,
    metalness: 0.8,
  });

  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.7,
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.8,
  });

  const screenActiveMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8, // Interactive slide screen
  });

  const whiteboardMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.15,
  });

  const chairFabricMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a, // University blue fabric
    roughness: 0.85,
  });

  const laptopGlowMat = new THREE.MeshBasicMaterial({
    color: 0x67e8f9,
  });

  const backpackMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.7,
  });

  // Classroom Floor
  const floorGeo = new THREE.BoxGeometry(12, 0.2, 14);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.set(0, -0.1, 0);
  root.add(floor);

  // Ceiling
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 14), wallMat);
  ceiling.position.set(0, 4.4, 0);
  root.add(ceiling);

  // Classroom Walls
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(12, 4.4, 0.2), wallMat);
  backWall.position.set(0, 2.2, -6.9);
  root.add(backWall);

  const frontWall = new THREE.Mesh(new THREE.BoxGeometry(12, 4.4, 0.2), wallMat);
  frontWall.position.set(0, 2.2, 6.9);
  root.add(frontWall);

  // Right Wall
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.4, 14), wallMat);
  rightWall.position.set(5.9, 2.2, 0);
  root.add(rightWall);

  // Left Wall: Large Windows Overlooking Sunny Campus
  const leftWall = new THREE.Group();
  leftWall.position.set(-5.9, 2.2, 0);
  for (let z = -4.5; z <= 4.5; z += 4.5) {
    const winGlassMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      roughness: 0.05,
      transparent: true,
      opacity: 0.35,
    });
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.4, 3.8), winGlassMat);
    win.position.set(0, 0, z);
    leftWall.add(win);
  }
  root.add(leftWall);

  // FRONT OF CLASSROOM: Presentation Screen & Whiteboard
  // Positioned at x = 1.2 so it's showcased in the right side of the frame!
  const frontGroup = new THREE.Group();
  frontGroup.position.set(0, 0, -6.6);

  // Huge 85" Ultra-wide Presentation Display
  const screenBezel = new THREE.Mesh(new THREE.BoxGeometry(4.6, 2.5, 0.1), metalMat);
  screenBezel.position.set(2.0, 2.4, 0);
  frontGroup.add(screenBezel);

  const screenActive = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.3, 0.06), screenActiveMat);
  screenActive.position.set(2.0, 2.4, 0.05);
  frontGroup.add(screenActive);

  // Wide Whiteboard with diagrams
  const whiteboard = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.8, 0.05), whiteboardMat);
  whiteboard.position.set(-1.8, 2.2, 0);
  frontGroup.add(whiteboard);

  // Professor's Oak Lectern / Podium
  const lectern = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.15, 0.7), oakWoodMat);
  lectern.position.set(3.6, 0.58, 1.2);
  frontGroup.add(lectern);

  // Professor Figure standing at lectern
  const profGroup = new THREE.Group();
  profGroup.position.set(3.6, 0, 1.8);
  const profBody = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.65, 0.24), new THREE.MeshStandardMaterial({ color: 0x334155 }));
  profBody.position.y = 1.25;
  profGroup.add(profBody);
  const profHead = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfbcfe8 }));
  profHead.position.y = 1.72;
  profGroup.add(profHead);
  frontGroup.add(profGroup);

  root.add(frontGroup);

  // STUDENT DESKS & CHAIRS (4 Tiered Rows with clear left aisle)
  for (let row = 0; row < 4; row++) {
    const rowZ = -3.2 + row * 2.5;
    const rowY = row * 0.14; // Tier elevation

    // Continuous long desk table shifted right to keep aisle at x < -0.5 clear
    const deskTable = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.06, 0.75), oakWoodMat);
    deskTable.position.set(1.5, 0.76 + rowY, rowZ);
    root.add(deskTable);

    // Metal legs
    for (let lx of [-2.8, -0.9, 1.0, 2.9]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.76 + rowY, 12), metalMat);
      leg.position.set(1.5 + lx, (0.76 + rowY) / 2, rowZ);
      root.add(leg);
    }

    // Student Chairs & Lived-in details (in columns away from the entry aisle)
    for (let col of [-1.2, 0.3, 1.8, 3.3]) {
      const chairGroup = new THREE.Group();
      chairGroup.position.set(1.5 + col, rowY, rowZ + 0.65);

      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.05, 0.48), chairFabricMat);
      seat.position.y = 0.48;
      chairGroup.add(seat);

      const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.45, 0.05), chairFabricMat);
      backrest.position.set(0, 0.75, 0.22);
      chairGroup.add(backrest);

      root.add(chairGroup);

      // Open Laptop
      const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.015, 0.26), metalMat);
      laptopBase.position.set(1.5 + col, 0.79 + rowY, rowZ);
      root.add(laptopBase);

      const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.26, 0.012), laptopGlowMat);
      laptopScreen.position.set(1.5 + col, 0.92 + rowY, rowZ - 0.12);
      laptopScreen.rotation.x = -0.25;
      root.add(laptopScreen);

      // Backpack beside chair
      const bag = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.38, 0.18), backpackMat);
      bag.position.set(1.5 + col + 0.38, rowY + 0.19, rowZ + 0.65);
      root.add(bag);

      // Student Figure (Seated)
      const student = new THREE.Group();
      student.position.set(1.5 + col, rowY, rowZ + 0.6);

      const studentBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.5, 0.22),
        new THREE.MeshStandardMaterial({ color: row % 2 === 0 ? 0x1d4ed8 : 0x047857 })
      );
      studentBody.position.y = 0.75;
      student.add(studentBody);

      const studentHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xdfad89 })
      );
      studentHead.position.set(0, 1.15, -0.02);
      student.add(studentHead);

      root.add(student);
    }
  }

  // Volumetric Sunbeams streaming through the left windows across desks
  const sunbeamMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.16,
    side: THREE.DoubleSide,
  });
  const sunbeam1 = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 3.2), sunbeamMat);
  sunbeam1.position.set(-2.5, 1.8, -1.0);
  sunbeam1.rotation.y = 0.45;
  sunbeam1.rotation.z = -0.35;
  root.add(sunbeam1);

  const sunbeam2 = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 3.2), sunbeamMat);
  sunbeam2.position.set(-2.5, 1.8, 2.5);
  sunbeam2.rotation.y = 0.45;
  sunbeam2.rotation.z = -0.35;
  root.add(sunbeam2);

  return root;
}

// =========================================================================
// RUN GENERATION
// =========================================================================
async function run() {
  console.log('Generating updated cinematic 3D GLB assets...');

  const airplane = buildAirplaneScene();
  await saveGLB(airplane, path.join(__dirname, 'public', 'assets', '3d', 'airplane', 'airplane.glb'));

  const entrance = buildUniversityEntranceScene();
  await saveGLB(entrance, path.join(__dirname, 'public', 'assets', '3d', 'university', 'university-entrance.glb'));

  const lobby = buildLobbyScene();
  await saveGLB(lobby, path.join(__dirname, 'public', 'assets', '3d', 'university', 'lobby.glb'));

  const corridor = buildCorridorScene();
  await saveGLB(corridor, path.join(__dirname, 'public', 'assets', '3d', 'university', 'corridor.glb'));

  const classroom = buildClassroomScene();
  await saveGLB(classroom, path.join(__dirname, 'public', 'assets', '3d', 'university', 'classroom.glb'));

  console.log('All cinematic university journey assets generated successfully!');
}

run().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
