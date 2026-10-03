import { useScroll, useSpring } from 'framer-motion';

/**
 * useScrollProgress
 * Centralized hook providing normalized scroll progress MotionValues for the 3D cinematic journey.
 */
export function useScrollProgress(targetRef) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 95,
    mass: 0.15,
  });

  return {
    rawProgress: scrollYProgress,
    smoothProgress,
  };
}
