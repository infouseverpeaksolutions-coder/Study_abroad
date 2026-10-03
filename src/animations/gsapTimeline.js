import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * sceneState
 * Direct numeric container for all Three.js properties.
 * GSAP mutates these properties smoothly during scroll scrub.
 * Three.js useFrame reads these properties directly with zero React state overhead.
 */
export const sceneState = {
  // Camera
  camPos: { x: 0, y: 0.2, z: 5.2 },
  camTarget: { x: 0.3, y: 0, z: 0 },
  camFov: 45,

  // Photorealistic Data Globe Earth
  earthPos: { x: 1.1, y: -0.1, z: 0 },
  earthScale: 1.15,
  earthRotY: 0.25,
  earthRotX: 0.12,
  earthOpacity: 1.0,
  earthVisible: 1,
  destinationsGlow: 0,
  activeDestIndex: 0,

  // Airplane & Flight
  planePos: { x: -6.0, y: 0.6, z: 2.0 },
  planeRot: { pitch: 0.04, roll: -0.12, yaw: -0.65 },
  planeScale: 1.0,
  planeVisible: 0,
  cloudsOpacity: 0,

  // Atmosphere & Cloud Pass
  cloudPassOpacity: 0,
  atmosphereFog: 0,

  // Destination City
  cityPos: { x: 0, y: -16.0, z: -2.0 },
  cityScale: 0.8,
  cityVisible: 0,

  // University Campus Exterior
  campusPos: { x: 0, y: -12.0, z: 4.0 },
  campusOpacity: 0,
  campusVisible: 0,
  sunWarmth: 0,

  // University Main Entrance
  entrancePos: { x: 0, y: -20.0, z: 0 },
  entranceVisible: 0,

  // University Lobby / Atrium
  lobbyPos: { x: 0, y: -25.0, z: 0 },
  lobbyVisible: 0,

  // University Corridor
  corridorPos: { x: 0, y: -30.0, z: 0 },
  corridorVisible: 0,

  // University Classroom 204
  classroomPos: { x: 0, y: -35.0, z: 0 },
  classroomVisible: 0,

  // Global Scrubber Progress & Chapter
  progress: 0,
  activeChapter: 0,
};

/**
 * createMasterJourneyTimeline
 * Master GSAP ScrollTrigger timeline orchestrating the continuous cinematic study-abroad journey:
 * 0–12%: INTERACTIVE EARTH
 * 12–22%: DESTINATION
 * 22–32%: FLIGHT ROUTE
 * 32–45%: AIRPLANE
 * 45–52%: CLOUDS
 * 52–60%: CITY
 * 60–68%: UNIVERSITY CAMPUS
 * 68–73%: MAIN ENTRANCE
 * 73–78%: LOBBY
 * 78–84%: CORRIDOR
 * 84–88%: CLASSROOM DOOR
 * 88–94%: CLASSROOM
 * 94–97%: STUDENT / FUTURE
 * 97–100%: NEXT CTA / APPLICATION
 */
