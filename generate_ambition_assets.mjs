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
        console.log(`[GLB Saved] ${filePath} (${(fs.statSync(filePath).size / 1024).toFixed(1)} KB)`);
        resolve();
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}

// =========================================================================
// 1. SCENE 01: AMBITION LOOKOUT & STUDENT (0–12%)
// Architectural overlook terrace with glass railing, pavers, and thoughtful student
// =========================================================================
function buildLookoutStudentScene() {
  const root = new THREE.Group();
  root.name = 'LookoutStudentScene';

  // PBR Materials
  const stonePaverMat = new THREE.MeshStandardMaterial({
    color: 0x1a2434,
    roughness: 0.8,
    metalness: 0.1,
  });

  const railingMetalMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.2,
    metalness: 0.9,
  });

  const glassRailingMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.08,
    metalness: 0.4,
    transparent: true,
    opacity: 0.4,
  });

  const deckLightMat = new THREE.MeshStandardMaterial({
    color: 0x79c7d9,
    emissive: 0x79c7d9,
    emissiveIntensity: 2.0,
    roughness: 0.2,
  });

  // Overlook Platform Deck
  const deckGeo = new THREE.BoxGeometry(10, 0.4, 6);
  const deck = new THREE.Mesh(deckGeo, stonePaverMat);
  deck.position.set(0, -0.2, 0);
  root.add(deck);

  // Deck Paver Joint Lines
  const lineMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  for (let z = -2.5; z <= 2.5; z += 1.0) {
    const lineGeo = new THREE.BoxGeometry(10.02, 0.02, 0.04);
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.set(0, 0.01, z);
    root.add(line);
  }
  for (let x = -4.5; x <= 4.5; x += 1.5) {
    const lineGeo = new THREE.BoxGeometry(0.04, 0.02, 6.02);
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.set(x, 0.01, 0);
    root.add(line);
  }

  // Front Glass & Titanium Balustrade
  const frontRailing = new THREE.Group();
  frontRailing.position.set(0, 0, -2.8);

  // Titanium top handrail
  const topRailGeo = new THREE.CylinderGeometry(0.04, 0.04, 9.6, 16);
  topRailGeo.rotateZ(Math.PI / 2);
  const topRail = new THREE.Mesh(topRailGeo, railingMetalMat);
  topRail.position.set(0, 1.1, 0);
  frontRailing.add(topRail);

  // Posts
  for (let x = -4.5; x <= 4.5; x += 1.5) {
    const postGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.1, 12);
    const post = new THREE.Mesh(postGeo, railingMetalMat);
    post.position.set(x, 0.55, 0);
    frontRailing.add(post);

    // Mini recessed LED light at post base
    const ledGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.02, 12);
    const led = new THREE.Mesh(ledGeo, deckLightMat);
    led.position.set(x, 0.02, 0.15);
    frontRailing.add(led);
  }

  // Glass Panels
  for (let x = -3.75; x <= 3.75; x += 1.5) {
    const glassGeo = new THREE.BoxGeometry(1.4, 0.95, 0.02);
    const glass = new THREE.Mesh(glassGeo, glassRailingMat);
    glass.position.set(x, 0.55, 0);
    frontRailing.add(glass);
  }
  root.add(frontRailing);

  // Side Railings
  for (let side of [-1, 1]) {
    const sideRail = new THREE.Group();
    sideRail.position.set(side * 4.9, 0, 0);
    const sideTopRailGeo = new THREE.CylinderGeometry(0.04, 0.04, 5.8, 16);
    sideTopRailGeo.rotateX(Math.PI / 2);
    const sideTopRail = new THREE.Mesh(sideTopRailGeo, railingMetalMat);
    sideTopRail.position.set(0, 1.1, 0);
    sideRail.add(sideTopRail);

    for (let z = -2.5; z <= 2.5; z += 1.25) {
      const postGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.1, 12);
      const post = new THREE.Mesh(postGeo, railingMetalMat);
      post.position.set(0, 0.55, z);
      sideRail.add(post);
    }
    root.add(sideRail);
  }

  // REALISTIC STUDENT FIGURE
  const student = new THREE.Group();
  student.name = 'RealisticStudent';
  student.position.set(0, 0, -1.35); // Standing near the railing overlooking horizon

  const jacketMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.6, metalness: 0.1 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8, metalness: 0.1 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4, metalness: 0.2 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xdfad89, roughness: 0.5, metalness: 0.0 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9, metalness: 0.0 });
  const bagMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.7, metalness: 0.2 });
  const goldStrapMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.7 });

  // Feet / Sneakers
  for (let x of [-0.14, 0.14]) {
    const footGeo = new THREE.BoxGeometry(0.12, 0.09, 0.26);
    const foot = new THREE.Mesh(footGeo, shoeMat);
    foot.position.set(x, 0.045, -0.02);
    student.add(foot);
  }

  // Legs / Chinos
  for (let x of [-0.14, 0.14]) {
    const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.82, 16);
    const leg = new THREE.Mesh(legGeo, pantsMat);
    leg.position.set(x, 0.48, 0);
    student.add(leg);
  }

  // Pelvis / Hips
  const hipsGeo = new THREE.BoxGeometry(0.38, 0.18, 0.22);
  const hips = new THREE.Mesh(hipsGeo, pantsMat);
  hips.position.set(0, 0.92, 0);
  student.add(hips);

  // Torso / Jacket
  const torsoGeo = new THREE.BoxGeometry(0.42, 0.58, 0.26);
  const torso = new THREE.Mesh(torsoGeo, jacketMat);
  torso.position.set(0, 1.25, 0);
  student.add(torso);

  // Jacket Collar
  const collarGeo = new THREE.TorusGeometry(0.12, 0.03, 12, 24);
  collarGeo.rotateX(Math.PI / 2);
  const collar = new THREE.Mesh(collarGeo, jacketMat);
  collar.position.set(0, 1.55, 0.02);
  student.add(collar);

  // Arms (relaxed at sides, leaning slightly forward toward the horizon)
  for (let side of [-1, 1]) {
    const armGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.65, 14);
    const arm = new THREE.Mesh(armGeo, jacketMat);
    arm.position.set(side * 0.26, 1.22, -0.04);
    arm.rotation.x = -0.15; // slightly forward towards railing
    arm.rotation.z = side * -0.08;
    student.add(arm);

    // Hands
    const handGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const hand = new THREE.Mesh(handGeo, skinMat);
    hand.position.set(side * 0.26, 0.88, -0.08);
    student.add(hand);
  }

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.06, 0.065, 0.12, 16);
  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.position.set(0, 1.58, 0);
  student.add(neck);

  // Head
  const headGeo = new THREE.SphereGeometry(0.13, 20, 20);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.set(0, 1.72, 0);
  student.add(head);

  // Hair
  const hairGeo = new THREE.SphereGeometry(0.138, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6);
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.set(0, 1.74, -0.01);
  hair.rotation.x = -0.1;
  student.add(hair);

  // Backpack on right shoulder
  const packGeo = new THREE.BoxGeometry(0.28, 0.42, 0.18);
  const pack = new THREE.Mesh(packGeo, bagMat);
  pack.position.set(0.08, 1.26, 0.18);
  pack.rotation.z = -0.08;
  student.add(pack);

  // Backpack Straps
  const strapGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
  const strap = new THREE.Mesh(strapGeo, goldStrapMat);
  strap.position.set(0.18, 1.3, 0.05);
  strap.rotation.x = 0.35;
  student.add(strap);

  root.add(student);

  // Distant horizon silhouettes & soft geographic meridian arches
  const horizonGroup = new THREE.Group();
  horizonGroup.position.set(0, -1, -25);

  // Distant skyline buildings along the horizon
  const skylineMat = new THREE.MeshStandardMaterial({
    color: 0x0b192c,
    roughness: 0.9,
    metalness: 0.2,
  });
  const windowLightMat = new THREE.MeshBasicMaterial({ color: 0x79c7d9 });

  for (let i = -16; i <= 16; i += 1.2) {
    const height = 1.5 + Math.abs(Math.sin(i * 1.7)) * 4.5;
    const width = 0.6 + Math.abs(Math.cos(i * 2.3)) * 0.8;
    const bldgGeo = new THREE.BoxGeometry(width, height, 0.8);
    const bldg = new THREE.Mesh(bldgGeo, skylineMat);
    bldg.position.set(i + (Math.sin(i) * 0.3), height / 2, -10 + Math.cos(i) * 4);
    horizonGroup.add(bldg);

    // Glowing window dots
    if (Math.sin(i * 3) > 0) {
      const dotGeo = new THREE.BoxGeometry(0.08, 0.08, 0.82);
      const dot = new THREE.Mesh(dotGeo, windowLightMat);
      dot.position.set(i, height * 0.75, -10 + Math.cos(i) * 4);
      horizonGroup.add(dot);
    }
  }

  // Soft atmospheric geographic meridian arc curving across the sky
  const arcCurve = new THREE.EllipseCurve(0, -6, 22, 14, 0.2 * Math.PI, 0.8 * Math.PI, false, 0);
  const arcPoints = arcCurve.getPoints(64);
  const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints.map(p => new THREE.Vector3(p.x, p.y, -12)));
  const arcMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });
  const arcLine = new THREE.Line(arcGeo, arcMat);
  horizonGroup.add(arcLine);

  root.add(horizonGroup);

  return root;
}

