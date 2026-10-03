import React, { useRef, useEffect } from 'react';

const SCENES_LIST = [
  { id: 0, label: '01 • Earth in Space', scrollPercent: 0.05 },
  { id: 1, label: '02 • Destinations', scrollPercent: 0.17 },
  { id: 2, label: '03 • Flight Route', scrollPercent: 0.28 },
  { id: 3, label: '04 • Stratosphere Flight', scrollPercent: 0.40 },
  { id: 4, label: '05 • Destination City', scrollPercent: 0.56 },
  { id: 5, label: '06 • University Campus', scrollPercent: 0.64 },
  { id: 6, label: '07 • Main Entrance', scrollPercent: 0.70 },
  { id: 7, label: '08 • University Lobby', scrollPercent: 0.75 },
  { id: 8, label: '09 • Faculty Corridor', scrollPercent: 0.81 },
  { id: 9, label: '10 • Classroom 204', scrollPercent: 0.86 },
  { id: 10, label: '11 • Active Lecture', scrollPercent: 0.91 },
  { id: 11, label: '12 • Future Horizon', scrollPercent: 0.98 },
];

export default function TimelineScrubber({ currentScene = 0, progress = 0, onScrubJump }) {
  const percentRef = useRef(null);

  useEffect(() => {
    if (percentRef.current) {
      percentRef.current.textContent = `${Math.round(progress * 100)}%`;
    }
  }, [progress]);

  const handleJump = (item) => {
    if (onScrubJump) {
      onScrubJump(item.scrollPercent);
    } else {
      const exp = document.querySelector('.experience');
      if (exp) {
        const top = exp.offsetTop + 10000 * item.scrollPercent;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <aside
      aria-label="Journey Progress"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3 pointer-events-auto"
    >
      <div className="flex flex-col items-center gap-2 py-3 px-1.5 rounded-full bg-navy-950/70 backdrop-blur-lg border border-white/10 shadow-glass">
        {SCENES_LIST.map((scene) => {
          const isActive = currentScene === scene.id;
          return (
            <button
              key={scene.id}
              onClick={() => handleJump(scene)}
              className="group relative flex items-center justify-center p-1 focus:outline-none"
              title={scene.label}
            >
              {/* Tooltip that floats to the left of the dot */}
              <span className="absolute right-7 px-2.5 py-1 rounded-md bg-navy-900/90 border border-white/10 text-[10px] font-mono tracking-wider uppercase text-subtlecyan opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap shadow-lg">
                {scene.label}
              </span>

              {/* Indicator dot */}
              <div
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-2 h-6 bg-gradient-to-b from-subtlecyan to-softblue shadow-glow-soft'
                    : 'w-2 h-2 bg-white/20 group-hover:bg-white/60'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Global percentage indicator */}
      <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 font-mono text-[9px] text-slate-400">
        <span ref={percentRef}>0%</span>
      </div>
    </aside>
  );
}
