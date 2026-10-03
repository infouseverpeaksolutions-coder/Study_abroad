import * as THREE from 'three';

// Procedurally generates physically realistic NASA-grade Earth textures:
// 1. Day Surface (Natural satellite color: deep oceans, coastal shallows, topography, vegetation, deserts)
// 2. Specular / Roughness Map (Specular reflectivity on oceans, matte on continents)
// 3. Night Lights (Physically grounded urban glow on night-side)
// 4. Atmospheric Clouds (Feathered swirling weather systems)
export function createEarthTextures() {
  const width = 2048;
  const height = 1024;

  // 1. DAY SURFACE TEXTURE
  const dayCanvas = document.createElement('canvas');
  dayCanvas.width = width;
  dayCanvas.height = height;
  const dayCtx = dayCanvas.getContext('2d');

  // Deep oceanic gradient (true deep-space ocean hue)
  const oceanGrad = dayCtx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#010a17');
  oceanGrad.addColorStop(0.3, '#021226');
  oceanGrad.addColorStop(0.5, '#031730');
  oceanGrad.addColorStop(0.7, '#021226');
  oceanGrad.addColorStop(1, '#010915');
  dayCtx.fillStyle = oceanGrad;
  dayCtx.fillRect(0, 0, width, height);

  // Continental Shelf / Coastal Shallows
  dayCtx.fillStyle = 'rgba(8, 64, 82, 0.45)';
  drawWorldContinents(dayCtx, width, height, 10);

  // Natural Vegetated Continents (Temperate & Tropical Forests)
  dayCtx.fillStyle = '#1b382b';
  drawWorldContinents(dayCtx, width, height, 0);

  // Arid & Desert Zones (Sahara, Middle East, Central Asia, Outback, Mojave)
  drawAridRegions(dayCtx, width, height);

  // Mountain Ridges (Rockies, Andes, Alps, Himalayas)
  drawAlpineRelief(dayCtx, width, height);

  // Polar Ice Caps & Glaciers (Arctic, Greenland, Antarctica)
  drawPolarIce(dayCtx, width, height);

  // 2. SPECULAR MASK CANVAS
  // Pure white = mirror-like ocean reflections; Deep charcoal = matte terrestrial terrain
  const specCanvas = document.createElement('canvas');
  specCanvas.width = 1024;
  specCanvas.height = 512;
  const specCtx = specCanvas.getContext('2d');

  specCtx.fillStyle = '#e2e8f0'; // Ocean specular reflection
  specCtx.fillRect(0, 0, 1024, 512);

  specCtx.fillStyle = '#18181b'; // Matte land
  drawWorldContinents(specCtx, 1024, 512, 0);

  // 3. NIGHT CITY LIGHTS CANVAS
  const nightCanvas = document.createElement('canvas');
  nightCanvas.width = 1024;
  nightCanvas.height = 512;
  const nightCtx = nightCanvas.getContext('2d');

  nightCtx.fillStyle = '#000000';
  nightCtx.fillRect(0, 0, 1024, 512);

  drawUrbanNocturnalGlow(nightCtx, 1024, 512);

  // 4. ATMOSPHERIC CLOUD FRONT CANVAS
  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = 1024;
  cloudCanvas.height = 512;
  const cloudCtx = cloudCanvas.getContext('2d');
  cloudCtx.fillStyle = 'rgba(0,0,0,0)';
  cloudCtx.fillRect(0, 0, 1024, 512);

  drawNaturalCloudBands(cloudCtx, 1024, 512);

  // Three.js Textures with Linear SRGB and Mipmapping
  const dayTexture = new THREE.CanvasTexture(dayCanvas);
  dayTexture.colorSpace = THREE.SRGBColorSpace;
  dayTexture.wrapS = THREE.RepeatWrapping;

  const specTexture = new THREE.CanvasTexture(specCanvas);
  specTexture.wrapS = THREE.RepeatWrapping;

  const nightTexture = new THREE.CanvasTexture(nightCanvas);
  nightTexture.colorSpace = THREE.SRGBColorSpace;
  nightTexture.wrapS = THREE.RepeatWrapping;

  const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
  cloudTexture.wrapS = THREE.RepeatWrapping;

  return { dayTexture, specTexture, nightTexture, cloudTexture };
}