// =========================================================================
// 2. SCENE 02: FLOATING WORLD-MAP LANDSCAPE (12–25%)
// Architectural relief continent platform, glowing conduit lines & landmark pins
// =========================================================================
function buildWorldMapLandscapeScene() {
  const root = new THREE.Group();
  root.name = 'WorldMapLandscapeScene';

  const oceanMat = new THREE.MeshStandardMaterial({
    color: 0x050d1a,
    roughness: 0.15,
    metalness: 0.8,
  });

  const continentMat = new THREE.MeshStandardMaterial({
    color: 0x172a45,
    roughness: 0.5,
    metalness: 0.4,
  });

  const elevatedTerrainMat = new THREE.MeshStandardMaterial({
    color: 0x243e63,
    roughness: 0.4,
    metalness: 0.5,
  });

  const glowPinMat = new THREE.MeshStandardMaterial({
    color: 0x79c7d9,
    emissive: 0x79c7d9,
    emissiveIntensity: 2.2,
    roughness: 0.1,
  });

  const goldPinMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 1.8,
    roughness: 0.2,
  });

  const landmarkMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.25,
    metalness: 0.85,
  });

  // Base Map Substrate Pedestal (Floating rectangular relief slab)
  const baseSlabGeo = new THREE.BoxGeometry(16, 0.4, 10);
  const baseSlab = new THREE.Mesh(baseSlabGeo, oceanMat);
  baseSlab.position.set(0, -0.2, 0);
  root.add(baseSlab);

  // Coordinate Grid lines on Ocean
  const gridLineMat = new THREE.MeshBasicMaterial({ color: 0x1e3a5f, transparent: true, opacity: 0.5 });
  for (let x = -7; x <= 7; x += 1.4) {
    const lineGeo = new THREE.BoxGeometry(0.02, 0.01, 9.6);
    const line = new THREE.Mesh(lineGeo, gridLineMat);
    line.position.set(x, 0.01, 0);
    root.add(line);
  }
  for (let z = -4; z <= 4; z += 1.3) {
    const lineGeo = new THREE.BoxGeometry(15.6, 0.01, 0.02);
    const line = new THREE.Mesh(lineGeo, gridLineMat);
    line.position.set(0, 0.01, z);
    root.add(line);
  }

  // 6 Primary Study Abroad Destination Continents & Monuments:
  // 1. UK (London): x: 0.2, z: -1.8
  // 2. Germany (Berlin/Frankfurt): x: 1.4, z: -1.7
  // 3. USA (East/West Coast): x: -4.5, z: -1.2
  // 4. Canada (Toronto/Vancouver): x: -4.2, z: -2.8
  // 5. Australia (Sydney/Melbourne): x: 5.2, z: 2.4
  // 6. New Zealand (Auckland): x: 6.8, z: 3.1

  const destinations = [
    { id: 'UK', name: 'United Kingdom', pos: [0.2, 0.1, -1.8], color: 0x79c7d9, type: 'tower' },
    { id: 'DE', name: 'Germany', pos: [1.4, 0.1, -1.7], color: 0x93c5fd, type: 'gate' },
    { id: 'US', name: 'USA', pos: [-4.5, 0.1, -1.2], color: 0x60a5fa, type: 'spire' },
    { id: 'CA', name: 'Canada', pos: [-4.2, 0.1, -2.8], color: 0x38bdf8, type: 'needle' },
    { id: 'AU', name: 'Australia', pos: [5.2, 0.1, 2.4], color: 0xf59e0b, type: 'sails' },
    { id: 'NZ', name: 'New Zealand', pos: [6.8, 0.1, 3.1], color: 0x10b981, type: 'needle' },
  ];

  // Elevated Relief Continents
  // North America
  const naGeo = new THREE.BoxGeometry(4.2, 0.15, 3.6);
  const naMesh = new THREE.Mesh(naGeo, continentMat);
  naMesh.position.set(-4.5, 0.08, -1.8);
  root.add(naMesh);

  // Europe
  const euGeo = new THREE.BoxGeometry(2.8, 0.15, 2.2);
  const euMesh = new THREE.Mesh(euGeo, continentMat);
  euMesh.position.set(0.8, 0.08, -1.8);
  root.add(euMesh);

  // Australia & NZ
  const auGeo = new THREE.BoxGeometry(2.6, 0.15, 2.0);
  const auMesh = new THREE.Mesh(auGeo, continentMat);
  auMesh.position.set(5.4, 0.08, 2.2);
  root.add(auMesh);

  // Destination Monuments and Beacons
  destinations.forEach(dest => {
    const pinGroup = new THREE.Group();
    pinGroup.position.set(dest.pos[0], dest.pos[1], dest.pos[2]);

    // Elevated hexagonal base
    const hexGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.12, 6);
    const hexMesh = new THREE.Mesh(hexGeo, elevatedTerrainMat);
    pinGroup.add(hexMesh);

    // Glowing base ring
    const ringGeo = new THREE.TorusGeometry(0.36, 0.02, 8, 24);
    ringGeo.rotateX(Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, glowPinMat);
    ringMesh.position.y = 0.06;
    pinGroup.add(ringMesh);

    // Architectural Landmark Silhouette
    if (dest.type === 'tower') { // UK Big Ben clock tower
      const bldgGeo = new THREE.BoxGeometry(0.18, 0.8, 0.18);
      const bldg = new THREE.Mesh(bldgGeo, landmarkMat);
      bldg.position.y = 0.46;
      pinGroup.add(bldg);
      const roofGeo = new THREE.ConeGeometry(0.14, 0.35, 4);
      roofGeo.rotateY(Math.PI / 4);
      const roof = new THREE.Mesh(roofGeo, goldPinMat);
      roof.position.y = 1.0;
      pinGroup.add(roof);
    } else if (dest.type === 'needle') { // CN Tower / Sky Tower
      const needleBaseGeo = new THREE.CylinderGeometry(0.08, 0.14, 0.6, 12);
      const needleBase = new THREE.Mesh(needleBaseGeo, landmarkMat);
      needleBase.position.y = 0.36;
      pinGroup.add(needleBase);
      const podGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.08, 16);
      const pod = new THREE.Mesh(podGeo, glowPinMat);
      pod.position.y = 0.7;
      pinGroup.add(pod);
      const mastGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
      const mast = new THREE.Mesh(mastGeo, landmarkMat);
      mast.position.y = 0.98;
      pinGroup.add(mast);
    } else if (dest.type === 'sails') { // Sydney Opera House sails
      for (let s of [-0.08, 0.08]) {
        const sailGeo = new THREE.ConeGeometry(0.16, 0.5, 3);
        sailGeo.rotateZ(0.2 * Math.sign(s));
        const sail = new THREE.Mesh(sailGeo, landmarkMat);
        sail.position.set(s, 0.32, 0);
        pinGroup.add(sail);
      }
    } else if (dest.type === 'gate') { // Brandenburg Gate
      const beamGeo = new THREE.BoxGeometry(0.45, 0.06, 0.12);
      const beam = new THREE.Mesh(beamGeo, landmarkMat);
      beam.position.y = 0.65;
      pinGroup.add(beam);
      for (let col = -0.18; col <= 0.18; col += 0.09) {
        const colGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.55, 8);
        const colMesh = new THREE.Mesh(colGeo, landmarkMat);
        colMesh.position.set(col, 0.34, 0);
        pinGroup.add(colMesh);
      }
    } else { // Spire
      const spireGeo = new THREE.ConeGeometry(0.12, 0.9, 8);
      const spire = new THREE.Mesh(spireGeo, landmarkMat);
      spire.position.y = 0.52;
      pinGroup.add(spire);
    }

    // Floating optical destination beacon beacon
    const beaconGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const beacon = new THREE.Mesh(beaconGeo, glowPinMat);
    beacon.position.y = 1.35;
    pinGroup.add(beacon);

    root.add(pinGroup);
  });

  // Glowing optical conduit flight paths connecting continents
  const flightPaths = [
    [[-4.5, 0.2, -1.2], [0.2, 0.2, -1.8]], // USA -> UK
    [[0.2, 0.2, -1.8], [1.4, 0.2, -1.7]], // UK -> Germany
    [[1.4, 0.2, -1.7], [5.2, 0.2, 2.4]], // Germany -> Australia
    [[5.2, 0.2, 2.4], [6.8, 0.2, 3.1]], // Australia -> NZ
    [[-4.2, 0.2, -2.8], [0.2, 0.2, -1.8]], // Canada -> UK
  ];

  flightPaths.forEach(pts => {
    const p1 = new THREE.Vector3(...pts[0]);
    const p2 = new THREE.Vector3(...pts[1]);
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    mid.y += p1.distanceTo(p2) * 0.28; // Arc curvature

    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    const curvePts = curve.getPoints(36);
    const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePts);
    const curveMat = new THREE.LineBasicMaterial({ color: 0x79c7d9, transparent: true, opacity: 0.65 });
    const arc = new THREE.Line(curveGeo, curveMat);
    root.add(arc);
  });

  return root;
}