export function createMasterJourneyTimeline({
  trigger,
  overlays = {},
  onProgress,
  onChapterChange,
  onDestIndexChange,
}) {
  const {
    heroRef,
    destRef,
    flightRef,
    cityRef,
    campusRef,
    entranceRef,
    lobbyRef,
    corridorRef,
    classroomRef,
    ctaRef,
  } = overlays;

  // Master timeline with smoother scrub coupling and pinned viewport
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top top',
      end: '+=10000',
      scrub: 1.5,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        sceneState.progress = p;

        // Discrete chapter identification
        let ch = 0;
        if (p < 0.12) ch = 0;       // Interactive Earth
        else if (p < 0.22) ch = 1;  // Destination
        else if (p < 0.32) ch = 2;  // Flight Route
        else if (p < 0.45) ch = 3;  // Airplane
        else if (p < 0.52) ch = 4;  // Clouds
        else if (p < 0.60) ch = 5;  // City
        else if (p < 0.68) ch = 6;  // University Campus
        else if (p < 0.73) ch = 7;  // Main Entrance
        else if (p < 0.78) ch = 8;  // Lobby
        else if (p < 0.84) ch = 9;  // Corridor
        else if (p < 0.88) ch = 10; // Classroom Door
        else if (p < 0.94) ch = 11; // Classroom
        else if (p < 0.97) ch = 12; // Student / Future
        else ch = 13;               // Next CTA

        if (ch !== sceneState.activeChapter) {
          sceneState.activeChapter = ch;
          if (onChapterChange) onChapterChange(ch);
        }

        if (onProgress) onProgress(p);
      },
    },
  });

  // Base state initialization
  tl.set(sceneState, {
    earthPos: { x: 1.1, y: -0.1, z: 0 },
    earthScale: 1.15,
    earthRotY: 0.25,
    earthRotX: 0.12,
    earthOpacity: 1.0,
    earthVisible: 1,
    destinationsGlow: 0,
    activeDestIndex: 0,
    planeVisible: 0,
    cloudsOpacity: 0,
    cloudPassOpacity: 0,
    cityVisible: 0,
    campusVisible: 0,
    entranceVisible: 0,
    lobbyVisible: 0,
    corridorVisible: 0,
    classroomVisible: 0,
    sunWarmth: 0,
  }, 0);

  // -------------------------------------------------------------
  // 1. 0%–12%: INTERACTIVE EARTH (Space)
  // -------------------------------------------------------------
  tl.to(
    sceneState,
    { earthRotY: 0.65, ease: 'power1.inOut', duration: 12 },
    0
  );
  tl.to(
    sceneState.camPos,
    { y: 0.32, z: 4.8, ease: 'power2.inOut', duration: 12 },
    0
  );

  // Hero DOM Text Fade Out
  if (heroRef?.current) {
    tl.to(
      heroRef.current,
      {
        opacity: 0,
        y: -30,
        duration: 3,
        ease: 'power1.in',
        onComplete: () => {
          if (heroRef.current) heroRef.current.style.pointerEvents = 'none';
        },
        onReverseComplete: () => {
          if (heroRef.current) heroRef.current.style.pointerEvents = 'auto';
        },
      },
      8
    );
  }

  // -------------------------------------------------------------
  // 2. 12%–22%: DESTINATIONS (Data Globe Arcs & Selection)
  // -------------------------------------------------------------
  tl.to(
    sceneState.camPos,
    { x: -0.2, y: 0.45, z: 4.0, ease: 'power2.inOut', duration: 10 },
    12
  );
  tl.to(
    sceneState.camTarget,
    { x: 0.1, y: 0, z: 0, ease: 'power2.inOut', duration: 10 },
    12
  );
  tl.to(
    sceneState.earthPos,
    { x: 0.35, y: -0.05, ease: 'power2.inOut', duration: 10 },
    12
  );
  tl.to(
    sceneState,
    {
      earthRotY: 1.85,
      earthScale: 1.35,
      destinationsGlow: 1.0,
      ease: 'power1.inOut',
      duration: 10,
    },
    12
  );

  // Cycle destination markers (UK -> CA -> AU -> US -> DE -> NZ)
  [0, 1, 2, 3, 4, 5].forEach((idx) => {
    tl.call(() => {
      sceneState.activeDestIndex = idx;
      if (onDestIndexChange) onDestIndexChange(idx);
    }, null, 13 + idx * 1.4);
  });

  // Destinations DOM Overlay Fade In / Out
  if (destRef?.current) {
    tl.fromTo(
      destRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 2.5,
        ease: 'power1.out',
        onStart: () => {
          if (destRef.current) destRef.current.style.pointerEvents = 'auto';
        },
      },
      13
    ).to(
      destRef.current,
      {
        opacity: 0,
        y: -30,
        duration: 2,
        ease: 'power1.in',
        onComplete: () => {
          if (destRef.current) destRef.current.style.pointerEvents = 'none';
        },
      },
      20.5
    );
  }

  // -------------------------------------------------------------
  // 3. 22%–32%: FLIGHT ROUTE (Leaving Orbit)
  // -------------------------------------------------------------
  tl.to(
    sceneState.earthPos,
    { y: -6.0, ease: 'power1.in', duration: 10 },
    22
  );
  tl.to(
    sceneState,
    {
      earthOpacity: 0,
      destinationsGlow: 0,
      duration: 8,
      ease: 'power1.in',
      onComplete: () => {
        sceneState.earthVisible = 0;
      },
    },
    23
  );

  // Camera shifts to high-altitude flight vantage matching reference image (media_1790937424060.png)
  tl.to(
    sceneState.camPos,
    { x: 0.1, y: -0.7, z: 8.6, ease: 'power2.inOut', duration: 10 },
    22
  );
  tl.to(
    sceneState.camTarget,
    { x: 1.2, y: 0.3, z: 0.0, ease: 'power2.inOut', duration: 10 },
    22
  );

  // -------------------------------------------------------------
  // 4. 32%–45%: AIRPLANE (Cruising above clouds matching reference image)
  // -------------------------------------------------------------
  // Airplane fades in smoothly over 2 timeline units
  tl.to(sceneState, { planeVisible: 1, duration: 2, ease: 'power1.out' }, 31);
  tl.fromTo(
    sceneState.planePos,
    { x: 1.85, y: -0.05, z: 0.5 },
    { x: 2.15, y: 0.25, z: -0.5, ease: 'power1.inOut', duration: 13 },
    32
  );
  tl.fromTo(
    sceneState.planeRot,
    { pitch: 0.18, roll: -0.26, yaw: -2.80 },
    { pitch: 0.21, roll: -0.29, yaw: -2.76, ease: 'power1.inOut', duration: 13 },
    32
  );
  tl.to(
    sceneState,
    { cloudsOpacity: 1.0, ease: 'power2.out', duration: 8 },
    32
  );

  // Flight DOM Overlay Fade In / Out
  if (flightRef?.current) {
    tl.fromTo(
      flightRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 2.5,
        ease: 'power1.out',
        onStart: () => {
          if (flightRef.current) flightRef.current.style.pointerEvents = 'auto';
        },
      },
      33
    ).to(
      flightRef.current,
      {
        opacity: 0,
        y: -30,
        duration: 2,
        ease: 'power1.in',
        onComplete: () => {
          if (flightRef.current) flightRef.current.style.pointerEvents = 'none';
        },
      },
      43
    );
  }

  // -------------------------------------------------------------
  // 5. 45%–52%: CLOUDS (Descent)
  // -------------------------------------------------------------
  tl.to(
    sceneState.planePos,
    { x: 4.2, y: 1.8, z: -12.0, ease: 'power2.in', duration: 7 },
    45
  );
  // Smooth fade-out of airplane during descent
  tl.to(
    sceneState,
    { planeVisible: 0, duration: 4, ease: 'power1.in' },
    46
  );
  tl.to(
    sceneState,
    {
      cloudPassOpacity: 0.9,
      cloudsOpacity: 0,
      duration: 6,
      ease: 'power2.in',
    },
    45
  );

  // -------------------------------------------------------------
  // 6. 52%–60%: DESTINATION CITY REVEAL
  // -------------------------------------------------------------
  // Smooth fade-in instead of hard snap
  tl.to(sceneState, { cityVisible: 1, duration: 2, ease: 'power1.out' }, 51);
  tl.fromTo(
    sceneState.cityPos,
    { x: 0, y: -16.0, z: -2.0 },
    { x: 0, y: -0.5, z: 0.0, ease: 'power2.out', duration: 8 },
    52
  );
  tl.to(
    sceneState,
    { cloudPassOpacity: 0, sunWarmth: 0.6, duration: 4, ease: 'power1.out' },
    52
  );
  tl.to(
    sceneState.camPos,
    { x: 0, y: 3.2, z: 12.0, ease: 'power2.inOut', duration: 8 },
    52
  );
  tl.to(
    sceneState.camTarget,
    { x: 0, y: 1.8, z: -2.0, ease: 'power2.inOut', duration: 8 },
    52
  );

  // City DOM Overlay Fade In / Out
  if (cityRef?.current) {
    tl.fromTo(
      cityRef.current,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: 'power1.out',
      },
      53
    ).to(
      cityRef.current,
      {
        opacity: 0,
        y: -25,
        duration: 2,
        ease: 'power1.in',
      },
      58
    );
  }

  // -------------------------------------------------------------
  // 7. 60%–68%: UNIVERSITY CAMPUS (Exterior Pathway)
  // -------------------------------------------------------------
  // Smooth crossfade: city fades out as campus fades in
  tl.to(sceneState, { campusVisible: 1, duration: 2, ease: 'power1.out' }, 59);
  tl.to(
    sceneState.cityPos,
    { y: -25.0, duration: 4, ease: 'power2.in' },
    60
  );
  tl.to(sceneState, { cityVisible: 0, duration: 3, ease: 'power1.in' }, 62);
  tl.fromTo(
    sceneState.campusPos,
    { x: 1.1, y: -10.0, z: 4.0 },
    { x: 1.1, y: -0.2, z: 0.0, ease: 'power2.out', duration: 8 },
    60
  );
  tl.to(
    sceneState,
    { campusOpacity: 1.0, sunWarmth: 1.0, duration: 8, ease: 'power1.out' },
    60
  );
  tl.to(
    sceneState.camPos,
    { x: 0, y: 2.4, z: 12.0, ease: 'power2.inOut', duration: 8 },
    60
  );
  tl.to(
    sceneState.camTarget,
    { x: 0.4, y: 2.2, z: -4.0, ease: 'power2.inOut', duration: 8 },
    60
  );

  // Campus DOM Overlay Fade In / Out
  if (campusRef?.current) {
    tl.fromTo(
      campusRef.current,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: 'power1.out',
        onStart: () => {
          if (campusRef.current) campusRef.current.style.pointerEvents = 'auto';
        },
      },
      61
    ).to(
      campusRef.current,
      {
        opacity: 0,
        y: -25,
        duration: 2,
        ease: 'power1.in',
        onComplete: () => {
          if (campusRef.current) campusRef.current.style.pointerEvents = 'none';
        },
      },
      66
    );
  }

  // -------------------------------------------------------------
  // 8. 68%–73%: MAIN ENTRANCE (Archway Approach)
  // -------------------------------------------------------------
  // Smooth crossfade: entrance fades in, campus fades out
  tl.to(sceneState, { entranceVisible: 1, duration: 2, ease: 'power1.out' }, 67);
  tl.set(sceneState, { entrancePos: { x: 0, y: 0, z: 0 } }, 67);
  tl.to(
    sceneState.campusPos,
    { y: -16.0, duration: 4, ease: 'power2.in' },
    68
  );
  tl.to(sceneState, { campusVisible: 0, duration: 3, ease: 'power1.in' }, 69);
  tl.fromTo(
    sceneState.camPos,
    { x: 0, y: 1.85, z: 6.0 },
    { x: 0, y: 1.8, z: 0.8, ease: 'power2.inOut', duration: 5 },
    68
  );
  tl.to(
    sceneState.camTarget,
    { x: 0, y: 1.8, z: -2.4, ease: 'power2.inOut', duration: 5 },
    68
  );

  // Entrance DOM Overlay Fade In / Out
  if (entranceRef?.current) {
    tl.fromTo(
      entranceRef.current,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power1.out',
      },
      68.5
    ).to(
      entranceRef.current,
      {
        opacity: 0,
        y: -25,
        duration: 1.5,
        ease: 'power1.in',
      },
      72
    );
  }

  // -------------------------------------------------------------
  // 9. 73%–78%: UNIVERSITY LOBBY (Passing through doors)
  // -------------------------------------------------------------
  // Smooth crossfade: entrance fades out, lobby fades in
  tl.to(sceneState, { entranceVisible: 0, duration: 2, ease: 'power1.in' }, 72);
  tl.to(sceneState, { lobbyVisible: 1, duration: 2, ease: 'power1.out' }, 72);
  tl.set(sceneState, { lobbyPos: { x: 0, y: 0, z: 0 } }, 72);

  tl.fromTo(
    sceneState.camPos,
    { x: 0, y: 1.7, z: 6.0 },
    { x: 0, y: 1.6, z: 1.5, ease: 'power2.inOut', duration: 5 },
    73
  );
  tl.to(
    sceneState.camTarget,
    { x: 0.2, y: 1.5, z: -3.5, ease: 'power2.inOut', duration: 5 },
    73
  );

  // Lobby DOM Overlay Fade In / Out
  if (lobbyRef?.current) {
    tl.fromTo(
      lobbyRef.current,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power1.out',
      },
      73.5
    ).to(
      lobbyRef.current,
      {
        opacity: 0,
        y: -25,
        duration: 1.5,
        ease: 'power1.in',
      },
      77
    );
  }

  // -------------------------------------------------------------
  // 10. 78%–84%: CORRIDOR (One-point perspective)
  // -------------------------------------------------------------
  // Smooth crossfade: lobby fades out, corridor fades in
  tl.to(sceneState, { lobbyVisible: 0, duration: 2, ease: 'power1.in' }, 77);
  tl.to(sceneState, { corridorVisible: 1, duration: 2, ease: 'power1.out' }, 77);
  tl.set(sceneState, { corridorPos: { x: 0, y: 0, z: 0 } }, 77);

  tl.fromTo(
    sceneState.camPos,
    { x: 0, y: 1.65, z: 8.0 },
    { x: 0, y: 1.65, z: -4.5, ease: 'power2.inOut', duration: 6 },
    78
  );
  tl.to(
    sceneState.camTarget,
    { x: 0, y: 1.65, z: -13.0, ease: 'power2.inOut', duration: 6 },
    78
  );

  // Corridor DOM Overlay Fade In
  if (corridorRef?.current) {
    tl.fromTo(
      corridorRef.current,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power1.out',
      },
      78.5
    );
  }

  // -------------------------------------------------------------
  // 11. 84%–88%: CLASSROOM DOOR 204
  // -------------------------------------------------------------
  tl.to(
    sceneState.camPos,
    { x: 0.8, y: 1.65, z: -6.6, ease: 'power1.inOut', duration: 4 },
    84
  );
  tl.to(
    sceneState.camTarget,
    { x: 1.9, y: 1.65, z: -7.0, ease: 'power1.inOut', duration: 4 },
    84
  );

  // Corridor DOM Overlay Fade Out
  if (corridorRef?.current) {
    tl.to(
      corridorRef.current,
      {
        opacity: 0,
        y: -25,
        duration: 1.5,
        ease: 'power1.in',
      },
      86.5
    );
  }

  // -------------------------------------------------------------
  // 12. 88%–94%: CLASSROOM 204 (Active Lecture & Students)
  // -------------------------------------------------------------
  // Smooth crossfade: corridor fades out as classroom fades in
  tl.to(sceneState, { corridorVisible: 0, duration: 2, ease: 'power1.in' }, 87);
  tl.to(sceneState, { classroomVisible: 1, duration: 2, ease: 'power1.out' }, 87);
  tl.set(sceneState, { classroomPos: { x: 0, y: 0, z: 0 } }, 87);

  tl.fromTo(
    sceneState.camPos,
    { x: -2.4, y: 1.7, z: 4.5 },
    { x: -2.4, y: 1.65, z: 2.0, ease: 'power2.inOut', duration: 6 },
    88
  );
  tl.to(
    sceneState.camTarget,
    { x: 1.6, y: 1.55, z: -4.5, ease: 'power2.inOut', duration: 6 },
    88
  );

  // Classroom DOM Overlay Fade In
  if (classroomRef?.current) {
    tl.fromTo(
      classroomRef.current,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: 'power2.out',
        onStart: () => {
          if (classroomRef.current) classroomRef.current.style.pointerEvents = 'auto';
        },
      },
      88.5
    );
  }

  // -------------------------------------------------------------
  // 13. 94%–97%: STUDENT HERO MOMENT & WINDOW FUTURE
  // -------------------------------------------------------------
  tl.to(
    sceneState.camPos,
    { x: -2.2, y: 1.65, z: 0.6, ease: 'power2.inOut', duration: 3 },
    94
  );
  tl.to(
    sceneState.camTarget,
    { x: -5.8, y: 1.8, z: 0.5, ease: 'power2.inOut', duration: 3 },
    94
  );

  // Classroom DOM Overlay Fade Out
  if (classroomRef?.current) {
    tl.to(
      classroomRef.current,
      {
        opacity: 0,
        y: -25,
        duration: 1.5,
        ease: 'power2.in',
        onComplete: () => {
          if (classroomRef.current) classroomRef.current.style.pointerEvents = 'none';
        },
      },
      96
    );
  }

  // -------------------------------------------------------------
  // 14. 97%–100%: NEXT CTA / APPLICATION JOURNEY
  // -------------------------------------------------------------
  tl.to(
    sceneState.camPos,
    { y: 1.8, z: -0.5, ease: 'power2.out', duration: 3 },
    97
  );

  // Final CTA DOM Overlay Fade In
  if (ctaRef?.current) {
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: 'power2.out',
        onStart: () => {
          if (ctaRef.current) ctaRef.current.style.pointerEvents = 'auto';
        },
      },
      97.2
    );
  }

  return tl;
}