// Equirectangular geographic coordinate projection
function drawWorldContinents(ctx, w, h, expand = 0) {
  const scaleX = w / 360;
  const scaleY = h / 180;

  function toXY(lon, lat) {
    return [(lon + 180) * scaleX, (90 - lat) * scaleY];
  }

  function drawPoly(coords) {
    if (coords.length < 3) return;
    ctx.beginPath();
    const [startX, startY] = toXY(coords[0][0], coords[0][1]);
    ctx.moveTo(startX, startY);
    for (let i = 1; i < coords.length; i++) {
      const [x, y] = toXY(coords[i][0], coords[i][1]);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    if (expand > 0) {
      ctx.lineWidth = expand;
      ctx.stroke();
    }
  }

  // North America
  drawPoly([
    [-168, 65], [-160, 71], [-130, 70], [-100, 74], [-80, 72], [-65, 60],
    [-55, 48], [-68, 44], [-75, 35], [-80, 25], [-82, 23], [-98, 20],
    [-92, 16], [-84, 9], [-77, 8], [-82, 14], [-97, 18], [-105, 23],
    [-115, 30], [-124, 38], [-125, 49], [-137, 58], [-150, 60], [-165, 60]
  ]);

  // Greenland
  drawPoly([
    [-50, 60], [-40, 65], [-20, 75], [-25, 82], [-45, 83], [-55, 78], [-52, 70]
  ]);

  // South America
  drawPoly([
    [-77, 8], [-65, 11], [-52, 5], [-35, -5], [-37, -12], [-41, -21],
    [-50, -30], [-60, -40], [-66, -55], [-75, -50], [-72, -38], [-77, -25],
    [-81, -5], [-77, 4]
  ]);

  // Europe & Scandinavia
  drawPoly([
    [-10, 36], [-8, 43], [-1, 45], [5, 43], [14, 45], [26, 40],
    [30, 47], [35, 53], [40, 65], [30, 70], [20, 70], [10, 63],
    [5, 58], [1, 52], [-5, 48]
  ]);

  // UK & Ireland
  drawPoly([[-10, 51], [-6, 55], [-1, 52], [-5, 50]]);
  drawPoly([[-5, 56], [-3, 58], [1, 53], [-2, 51], [-5, 55]]);

  // Africa
  drawPoly([
    [-17, 15], [-17, 28], [-5, 36], [10, 37], [25, 32], [33, 31],
    [43, 12], [51, 10], [40, -5], [35, -20], [28, -33], [18, -34],
    [12, -18], [9, 4], [0, 6], [-12, 8]
  ]);

  // Madagascar
  drawPoly([[44, -12], [50, -15], [47, -25], [43, -22]]);

  // Eurasia (Asia, Middle East, India, China, Siberia)
  drawPoly([
    [35, 53], [60, 68], [90, 75], [120, 76], [160, 72], [180, 66],
    [170, 60], [142, 52], [130, 42], [120, 34], [118, 25], [108, 18],
    [100, 6], [98, 12], [90, 22], [80, 12], [75, 8], [70, 22],
    [60, 25], [50, 30], [40, 40]
  ]);

  // Japan
  drawPoly([[130, 32], [136, 35], [142, 44], [140, 45], [132, 38]]);

  // Southeast Asia / Indonesia / Philippines
  drawPoly([[100, 4], [105, -5], [115, -7], [110, 4]]);
  drawPoly([[115, 0], [125, 5], [128, -4], [118, -5]]);
  drawPoly([[120, 15], [125, 18], [126, 8], [120, 10]]);

  // Australia
  drawPoly([
    [114, -22], [125, -15], [136, -12], [142, -10], [152, -25],
    [153, -33], [148, -38], [138, -35], [128, -32], [115, -34],
    [113, -26]
  ]);

  // New Zealand (North & South Island)
  drawPoly([[168, -45], [174, -40], [178, -38], [174, -43]]);
  drawPoly([[166, -46], [170, -43], [168, -47]]);
}

function drawAridRegions(ctx, w, h) {
  const scaleX = w / 360;
  const scaleY = h / 180;
  function toXY(lon, lat) { return [(lon + 180) * scaleX, (90 - lat) * scaleY]; }
  function drawPatch(coords, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    const [sx, sy] = toXY(coords[0][0], coords[0][1]);
    ctx.moveTo(sx, sy);
    for (let i = 1; i < coords.length; i++) {
      const [x, y] = toXY(coords[i][0], coords[i][1]);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Sahara Desert (Golden ochre)
  drawPatch([[-14, 28], [32, 28], [34, 16], [-8, 16]], '#8c673b');
  // Arabian Peninsula
  drawPatch([[38, 29], [56, 26], [54, 16], [42, 18]], '#7c5832');
  // Australian Outback (Red Ochre)
  drawPatch([[118, -20], [142, -20], [138, -32], [120, -32]], '#8a4b2a');
  // Gobi Desert
  drawPatch([[90, 44], [110, 44], [108, 38], [88, 38]], '#7c6543');
}

function drawAlpineRelief(ctx, w, h) {
  const scaleX = w / 360;
  const scaleY = h / 180;
  function toXY(lon, lat) { return [(lon + 180) * scaleX, (90 - lat) * scaleY]; }
  function drawLine(p1, p2, width, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    const [x1, y1] = toXY(p1[0], p1[1]);
    const [x2, y2] = toXY(p2[0], p2[1]);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Himalayas & Tibetan Plateau (Snow peak ridges)
  drawLine([75, 34], [95, 32], 6, '#3a4e40');
  drawLine([78, 32], [92, 30], 3, 'rgba(235, 245, 255, 0.6)');

  // Andes
  drawLine([-74, 5], [-70, -45], 4, '#2e3d34');
  // Rockies
  drawLine([-122, 58], [-105, 36], 5, '#314438');
  // Alps
  drawLine([6, 46], [14, 46], 3, 'rgba(230, 240, 255, 0.7)');
}

function drawPolarIce(ctx, w, h) {
  // Polar Ice Sheets
  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, w, h * 0.07); // Arctic pack ice
  ctx.fillRect(0, h * 0.91, w, h * 0.09); // Antarctica ice shelf
}

function drawUrbanNocturnalGlow(ctx, w, h) {
  const scaleX = w / 360;
  const scaleY = h / 180;

  function lightCluster(lon, lat, radius, intensity = 1) {
    const x = (lon + 180) * scaleX;
    const y = (90 - lat) * scaleY;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, `rgba(255, 225, 140, ${intensity * 0.9})`);
    grad.addColorStop(0.35, `rgba(245, 175, 55, ${intensity * 0.5})`);
    grad.addColorStop(1, 'rgba(200, 120, 20, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Major Educational Hubs & Metros
  // UK & Western Europe
  lightCluster(0, 51.5, 7, 0.95); // London
  lightCluster(-1.25, 51.75, 3.5, 0.85); // Oxford
  lightCluster(0.12, 52.2, 3.5, 0.85); // Cambridge
  lightCluster(2.35, 48.85, 6, 0.9); // Paris
  lightCluster(13.4, 52.52, 5.5, 0.85); // Berlin
  lightCluster(11.58, 48.13, 5, 0.85); // Munich

  // USA & Canada
  lightCluster(-71.05, 42.36, 6, 0.95); // Boston
  lightCluster(-74.0, 40.71, 7.5, 0.95); // NYC
  lightCluster(-77.03, 38.9, 5, 0.85); // Washington
  lightCluster(-79.38, 43.65, 6, 0.9); // Toronto
  lightCluster(-122.41, 37.77, 6.5, 0.95); // San Francisco
  lightCluster(-118.24, 34.05, 6.5, 0.9); // Los Angeles
  lightCluster(-123.12, 49.28, 5, 0.85); // Vancouver

  // Australia & New Zealand
  lightCluster(151.2, -33.86, 6, 0.9); // Sydney
  lightCluster(144.96, -37.81, 6, 0.9); // Melbourne
  lightCluster(174.76, -36.84, 4.5, 0.8); // Auckland

  // Asia
  lightCluster(103.81, 1.35, 5.5, 0.9); // Singapore
  lightCluster(139.69, 35.68, 8, 0.95); // Tokyo
}

function drawNaturalCloudBands(ctx, w, h) {
  // Translucent natural atmospheric swirling fronts
  for (let i = 0; i < 55; i++) {
    const cx = Math.random() * w;
    const cy = h * 0.12 + Math.random() * (h * 0.76);
    const rx = 50 + Math.random() * 90;
    const ry = 18 + Math.random() * 32;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.38)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, (Math.random() - 0.5) * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }
}