// =========================================================================
// 3. SCENE 04 & 05: APPLICATION DESK & VISA (38–60%)
// Physical study desk with laptop, admission letter, passport, pen, and phone
// =========================================================================
function buildApplicationDeskScene() {
  const root = new THREE.Group();
  root.name = 'ApplicationDeskScene';

  const deskWoodMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.7,
    metalness: 0.15,
  });

  const metalAluminumMat = new THREE.MeshStandardMaterial({
    color: 0xcfd8dc,
    roughness: 0.25,
    metalness: 0.9,
  });

  const laptopScreenGlowMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.6,
    roughness: 0.1,
  });

  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.85,
    metalness: 0.05,
  });

  const goldSealMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    emissive: 0xb45309,
    emissiveIntensity: 1.4,
    roughness: 0.25,
    metalness: 0.85,
  });

  const passportNavyMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.45,
    metalness: 0.3,
  });

  const penGoldMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.95,
  });

  const phoneBlackMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.15,
    metalness: 0.8,
  });

  // Desk Surface
  const tableGeo = new THREE.BoxGeometry(6.4, 0.18, 4.2);
  const table = new THREE.Mesh(tableGeo, deskWoodMat);
  table.position.set(0, -0.09, 0);
  root.add(table);

  // Modern Desk Mat / Blotter
  const matGeo = new THREE.BoxGeometry(4.2, 0.015, 2.6);
  const deskMatMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
  const deskMat = new THREE.Mesh(matGeo, deskMatMat);
  deskMat.position.set(-0.2, 0.008, 0.1);
  root.add(deskMat);

  // A. SLEEK LAPTOP
  const laptop = new THREE.Group();
  laptop.position.set(-0.9, 0.01, -0.2);
  laptop.rotation.y = 0.15;

  // Base / Keyboard chassis
  const laptopBaseGeo = new THREE.BoxGeometry(1.4, 0.03, 0.95);
  const laptopBase = new THREE.Mesh(laptopBaseGeo, metalAluminumMat);
  laptopBase.position.y = 0.015;
  laptop.add(laptopBase);

  // Keyboard inset
  const kbGeo = new THREE.BoxGeometry(1.25, 0.005, 0.5);
  const kbMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.6 });
  const kb = new THREE.Mesh(kbGeo, kbMat);
  kb.position.set(0, 0.032, -0.15);
  laptop.add(kb);

  // Trackpad
  const padGeo = new THREE.BoxGeometry(0.48, 0.004, 0.32);
  const pad = new THREE.Mesh(padGeo, metalAluminumMat);
  pad.position.set(0, 0.032, 0.24);
  laptop.add(pad);

  // Open Screen Lid (hinged at back)
  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, 0.03, -0.47);
  lidGroup.rotation.x = -0.32; // Open angled screen

  const lidBackGeo = new THREE.BoxGeometry(1.4, 0.95, 0.02);
  const lidBack = new THREE.Mesh(lidBackGeo, metalAluminumMat);
  lidBack.position.set(0, 0.47, 0);
  lidGroup.add(lidBack);

  // Screen display showing admission application
  const screenGeo = new THREE.BoxGeometry(1.32, 0.88, 0.008);
  const screen = new THREE.Mesh(screenGeo, laptopScreenGlowMat);
  screen.position.set(0, 0.47, 0.012);
  lidGroup.add(screen);

  laptop.add(lidGroup);
  root.add(laptop);

  // B. OFFICIAL OFFER / ADMISSION LETTER (Document)
  const docGroup = new THREE.Group();
  docGroup.position.set(0.85, 0.01, 0.2);
  docGroup.rotation.y = -0.12;

  // Document paper sheet
  const sheetGeo = new THREE.BoxGeometry(0.85, 0.008, 1.2);
  const sheet = new THREE.Mesh(sheetGeo, paperMat);
  sheet.position.y = 0.004;
  docGroup.add(sheet);

  // Embossed Golden University Seal
  const sealGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.015, 24);
  const seal = new THREE.Mesh(sealGeo, goldSealMat);
  seal.position.set(0.24, 0.012, -0.42);
  docGroup.add(seal);

  // Document Heading & Text Bars
  const textBarMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
  const headingGeo = new THREE.BoxGeometry(0.45, 0.002, 0.035);
  const heading = new THREE.Mesh(headingGeo, textBarMat);
  heading.position.set(-0.1, 0.009, -0.42);
  docGroup.add(heading);

  for (let z = -0.3; z <= 0.4; z += 0.08) {
    const barWidth = 0.65 - Math.sin(z * 4) * 0.1;
    const barGeo = new THREE.BoxGeometry(barWidth, 0.002, 0.02);
    const bar = new THREE.Mesh(barGeo, textBarMat);
    bar.position.set(0, 0.009, z);
    docGroup.add(bar);
  }

  // Acceptance stamp: "OFFER APPROVED"
  const stampMat = new THREE.MeshBasicMaterial({ color: 0x059669 });
  const stampGeo = new THREE.BoxGeometry(0.38, 0.003, 0.12);
  const stamp = new THREE.Mesh(stampGeo, stampMat);
  stamp.position.set(0.15, 0.012, 0.35);
  stamp.rotation.y = -0.15;
  docGroup.add(stamp);

  root.add(docGroup);

  // C. PASSPORT BOOKLET
  const passport = new THREE.Group();
  passport.position.set(0.65, 0.01, -0.7);
  passport.rotation.y = 0.22;

  // Passport cover
  const passCoverGeo = new THREE.BoxGeometry(0.55, 0.025, 0.78);
  const passCover = new THREE.Mesh(passCoverGeo, passportNavyMat);
  passCover.position.y = 0.012;
  passport.add(passCover);

  // Gold foil coat of arms crest on passport
  const crestGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.006, 16);
  const crest = new THREE.Mesh(crestGeo, goldSealMat);
  crest.position.set(0, 0.026, -0.08);
  passport.add(crest);

  // Gold text bars on passport cover
  const passTextGeo = new THREE.BoxGeometry(0.32, 0.004, 0.03);
  const passText = new THREE.Mesh(passTextGeo, goldSealMat);
  passText.position.set(0, 0.026, 0.2);
  passport.add(passText);

  // Holographic Visa verification beam / emitter over passport
  const holoBeamGeo = new THREE.CylinderGeometry(0.28, 0.02, 0.8, 24);
  const holoBeamMat = new THREE.MeshBasicMaterial({
    color: 0x79c7d9,
    transparent: true,
    opacity: 0.3,
  });
  const holoBeam = new THREE.Mesh(holoBeamGeo, holoBeamMat);
  holoBeam.position.set(0, 0.42, 0);
  passport.add(holoBeam);

  root.add(passport);

  // D. LUXURY FOUNTAIN PEN
  const pen = new THREE.Group();
  pen.position.set(-0.15, 0.02, 0.85);
  pen.rotation.y = 0.65;

  const barrelGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 16);
  barrelGeo.rotateZ(Math.PI / 2);
  const barrel = new THREE.Mesh(barrelGeo, penGoldMat);
  pen.add(barrel);

  const nibGeo = new THREE.ConeGeometry(0.02, 0.08, 12);
  nibGeo.rotateZ(-Math.PI / 2);
  const nib = new THREE.Mesh(nibGeo, penGoldMat);
  nib.position.x = 0.34;
  pen.add(nib);
  root.add(pen);

  // E. SMARTPHONE
  const phone = new THREE.Group();
  phone.position.set(-1.6, 0.01, 0.45);
  phone.rotation.y = -0.2;

  const phoneGeo = new THREE.BoxGeometry(0.38, 0.018, 0.75);
  const phoneMesh = new THREE.Mesh(phoneGeo, phoneBlackMat);
  phoneMesh.position.y = 0.009;
  phone.add(phoneMesh);

  const phoneScreenGeo = new THREE.BoxGeometry(0.34, 0.004, 0.7);
  const phoneScreenMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const phoneScreen = new THREE.Mesh(phoneScreenGeo, phoneScreenMat);
  phoneScreen.position.y = 0.02;
  phone.add(phoneScreen);

  root.add(phone);

  return root;
}

