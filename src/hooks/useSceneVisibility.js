import { useState, useEffect, useRef } from 'react';

/**
 * useSceneVisibility
 * Manages scene-level activation so only currently visible 3D environments run.
 */
export function useSceneVisibility(progressMotionValue) {
  const [activeScenes, setActiveScenes] = useState({
    earth: true,
    airplane: false,
    campus: false,
    activeChapter: 0,
    is3DCanvasVisible: true,
  });

  const lastStateRef = useRef(activeScenes);

  useEffect(() => {
    if (!progressMotionValue || typeof progressMotionValue.on !== 'function') return;

    const unsubscribe = progressMotionValue.on('change', (p) => {
      const earth = p <= 0.48;
      const airplane = p >= 0.40 && p <= 0.78;
      const campus = p >= 0.70;

      let chapter = 0;
      if (p < 0.20) chapter = 0; // Earth
      else if (p < 0.42) chapter = 1; // Destinations
      else if (p < 0.54) chapter = 2; // Airplane entry
      else if (p < 0.72) chapter = 3; // Flight
      else if (p < 0.86) chapter = 4; // Arrival
      else chapter = 5; // Campus

      const is3DCanvasVisible = p < 0.99 || window.scrollY < 3000;

      const prev = lastStateRef.current;
      if (
        earth !== prev.earth ||
        airplane !== prev.airplane ||
        campus !== prev.campus ||
        chapter !== prev.activeChapter ||
        is3DCanvasVisible !== prev.is3DCanvasVisible
      ) {
        const next = { earth, airplane, campus, activeChapter: chapter, is3DCanvasVisible };
        lastStateRef.current = next;
        setActiveScenes(next);
      }
    });

    return () => unsubscribe();
  }, [progressMotionValue]);

  return activeScenes;
}
