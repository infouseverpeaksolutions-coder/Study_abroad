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

function saveGLB(scene, filePath) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (glb) => {
        fs.writeFileSync(filePath, Buffer.from(glb));
        console.log(`Exported GLB to ${filePath} (${(fs.statSync(filePath).size / 1024).toFixed(1)} KB)`);
        resolve();
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}

// -------------------------------------------------------------
// 1. BUILD REALISTIC AIRPLANE GLB
// -------------------------------------------------------------
function buildAirplaneScene() {
  const root = new THREE.Group();
  root.name = 'Airplane';

  // PBR Materials
  const fuselageMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.22,
    metalness: 0.8,
    name: 'Aircraft_Body_PBR'
  });

  const liveryNavyMat = new THREE.MeshStandardMaterial({
    color: 0x091b38,
    roughness: 0.25,
    metalness: 0.7,
    name: 'Livery_Navy'
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.12,
    metalness: 0.95,
    name: 'Polished_Chrome'
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x0f2744,
    roughness: 0.05,
    metalness: 0.9,
    name: 'Cockpit_Glass'
  });

  const engineIntakeMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.5,
    metalness: 0.8,
    name: 'Engine_Intake'
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.3,
    metalness: 0.85,
    name: 'Gold_Accent'
  });

  // A. Fuselage
  const fuselageGeo = new THREE.CylinderGeometry(0.32, 0.26, 4.4, 32);
  fuselageGeo.rotateX(Math.PI / 2);
  const fuselage = new THREE.Mesh(fuselageGeo, fuselageMat);
  root.add(fuselage);

  // Nose Cone (Streamlined radome)
  const noseGeo = new THREE.ConeGeometry(0.32, 1.0, 32);
  noseGeo.rotateX(-Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, fuselageMat);
  nose.position.set(0, 0, -2.7);
  root.add(nose);

  // Tail Cone
  const tailConeGeo = new THREE.ConeGeometry(0.26, 1.2, 32);
  tailConeGeo.rotateX(Math.PI / 2);
  const tailCone = new THREE.Mesh(tailConeGeo, fuselageMat);
  tailCone.position.set(0, 0.04, 2.8);
  root.add(tailCone);

  // Cockpit Windshield (Multi-panel faceted glass)
  const cockpitGeo = new THREE.BoxGeometry(0.34, 0.18, 0.55);
  const cockpit = new THREE.Mesh(cockpitGeo, glassMat);
  cockpit.position.set(0, 0.21, -2.15);
  cockpit.rotation.x = 0.38;
  root.add(cockpit);

  // Cabin Windows (Rhythmic passenger port strips)
  for (let side of [-1, 1]) {
    for (let z = -1.4; z <= 1.4; z += 0.25) {
      const winGeo = new THREE.BoxGeometry(0.04, 0.06, 0.12);
      const win = new THREE.Mesh(winGeo, glassMat);
      win.position.set(side * 0.315, 0.08, z);
      root.add(win);
    }
  }

  // Livery Cheatline stripe along fuselage
  for (let side of [-1, 1]) {
    const stripeGeo = new THREE.BoxGeometry(0.03, 0.05, 3.6);
    const stripe = new THREE.Mesh(stripeGeo, liveryNavyMat);
    stripe.position.set(side * 0.32, -0.02, 0);
    root.add(stripe);

    const goldStripeGeo = new THREE.BoxGeometry(0.03, 0.015, 3.6);
    const goldStripe = new THREE.Mesh(goldStripeGeo, goldAccentMat);
    goldStripe.position.set(side * 0.321, 0.018, 0);
    root.add(goldStripe);
  }

  // B. Main Swept Wings
  const wingGroup = new THREE.Group();
  for (let side of [-1, 1]) {
    // Main wing blade
    const wingGeo = new THREE.BoxGeometry(3.6, 0.045, 0.95);
    const wing = new THREE.Mesh(wingGeo, fuselageMat);
    wing.position.set(side * 2.0, -0.05, 0.25);
    wing.rotation.y = side * -0.24; // Swept back
    wing.rotation.z = side * 0.045; // Dihedral angle
    wingGroup.add(wing);

    // Chrome leading edge slat
    const slatGeo = new THREE.BoxGeometry(3.6, 0.05, 0.12);
    const slat = new THREE.Mesh(slatGeo, chromeMat);
    slat.position.set(side * 2.0, -0.05, -0.22);
    slat.rotation.y = side * -0.24;
    slat.rotation.z = side * 0.045;
    wingGroup.add(slat);

    // Raked Blended Winglet
    const wingletGeo = new THREE.BoxGeometry(0.05, 0.48, 0.38);
    const winglet = new THREE.Mesh(wingletGeo, liveryNavyMat);
    winglet.position.set(side * 3.75, 0.22, 0.55);
    winglet.rotation.z = side * 0.55;
    winglet.rotation.y = side * -0.15;
    wingGroup.add(winglet);

    // Navigation strobe light (Red on port/left, Green on starboard/right)
    const navLightGeo = new THREE.SphereGeometry(0.03, 12, 12);
    const navLightMat = new THREE.MeshBasicMaterial({
      color: side === -1 ? 0xef4444 : 0x10b981
    });
    const navLight = new THREE.Mesh(navLightGeo, navLightMat);
    navLight.position.set(side * 3.82, 0.44, 0.55);
    wingGroup.add(navLight);
  }
  root.add(wingGroup);

  // C. Turbofan Jet Engines
  for (let side of [-1, 1]) {
    const engine = new THREE.Group();
    engine.position.set(side * 1.15, -0.38, -0.1);

    // Pylon Mount
    const pylonGeo = new THREE.BoxGeometry(0.08, 0.22, 0.8);
    const pylon = new THREE.Mesh(pylonGeo, fuselageMat);
    pylon.position.set(0, 0.15, 0.05);
    engine.add(pylon);

    // Nacelle Casing
    const nacelleGeo = new THREE.CylinderGeometry(0.24, 0.21, 1.25, 28);
    nacelleGeo.rotateX(Math.PI / 2);
    const nacelle = new THREE.Mesh(nacelleGeo, fuselageMat);
    engine.add(nacelle);

    // Chrome intake ring lip
    const cowlRingGeo = new THREE.TorusGeometry(0.23, 0.02, 16, 32);
    const cowlRing = new THREE.Mesh(cowlRingGeo, chromeMat);
    cowlRing.position.set(0, 0, -0.63);
    engine.add(cowlRing);

    // Fan Face / Spinner Core
    const spinnerGeo = new THREE.ConeGeometry(0.06, 0.18, 16);
    spinnerGeo.rotateX(-Math.PI / 2);
    const spinner = new THREE.Mesh(spinnerGeo, chromeMat);
    spinner.position.set(0, 0, -0.5);
    engine.add(spinner);

    const fanFaceGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.05, 24);
    fanFaceGeo.rotateX(Math.PI / 2);
    const fanFace = new THREE.Mesh(fanFaceGeo, engineIntakeMat);
    fanFace.position.set(0, 0, -0.52);
    engine.add(fanFace);

    // Exhaust Nozzle
    const exhaustGeo = new THREE.CylinderGeometry(0.16, 0.19, 0.35, 24);
    exhaustGeo.rotateX(Math.PI / 2);
    const exhaust = new THREE.Mesh(exhaustGeo, chromeMat);
    exhaust.position.set(0, 0, 0.65);
    engine.add(exhaust);

    root.add(engine);
  }

  // D. Tail Empennage
  // Vertical Stabilizer Fin
  const vertFinGeo = new THREE.BoxGeometry(0.06, 1.35, 0.9);
  const vertFin = new THREE.Mesh(vertFinGeo, liveryNavyMat);
  vertFin.position.set(0, 0.85, 2.3);
  vertFin.rotation.x = 0.45;
  root.add(vertFin);

  // Horizontal Tailplanes
  for (let side of [-1, 1]) {
    const horizGeo = new THREE.BoxGeometry(1.2, 0.035, 0.55);
    const horiz = new THREE.Mesh(horizGeo, fuselageMat);
    horiz.position.set(side * 0.72, 0.22, 2.5);
    horiz.rotation.y = side * -0.22;
    horiz.rotation.z = side * 0.05;
    root.add(horiz);
  }

  return root;
}