// =========================================================================
// 4. SCENE 06 & 07: AIRPORT TERMINAL & FLIGHT WINDOW (60–80%)
// Airport concourse, departure board, and passenger cabin window looking outside
// =========================================================================
function buildAirportTerminalScene() {
  const root = new THREE.Group();
  root.name = 'AirportTerminalScene';

  const terrazzoFloorMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.15,
    metalness: 0.6,
  });

  const steelStructureMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.3,
    metalness: 0.85,
  });

  const terminalGlassMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.05,
    metalness: 0.3,
    transparent: true,
    opacity: 0.25,
  });

  const fidBoardMat = new THREE.MeshStandardMaterial({
    color: 0x020617,
    roughness: 0.8,
  });

  const fidTextGlowMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
  });

  const cabinWallMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.6,
    metalness: 0.1,
  });

  const windowBevelMat = new THREE.MeshStandardMaterial({
    color: 0xcfd8dc,
    roughness: 0.3,
    metalness: 0.4,
  });

  const wingAluminumMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.2,
    metalness: 0.85,
  });

  // Concourse Terrazzo Floor
  const floorGeo = new THREE.BoxGeometry(14, 0.2, 10);
  const floor = new THREE.Mesh(floorGeo, terrazzoFloorMat);
  floor.position.set(0, -0.1, 0);
  root.add(floor);

  // Grand Airport Glass Curtain Wall & Truss Mullions
  const wallGroup = new THREE.Group();
  wallGroup.position.set(0, 0, -4.5);

  const glassWallGeo = new THREE.BoxGeometry(14, 6, 0.05);
  const glassWall = new THREE.Mesh(glassWallGeo, terminalGlassMat);
  glassWall.position.y = 3;
  wallGroup.add(glassWall);

  // Vertical Steel Mullions
  for (let x = -6; x <= 6; x += 2.0) {
    const mullionGeo = new THREE.BoxGeometry(0.12, 6, 0.25);
    const mullion = new THREE.Mesh(mullionGeo, steelStructureMat);
    mullion.position.set(x, 3, 0);
    wallGroup.add(mullion);
  }

  // Horizontal Transoms
  for (let y = 1.5; y <= 5.5; y += 1.5) {
    const transomGeo = new THREE.BoxGeometry(14, 0.1, 0.15);
    const transom = new THREE.Mesh(transomGeo, steelStructureMat);
    transom.position.set(0, y, 0);
    wallGroup.add(transom);
  }
  root.add(wallGroup);

  // Flight Information Departure Board (FID) suspended from ceiling
  const fidGroup = new THREE.Group();
  fidGroup.position.set(-2.5, 3.6, -2.5);
  fidGroup.rotation.y = 0.25;

  const boardHousingGeo = new THREE.BoxGeometry(3.6, 1.6, 0.2);
  const boardHousing = new THREE.Mesh(boardHousingGeo, fidBoardMat);
  fidGroup.add(boardHousing);

  // Flight rows on FID
  for (let r = -0.55; r <= 0.55; r += 0.24) {
    const rowGeo = new THREE.BoxGeometry(3.2, 0.08, 0.02);
    const row = new THREE.Mesh(rowGeo, fidTextGlowMat);
    row.position.set(0, r, 0.11);
    fidGroup.add(row);
  }
  root.add(fidGroup);

  // B. CABIN WINDOW MODULE (For Scene 07: Stratospheric Flight)
  const cabinModule = new THREE.Group();
  cabinModule.name = 'CabinWindowModule';
  cabinModule.position.set(0, 1.2, 2.5); // Positioned for close camera vantage

  // Contoured airplane cabin interior wall
  const cabinWallGeo = new THREE.BoxGeometry(4.2, 3.2, 0.25);
  const cabinWall = new THREE.Mesh(cabinWallGeo, cabinWallMat);
  cabinWall.position.set(0, 0, 0);
  cabinModule.add(cabinWall);

  // Oval Aircraft Window Opening (Double Bevel)
  const windowFrameOuterGeo = new THREE.TorusGeometry(0.65, 0.08, 16, 32);
  const windowFrameOuter = new THREE.Mesh(windowFrameOuterGeo, windowBevelMat);
  windowFrameOuter.position.set(0, 0, 0.13);
  cabinModule.add(windowFrameOuter);

  const windowGlassGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.02, 32);
  windowGlassGeo.rotateX(Math.PI / 2);
  const windowGlass = new THREE.Mesh(windowGlassGeo, terminalGlassMat);
  windowGlass.position.set(0, 0, 0.04);
  cabinModule.add(windowGlass);

  // Airplane Wing visible through the window outside
  const wingGroup = new THREE.Group();
  wingGroup.position.set(1.8, -0.6, -4.0);
  wingGroup.rotation.set(-0.08, -0.4, 0.12);

  const wingGeo = new THREE.BoxGeometry(5.5, 0.08, 1.4);
  const wing = new THREE.Mesh(wingGeo, wingAluminumMat);
  wingGroup.add(wing);

  // Winglet
  const wingletGeo = new THREE.BoxGeometry(0.08, 0.8, 0.6);
  const winglet = new THREE.Mesh(wingletGeo, wingAluminumMat);
  winglet.position.set(2.7, 0.4, 0.2);
  wingGroup.add(winglet);

  // Jet Engine Nacelle below wing
  const engineGeo = new THREE.CylinderGeometry(0.38, 0.34, 1.8, 24);
  engineGeo.rotateZ(Math.PI / 2);
  const engine = new THREE.Mesh(engineGeo, wingAluminumMat);
  engine.position.set(0.6, -0.5, 0.2);
  wingGroup.add(engine);

  cabinModule.add(wingGroup);

  root.add(cabinModule);

  return root;
}

