# AURA GLOBAL — Premium 3D Study Abroad Advisory Website

A cinematic, performance-optimized interactive experience for a modern overseas education consultancy.

> **“Your World. Your Education. Your Future.”**

---

## Visual Journey

1. **Earth Horizon**: Orbital PBR globe with bathymetric oceans, continental topography, night city lights, and Rayleigh scattering atmosphere.
2. **Global Destinations**: Global academic hubs (UK, USA, Canada, Australia, Germany, New Zealand) illuminated with dynamic flight arcs and intelligence badges.
3. **Stratospheric Flight**: Binary GLB twin-jet commercial aircraft (`airplane.glb`, 202 KB) banking diagonally across soft low-poly cloud layers.
4. **University Campus Arrival**: Binary GLB neoclassical university campus (`campus.glb`, 723 KB) with portico, Ionic colonnade, copper dome, avenue trees, and student figures in natural sunlight.
5. **Application Pathway**: Comprehensive 6-step admissions lifecycle from profile assessment to visa filing.
6. **Global Future**: Institutional showcase, interactive tuition/budget estimator, verified student case studies, and instant consultation scheduling.

---

## Tech Stack & Architecture

* **React 19** — Core UI, reactive components, and state architecture.
* **Three.js & React Three Fiber (R3F)** — Physically based rendering, GLTF loading, custom GLSL Rayleigh scattering shaders.
* **@react-three/drei** — Optimized camera management and deep space starfield.
* **Framer Motion** — `useScroll`, `useTransform`, `useSpring`, and `MotionValue` driving hardware-accelerated UI transitions and 3D camera evaluation.
* **Lenis** — Smooth inertia scrolling and physics-based wheel smoothing.
* **Tailwind CSS** — Editorial typography, responsive layouts, and glassmorphic UI panels.

*(Note: Theatre.js and GSAP are completely removed in favor of native Framer Motion values and direct Three.js useFrame mutations).*

---

## Getting Started

```bash
# Install dependencies
npm install

# Run Vite dev server
npm run dev

# Build for production
npm run build
```