// -------------------------------------------------------------
// 2. BUILD REALISTIC UNIVERSITY CAMPUS GLB
// -------------------------------------------------------------
function buildCampusScene() {
  const root = new THREE.Group();
  root.name = 'CampusEnvironment';

  // Architectural Materials
  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8, // Portland limestone
    roughness: 0.65,
    metalness: 0.1,
    name: 'Campus_Limestone'
  });

  const brickMat = new THREE.MeshStandardMaterial({
    color: 0x7c2d12, // Red academic brick
    roughness: 0.8,
    metalness: 0.05,
    name: 'Academic_Brick'
  });

  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x334155, // Dark slate roof
    roughness: 0.45,
    metalness: 0.2,
    name: 'Slate_Roof'
  });

  const copperMat = new THREE.MeshStandardMaterial({
    color: 0x0f766e, // Aged copper dome
    roughness: 0.35,
    metalness: 0.4,
    name: 'Copper_Dome'
  });

  const darkGlassMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.1,
    metalness: 0.9,
    name: 'Curtain_Wall_Glass'
  });

  const illuminatedWinMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfde047,
    emissiveIntensity: 0.8,
    roughness: 0.2,
    name: 'Illuminated_Window'
  });

  const asphaltMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.85,
    metalness: 0.1,
    name: 'Road_Asphalt'
  });

  const pavingMat = new THREE.MeshStandardMaterial({
    color: 0xa1a1aa,
    roughness: 0.7,
    metalness: 0.15,
    name: 'Granite_Paving'
  });

  const lawnMat = new THREE.MeshStandardMaterial({
    color: 0x14532d, // Manicured campus lawn
    roughness: 0.9,
    metalness: 0.0,
    name: 'Campus_Lawn'
  });

  const treeFoliageMat = new THREE.MeshStandardMaterial({
    color: 0x166534,
    roughness: 0.8,
    metalness: 0.0,
    name: 'Tree_Foliage'
  });

  const treeBarkMat = new THREE.MeshStandardMaterial({
    color: 0x3f2e21,
    roughness: 0.9,
    metalness: 0.0,
    name: 'Tree_Bark'
  });

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.3,
    metalness: 0.85,
    name: 'Cast_Iron'
  });

  const carPaintMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.15,
    metalness: 0.85,
    name: 'Car_Paint'
  });

  // A. Grounds: Lawn, Driveway, and Walkways
  // Base ground lawn
  const lawnGeo = new THREE.PlaneGeometry(36, 30);
  lawnGeo.rotateX(-Math.PI / 2);
  const lawn = new THREE.Mesh(lawnGeo, lawnMat);
  lawn.position.set(0, 0, 2);
  root.add(lawn);

  // Curving asphalt entrance roadway
  const roadGeo = new THREE.PlaneGeometry(5.0, 28);
  roadGeo.rotateX(-Math.PI / 2);
  const road = new THREE.Mesh(roadGeo, asphaltMat);
  road.position.set(0, 0.01, 8);
  root.add(road);

  // Central Grand Flagstone Plaza & Walkway
  const plazaGeo = new THREE.PlaneGeometry(12, 10);
  plazaGeo.rotateX(-Math.PI / 2);
  const plaza = new THREE.Mesh(plazaGeo, pavingMat);
  plaza.position.set(0, 0.02, -1);
  root.add(plaza);

  // Concrete Curbs
  for (let side of [-2.55, 2.55]) {
    const curbGeo = new THREE.BoxGeometry(0.18, 0.12, 28);
    const curb = new THREE.Mesh(curbGeo, stoneMat);
    curb.position.set(side, 0.06, 8);
    root.add(curb);
  }

  // B. Grand Neoclassical University Hall (Centerpiece)
  const mainHall = new THREE.Group();
  mainHall.position.set(0, 0, -6.5);

  // Marble Staircase (5 stepped levels)
  for (let step = 0; step < 5; step++) {
    const stepGeo = new THREE.BoxGeometry(7.2 - step * 0.2, 0.16, 2.4 - step * 0.35);
    const stepMesh = new THREE.Mesh(stepGeo, stoneMat);
    stepMesh.position.set(0, step * 0.16 + 0.08, 1.2 - step * 0.18);
    mainHall.add(stepMesh);
  }

  // Grand Portico Base & Podium
  const podiumGeo = new THREE.BoxGeometry(16, 0.8, 8);
  const podium = new THREE.Mesh(podiumGeo, stoneMat);
  podium.position.set(0, 0.4, -2);
  mainHall.add(podium);

  // Main Building Structure
  const mainBodyGeo = new THREE.BoxGeometry(15, 6.0, 7);
  const mainBody = new THREE.Mesh(mainBodyGeo, brickMat);
  mainBody.position.set(0, 3.8, -2);
  mainHall.add(mainBody);

  // Classical Columns (6 Ionic/Corinthian columns across facade)
  for (let i = 0; i < 6; i++) {
    const x = -3.2 + i * 1.28;
    const colGeo = new THREE.CylinderGeometry(0.18, 0.22, 5.0, 20);
    const col = new THREE.Mesh(colGeo, stoneMat);
    col.position.set(x, 3.3, 1.6);
    mainHall.add(col);

    // Column Base & Capital
    const baseGeo = new THREE.BoxGeometry(0.5, 0.2, 0.5);
    const base = new THREE.Mesh(baseGeo, stoneMat);
    base.position.set(x, 0.9, 1.6);
    mainHall.add(base);

    const capGeo = new THREE.BoxGeometry(0.5, 0.2, 0.5);
    const cap = new THREE.Mesh(capGeo, stoneMat);
    cap.position.set(x, 5.8, 1.6);
    mainHall.add(cap);
  }

  // Entablature (Stone beam above columns)
  const entablatureGeo = new THREE.BoxGeometry(7.6, 0.6, 1.4);
  const entablature = new THREE.Mesh(entablatureGeo, stoneMat);
  entablature.position.set(0, 6.1, 1.6);
  mainHall.add(entablature);

  // Classical Triangular Pediment
  const pedimentShape = new THREE.Shape();
  pedimentShape.moveTo(-3.8, 0);
  pedimentShape.lineTo(3.8, 0);
  pedimentShape.lineTo(0, 1.8);
  pedimentShape.closePath();

  const pedimentGeo = new THREE.ExtrudeGeometry(pedimentShape, { depth: 0.6, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08 });
  const pediment = new THREE.Mesh(pedimentGeo, stoneMat);
  pediment.position.set(0, 6.4, 1.6);
  mainHall.add(pediment);

  // Copper Central Dome / Observatory
  const domeBaseGeo = new THREE.CylinderGeometry(2.0, 2.2, 1.2, 24);
  const domeBase = new THREE.Mesh(domeBaseGeo, stoneMat);
  domeBase.position.set(0, 7.4, -2);
  mainHall.add(domeBase);

  const domeGeo = new THREE.SphereGeometry(2.0, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Mesh(domeGeo, copperMat);
  dome.position.set(0, 8.0, -2);
  mainHall.add(dome);

  // Grand Entrance Oak Arch Doors
  const doorGeo = new THREE.BoxGeometry(2.2, 3.2, 0.2);
  const door = new THREE.Mesh(doorGeo, illuminatedWinMat);
  door.position.set(0, 2.4, 1.45);
  mainHall.add(door);

  // Facade Windows Array with Warm Interior Illumination
  for (let floor = 1; floor <= 2; floor++) {
    for (let wx = -6.0; wx <= 6.0; wx += 1.8) {
      if (Math.abs(wx) < 3.2 && floor === 1) continue; // Behind portico
      const winGeo = new THREE.BoxGeometry(0.8, 1.3, 0.1);
      const win = new THREE.Mesh(winGeo, floor === 1 ? illuminatedWinMat : darkGlassMat);
      win.position.set(wx, floor * 2.2 + 0.8, 1.55);
      mainHall.add(win);
    }
  }

  root.add(mainHall);

  // C. Modern Science & Innovation Wing (Right side)
  const scienceWing = new THREE.Group();
  scienceWing.position.set(11.5, 0, -4.5);

  const wingBaseGeo = new THREE.BoxGeometry(6.5, 5.0, 10);
  const wingBase = new THREE.Mesh(wingBaseGeo, darkGlassMat);
  wingBase.position.set(0, 2.5, 0);
  scienceWing.add(wingBase);

  // Steel Mullion Grids
  for (let y = 1.0; y <= 4.5; y += 1.2) {
    const mullionGeo = new THREE.BoxGeometry(6.6, 0.08, 10.1);
    const mullion = new THREE.Mesh(mullionGeo, ironMat);
    mullion.position.set(0, y, 0);
    scienceWing.add(mullion);
  }
  root.add(scienceWing);

  // D. Realistic Trees (Scattered along avenue and lawns)
  const treePositions = [
    [-4.5, 0, 2], [-5.0, 0, 6], [-4.8, 0, 10], [-5.2, 0, 14],
    [4.5, 0, 2], [5.0, 0, 6], [4.8, 0, 10], [5.2, 0, 14],
    [-7.5, 0, -1], [7.5, 0, -1], [-9.0, 0, 4], [9.0, 0, 4]
  ];

  for (let [tx, ty, tz] of treePositions) {
    const tree = new THREE.Group();
    tree.position.set(tx, ty, tz);

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.18, 1.8, 10);
    const trunk = new THREE.Mesh(trunkGeo, treeBarkMat);
    trunk.position.set(0, 0.9, 0);
    tree.add(trunk);

    // Foliage Tier 1 (Lower crown)
    const crown1Geo = new THREE.DodecahedronGeometry(1.2, 1);
    const crown1 = new THREE.Mesh(crown1Geo, treeFoliageMat);
    crown1.position.set(0, 2.3, 0);
    tree.add(crown1);

    // Foliage Tier 2 (Upper crown)
    const crown2Geo = new THREE.DodecahedronGeometry(0.85, 1);
    const crown2 = new THREE.Mesh(crown2Geo, treeFoliageMat);
    crown2.position.set(0, 3.2, 0);
    tree.add(crown2);

    root.add(tree);
  }

  // E. Streetlamps along driveway (Cast-iron lampposts)
  for (let z = 1; z <= 15; z += 4.5) {
    for (let side of [-2.8, 2.8]) {
      const lamp = new THREE.Group();
      lamp.position.set(side, 0, z);

      const postGeo = new THREE.CylinderGeometry(0.04, 0.07, 2.4, 8);
      const post = new THREE.Mesh(postGeo, ironMat);
      post.position.set(0, 1.2, 0);
      lamp.add(post);

      // Lantern Glass Lens
      const lanternGeo = new THREE.CylinderGeometry(0.12, 0.08, 0.28, 6);
      const lantern = new THREE.Mesh(lanternGeo, illuminatedWinMat);
      lantern.position.set(0, 2.35, 0);
      lamp.add(lantern);

      root.add(lamp);
    }
  }

  // F. Campus Benches
  for (let side of [-3.8, 3.8]) {
    for (let z of [3, 8]) {
      const bench = new THREE.Group();
      bench.position.set(side, 0, z);
      bench.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;

      // Wooden Slats
      const seatGeo = new THREE.BoxGeometry(1.4, 0.06, 0.4);
      const seat = new THREE.Mesh(seatGeo, treeBarkMat);
      seat.position.set(0, 0.35, 0);
      bench.add(seat);

      // Backrest
      const backGeo = new THREE.BoxGeometry(1.4, 0.35, 0.05);
      const back = new THREE.Mesh(backGeo, treeBarkMat);
      back.position.set(0, 0.65, -0.18);
      bench.add(back);

      // Iron Legs
      for (let legX of [-0.6, 0.6]) {
        const legGeo = new THREE.BoxGeometry(0.06, 0.35, 0.38);
        const leg = new THREE.Mesh(legGeo, ironMat);
        leg.position.set(legX, 0.175, 0);
        bench.add(leg);
      }

      root.add(bench);
    }
  }

  // G. Executive Campus Vehicle (Parked by curb)
  const car = new THREE.Group();
  car.position.set(1.4, 0, 6.5);
  car.rotation.y = 0.05;

  const carBodyGeo = new THREE.BoxGeometry(1.5, 0.65, 3.2);
  const carBody = new THREE.Mesh(carBodyGeo, carPaintMat);
  carBody.position.set(0, 0.5, 0);
  car.add(carBody);

  const carCabinGeo = new THREE.BoxGeometry(1.3, 0.5, 1.8);
  const carCabin = new THREE.Mesh(carCabinGeo, darkGlassMat);
  carCabin.position.set(0, 0.95, -0.2);
  car.add(carCabin);

  // Wheels
  for (let wx of [-0.75, 0.75]) {
    for (let wz of [-1.0, 1.0]) {
      const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.15, 16);
      wheelGeo.rotateZ(Math.PI / 2);
      const wheel = new THREE.Mesh(wheelGeo, ironMat);
      wheel.position.set(wx, 0.24, wz);
      car.add(wheel);
    }
  }
  root.add(car);

  // H. Realistic Student Figures (Walking along sidewalk)
  const studentData = [
    { pos: [-1.4, 0, 1.5], rot: 0.1, color: 0x3b82f6 },
    { pos: [-0.9, 0, 2.8], rot: -0.2, color: 0xef4444 },
    { pos: [1.2, 0, 0.8], rot: 0.05, color: 0x10b981 },
    { pos: [0.6, 0, 3.5], rot: -0.1, color: 0x8b5cf6 },
    { pos: [-1.8, 0, 7.0], rot: 0.0, color: 0xf59e0b }
  ];

  for (let s of studentData) {
    const student = new THREE.Group();
    student.position.set(...s.pos);
    student.rotation.y = s.rot;

    const jacketMat = new THREE.MeshStandardMaterial({ color: s.color, roughness: 0.7 });
    const trousersMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.5 });

    // Torso & Jacket
    const torsoGeo = new THREE.BoxGeometry(0.32, 0.55, 0.2);
    const torso = new THREE.Mesh(torsoGeo, jacketMat);
    torso.position.set(0, 0.95, 0);
    student.add(torso);

    // Head
    const headGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.set(0, 1.38, 0);
    student.add(head);

    // Legs
    for (let lx of [-0.08, 0.08]) {
      const legGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.7, 10);
      const leg = new THREE.Mesh(legGeo, trousersMat);
      leg.position.set(lx, 0.35, 0);
      student.add(leg);
    }

    // Backpack
    const packGeo = new THREE.BoxGeometry(0.24, 0.32, 0.14);
    const packMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
    const pack = new THREE.Mesh(packGeo, packMat);
    pack.position.set(0, 0.98, -0.15);
    student.add(pack);

    root.add(student);
  }

  return root;
}

// -------------------------------------------------------------
// EXECUTE GENERATION
// -------------------------------------------------------------
async function run() {
  console.log('Generating realistic 3D GLB assets...');

  const airplaneScene = buildAirplaneScene();
  const airplanePath = path.join(__dirname, 'public', 'assets', '3d', 'airplane', 'airplane.glb');
  await saveGLB(airplaneScene, airplanePath);

  const campusScene = buildCampusScene();
  const campusPath = path.join(__dirname, 'public', 'assets', '3d', 'campus', 'campus.glb');
  await saveGLB(campusScene, campusPath);

  console.log('All 3D assets generated successfully!');
}

run().catch(err => {
  console.error('Asset generation error:', err);
  process.exit(1);
});