// =========================================================================
// 5. SCENE 10: FUTURE HORIZON & METROPOLITAN SKYLINE (96–100%)
// Soaring modern glass towers, skyscrapers, bridges, and glowing dusk horizon
// =========================================================================
function buildFutureSkylineScene() {
  const root = new THREE.Group();
  root.name = 'FutureSkylineScene';

  const towerGlassMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a5f,
    roughness: 0.1,
    metalness: 0.9,
  });

  const towerFrameMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.4,
    metalness: 0.7,
  });

  const litWindowMat = new THREE.MeshBasicMaterial({
    color: 0x79c7d9,
  });

  const warmSunsetWindowMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
  });

  const plazaMat = new THREE.MeshStandardMaterial({
    color: 0x090f1d,
    roughness: 0.3,
    metalness: 0.5,
  });

  // Waterfront / Plaza Foreground
  const plazaGeo = new THREE.BoxGeometry(20, 0.3, 12);
  const plaza = new THREE.Mesh(plazaGeo, plazaMat);
  plaza.position.set(0, -0.15, 0);
  root.add(plaza);

  // Modern Skyscrapers Cluster
  const towersData = [
    { x: -5.5, z: -4, w: 1.8, d: 1.8, h: 8.5, spires: true },
    { x: -3.2, z: -5.5, w: 1.6, d: 1.5, h: 11.2, spires: true },
    { x: -1.2, z: -4.5, w: 2.2, d: 2.0, h: 9.8, spires: false },
    { x: 1.2, z: -5.0, w: 1.9, d: 1.9, h: 13.5, spires: true }, // Landmark supertall tower
    { x: 3.5, z: -4.2, w: 1.7, d: 1.6, h: 10.4, spires: false },
    { x: 5.8, z: -5.5, w: 2.0, d: 1.8, h: 8.0, spires: true },
    // Background layer
    { x: -4.0, z: -8, w: 2.4, d: 2.2, h: 14.0, spires: false },
    { x: 0.0, z: -9, w: 2.8, d: 2.5, h: 16.0, spires: true },
    { x: 4.2, z: -8, w: 2.2, d: 2.0, h: 12.8, spires: false },
  ];

  towersData.forEach(t => {
    const towerGroup = new THREE.Group();
    towerGroup.position.set(t.x, 0, t.z);

    // Main tower shaft
    const shaftGeo = new THREE.BoxGeometry(t.w, t.h, t.d);
    const shaft = new THREE.Mesh(shaftGeo, towerGlassMat);
    shaft.position.y = t.h / 2;
    towerGroup.add(shaft);

    // Structural frame edges
    const frameGeo = new THREE.BoxGeometry(t.w + 0.04, t.h, t.d + 0.04);
    const frame = new THREE.Mesh(frameGeo, towerFrameMat);
    frame.position.y = t.h / 2;
    towerGroup.add(frame);

    // Glowing window strips
    for (let y = 1.0; y < t.h - 0.8; y += 1.4) {
      const isWarm = Math.sin(t.x + y) > 0.2;
      const winGeo = new THREE.BoxGeometry(t.w + 0.06, 0.35, t.d + 0.06);
      const win = new THREE.Mesh(winGeo, isWarm ? warmSunsetWindowMat : litWindowMat);
      win.position.y = y;
      towerGroup.add(win);
    }

    // Architectural Spire / Crown
    if (t.spires) {
      const spireGeo = new THREE.ConeGeometry(0.18, 2.4, 8);
      const spireMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 });
      const spire = new THREE.Mesh(spireGeo, spireMat);
      spire.position.y = t.h + 1.2;
      towerGroup.add(spire);

      // Warning beacon light atop spire
      const beaconGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = t.h + 2.4;
      towerGroup.add(beacon);
    }

    root.add(towerGroup);
  });

  return root;
}

