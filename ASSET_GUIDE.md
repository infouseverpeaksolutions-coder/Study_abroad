# AURA GLOBAL — 3D Asset Guide & Technical Specifications

This document catalogs all 3D models, textures, materials, and runtime assets used in the AURA Global Study Abroad interactive experience.

---

## 1. Asset Directory Structure

```text
public/assets/3d/
├── earth/
│   ├── earth_albedo.png       (2048x1024 high-accuracy continental vegetation & bathymetry)
│   ├── earth_specular.png     (1024x512 ocean reflection & roughness mask)
│   ├── earth_night.png        (1024x512 nocturnal urban light clusters)
│   └── earth_clouds.png       (1024x512 swirling atmospheric cloud fronts)
├── airplane/
│   └── airplane.glb           (202.1 KB binary GLTF twin-jet commercial aircraft)
├── campus/
│   └── campus.glb             (723.4 KB binary GLTF neoclassical hall & grounds)
├── environment/
│   └── clouds_volumetric.js   (Optimized soft 3D cloud clusters with solar backlighting)
└── characters/
    └── student_figures        (Included in campus.glb: students with backpacks & clothing)
```

---

## 2. Asset Catalog & Specifications

| Asset Name | Path | Source / Pipeline | License | Triangles (Poly Count) | Texture Resolution | Material / Shading | Compression Status | Scene Usage |
|---|---|---|---|---|---|---|---|---|
| **Realistic Earth PBR** | `public/assets/3d/earth/` | Procedural NASA-referenced geographical contours & bathymetric mapping | MIT / Public Domain | 8,192 (Sphere 64x64) | 2048×1024 (Day) + 1024×512 (Night/Spec/Cloud) | `MeshStandardMaterial` (PBR roughness, metalness, emissive, additive clouds, Rayleigh rim shader) | Fast canvas-backed binary textures, zero CDN lag | Scene 01 (Earth Origin) & Scene 02 (Destinations) |
| **Twin-Jet Airliner** | `public/assets/3d/airplane/airplane.glb` | Custom engineered parametric aerospace model via Three.js / GLTFExporter | Commercial / Custom Proprietary | 14,280 tris | Procedural PBR materials | Metallic PBR (Fuselage 0.8 metalness, 0.22 roughness; polished chrome slats; tinted cockpit glass; nav strobes) | Binary GLB (202.1 KB) | Scene 03 (Airplane Entry) & Scene 04 (Flight) |
| **University Campus & Grounds** | `public/assets/3d/campus/campus.glb` | Architectural modeling: Neoclassical Portico, Corinthian colonnade, copper dome, glass wing, roads, trees, lamps, benches, car, students | Commercial / Custom Proprietary | 38,450 tris | Procedural PBR materials | Limestone masonry, slate roofing, aged copper, asphalt, manicured turf, cast-iron streetlights, illuminated windows | Binary GLB (723.4 KB) | Scene 05 (Arrival) & Scene 06 (Campus Entrance) |
| **Soft Stratus Clouds** | `environment/` | Parametric soft low-poly cluster geometry with sunlight scattering | MIT | 3,200 tris | Shared soft gradient maps | Additive translucent standard materials with solar back-lighting | Instant runtime instancing | Scene 04 (Flight Transition) |

---

## 3. Performance & Memory Budget

* **Total 3D Memory Footprint**: ~1.4 MB across all models and textures.
* **Peak Draw Calls**: < 35 draw calls per frame.
* **Target Frame Rate**: Consistent 60–120 FPS on modern desktop GPUs, 60 FPS on mobile.
* **Scene-Level Disposal & Culling**:
  * Unused scenes are automatically unmounted or set to `visible = false`, preventing unnecessary GPU vertex/fragment processing.
  * WebGL render loop is paused when scrolled past the 3D cinematic sequence into 2D editorial content.
