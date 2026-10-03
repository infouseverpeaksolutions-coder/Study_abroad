import { useState, useEffect } from 'react';

/**
 * useDevicePerformance
 * Dynamically detects device tier to enforce responsive WebGL performance budgets.
 */
export function useDevicePerformance() {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    dpr: 1.5,
    maxParticles: 2000,
    enableShadows: true,
  });

  useEffect(() => {
    const checkPerformance = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const rawDpr = window.devicePixelRatio || 1;

      setDeviceInfo({
        isMobile,
        isTablet,
        // Cap DPR to 1.5 on desktop, 1.2 on tablet, and 1.0 on mobile to prevent GPU saturation
        dpr: isMobile ? 1.0 : Math.min(rawDpr, 1.5),
        maxParticles: isMobile ? 600 : isTablet ? 1200 : 2000,
        enableShadows: !isMobile,
      });
    };

    checkPerformance();
    window.addEventListener('resize', checkPerformance);
    return () => window.removeEventListener('resize', checkPerformance);
  }, []);

  return deviceInfo;
}