// =========================================================================
// EXECUTE GENERATION OF ALL AMBITION TO ARRIVAL ASSETS
// =========================================================================
async function run() {
  console.log('Generating "FROM AMBITION TO ARRIVAL" 3D GLB assets...');

  const lookout = buildLookoutStudentScene();
  await saveGLB(lookout, path.join(__dirname, 'public', 'assets', '3d', 'lookout', 'lookout_student.glb'));

  const worldmap = buildWorldMapLandscapeScene();
  await saveGLB(worldmap, path.join(__dirname, 'public', 'assets', '3d', 'worldmap', 'worldmap_landscape.glb'));

  const desk = buildApplicationDeskScene();
  await saveGLB(desk, path.join(__dirname, 'public', 'assets', '3d', 'desk', 'application_desk.glb'));

  const airport = buildAirportTerminalScene();
  await saveGLB(airport, path.join(__dirname, 'public', 'assets', '3d', 'airport', 'airport_terminal.glb'));

  const future = buildFutureSkylineScene();
  await saveGLB(future, path.join(__dirname, 'public', 'assets', '3d', 'future', 'future_skyline.glb'));

  console.log('Successfully generated all cinematic 3D GLB assets for "FROM AMBITION TO ARRIVAL"!');
}

run().catch(err => {
  console.error('Error generating ambition assets:', err);
  process.exit(1);
});
