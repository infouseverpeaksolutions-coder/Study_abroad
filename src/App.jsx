import React, { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { createMasterJourneyTimeline } from './animations/gsapTimeline';
import SceneCanvas from './components/3d/SceneCanvas';
import Navbar from './components/navigation/Navbar';
import TimelineScrubber from './components/ui/TimelineScrubber';
import ConsultationModal from './components/modals/ConsultationModal';

// Cinematic 3D Journey Overlays (Driven by master GSAP ScrollTrigger timeline)
import Hero from './components/sections/Hero';
import { DestinationOverlay } from './components/sections/Destinations';
import FlightSection from './components/sections/FlightSection';
import CityOverlay from './components/sections/CityOverlay';
import ArrivalSection from './components/sections/ArrivalSection';
import EntranceOverlay from './components/sections/EntranceOverlay';
import LobbyOverlay from './components/sections/LobbyOverlay';
import CorridorOverlay from './components/sections/CorridorOverlay';
import ClassroomOverlay from './components/sections/ClassroomOverlay';
import FinalHeroCTAOverlay from './components/sections/FinalHeroCTAOverlay';

// High-Quality Editorial 2D Content Sections
import Destinations from './components/sections/Destinations';
import Universities from './components/sections/Universities';
import Services from './components/sections/Services';
import Journey from './components/sections/Journey';
import WhyChooseUs from './components/sections/WhyChooseUs';
import Calculator from './components/sections/Calculator';
import Stories from './components/sections/Stories';
import FAQ from './components/sections/FAQ';
import FinalCTA from './components/sections/FinalCTA';
import Footer from './components/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeDestIndex, setActiveDestIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [is3DVisible, setIs3DVisible] = useState(true);

  const containerRef = useRef(null);
  const lenisRef = useRef(null);

  // Overlay DOM refs orchestrated directly by the master GSAP timeline
  const heroRef = useRef(null);
  const destRef = useRef(null);
  const flightRef = useRef(null);
  const cityRef = useRef(null);
  const campusRef = useRef(null);
  const entranceRef = useRef(null);
  const lobbyRef = useRef(null);
  const corridorRef = useRef(null);
  const classroomRef = useRef(null);
  const ctaRef = useRef(null);

  // 1. Initialize Lenis + GSAP ScrollTrigger Synchronous Loop
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const lenis = new Lenis({
      duration: isMobile ? 1.0 : 1.35,
      easing: (t) => 1 - Math.pow(1 - t, 3.5),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: isMobile ? 1.0 : 1.1,
    });
    lenisRef.current = lenis;

    // Direct synchronous link: Lenis update notifies ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // GSAP Ticker drives Lenis RAF for unified frame timing
    const tickerHandler = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerHandler);
    gsap.ticker.lagSmoothing(0);

    // 2. Build the ONE master ScrollTrigger timeline coordinating 3D + UI
    const ctx = gsap.context(() => {
      createMasterJourneyTimeline({
        trigger: containerRef.current,
        overlays: {
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
        },
        onProgress: (p) => {
          setScrollProgress(p);
          // Put 3D canvas to sleep when user scrolls deeply into 2D content
          if (p >= 0.99 && window.scrollY > 4000) {
            setIs3DVisible(false);
          } else {
            setIs3DVisible(true);
          }
        },
        onChapterChange: (ch) => {
          setActiveChapter(ch);
        },
        onDestIndexChange: (idx) => {
          setActiveDestIndex(idx);
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(tickerHandler);
      lenis.destroy();
    };
  }, []);

  const handleExploreClick = useCallback(() => {
    const target = document.querySelector('#destinations-deepdive');
    if (target) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const handleScrubJump = useCallback((percent) => {
    if (containerRef.current) {
      const top = containerRef.current.offsetTop + 10000 * percent;
      if (lenisRef.current) {
        lenisRef.current.scrollTo(top);
      } else {
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-navy-950 text-offwhite selection:bg-subtlecyan/30 selection:text-subtlecyan">
      <div className="noise-overlay" />

      {/* 1. Fixed Luxury Navigation Bar */}
      <Navbar
        onOpenModal={() => setIsModalOpen(true)}
        activeScene={activeChapter}
      />

      {/* 2. Floating Timeline Scrubber */}
      <TimelineScrubber
        currentScene={activeChapter}
        progress={scrollProgress}
        onScrubJump={handleScrubJump}
      />

      {/* ------------------------------------------------------------- */}
      {/* 3. THE MASTER CINEMATIC 3D EXPERIENCE PINNED CONTAINER        */}
      {/* (Space → Earth → Flight → Campus → Entrance → Lobby → Class)   */}
      {/* ------------------------------------------------------------- */}
      <div
        ref={containerRef}
        className="experience relative w-full h-screen"
      >
        {/* Fullscreen Background 3D Canvas (Directly driven by GSAP sceneState) */}
        <SceneCanvas isVisible={is3DVisible} />

        {/* Viewport Frame for GSAP-Orchestrated DOM Overlays */}
        <div className="relative w-full h-full overflow-hidden pointer-events-none z-10">

          {/* SCENE 01: HERO / INTERACTIVE EARTH (0% – 12%) */}
          <div
            ref={heroRef}
            className="absolute inset-0 w-full h-full flex flex-col justify-between"
          >
            <Hero
              onOpenModal={() => setIsModalOpen(true)}
              onExploreClick={handleExploreClick}
            />
          </div>

          {/* SCENE 02: DESTINATIONS OVERLAY (12% – 22%) */}
          <div
            ref={destRef}
            className="absolute inset-0 w-full h-full flex items-center opacity-0 pointer-events-none"
          >
            <DestinationOverlay
              activeIndex={activeDestIndex}
              onSelectDestination={(idx) => setActiveDestIndex(idx)}
            />
          </div>

          {/* SCENE 03 & 04: FLIGHT & AIRPLANE (22% – 45%) */}
          <div
            ref={flightRef}
            className="absolute inset-0 w-full h-full flex items-center opacity-0 pointer-events-none"
          >
            <FlightSection />
          </div>

          {/* SCENE 05: DESTINATION CITY OVERLAY (52% – 60%) */}
          <div
            ref={cityRef}
            className="absolute inset-0 w-full h-full flex items-center opacity-0 pointer-events-none"
          >
            <CityOverlay />
          </div>

          {/* SCENE 06: UNIVERSITY CAMPUS ARRIVAL OVERLAY (60% – 68%) */}
          <div
            ref={campusRef}
            className="absolute inset-0 w-full h-full flex items-center opacity-0 pointer-events-none"
          >
            <ArrivalSection onOpenModal={() => setIsModalOpen(true)} />
          </div>

          {/* SCENE 07: MAIN ENTRANCE APPROACH (68% – 73%) */}
          <div
            ref={entranceRef}
            className="absolute inset-0 w-full h-full flex items-center opacity-0 pointer-events-none"
          >
            <EntranceOverlay />
          </div>

          {/* SCENE 08: UNIVERSITY LOBBY / ATRIUM (73% – 78%) */}
          <div
            ref={lobbyRef}
            className="absolute inset-0 w-full h-full flex items-center opacity-0 pointer-events-none"
          >
            <LobbyOverlay />
          </div>

          {/* SCENE 09: FACULTY CORRIDOR & DOOR 204 (78% – 88%) */}
          <div
            ref={corridorRef}
            className="absolute inset-0 w-full h-full flex items-center opacity-0 pointer-events-none"
          >
            <CorridorOverlay />
          </div>

          {/* SCENE 10: CLASSROOM 204 & LECTURE (88% – 97%) */}
          <div
            ref={classroomRef}
            className="absolute inset-0 w-full h-full flex items-center opacity-0 pointer-events-none"
          >
            <ClassroomOverlay />
          </div>

          {/* SCENE 11: FINAL CTA OVERLAY (97% – 100%) */}
          <div
            ref={ctaRef}
            className="absolute inset-0 w-full h-full flex items-center opacity-0 pointer-events-none"
          >
            <FinalHeroCTAOverlay
              onOpenModal={() => setIsModalOpen(true)}
              onExploreClick={handleExploreClick}
            />
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. SEAMLESS TRANSITION INTO HIGH-QUALITY 2D EDITORIAL CONTENT  */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 bg-navy-950 border-t border-white/10 shadow-[0_-20px_50px_rgba(7,17,31,0.95)]">
        {/* The 6-Step Application Journey & Deliverables */}
        <Journey
          onOpenModal={() => setIsModalOpen(true)}
        />

        {/* Destination Deep Dive */}
        <div id="destinations-deepdive">
          <Destinations
            onOpenModal={() => setIsModalOpen(true)}
          />
        </div>

        {/* Featured Global Universities */}
        <Universities
          onOpenModal={() => setIsModalOpen(true)}
        />

        {/* End-to-End Bespoke Advisory Services */}
        <Services
          onOpenModal={() => setIsModalOpen(true)}
        />

        {/* Why Discerning Students Choose Us + Audited Stats */}
        <WhyChooseUs
          onOpenModal={() => setIsModalOpen(true)}
        />

        {/* Interactive Budget & Visa Estimator */}
        <Calculator
          onOpenModal={() => setIsModalOpen(true)}
        />

        {/* Editorial Student Stories */}
        <Stories />

        {/* Transparent FAQ Section */}
        <FAQ
          onOpenModal={() => setIsModalOpen(true)}
        />

        {/* Final Horizon & Consultation Booking CTA */}
        <FinalCTA
          onOpenModal={() => setIsModalOpen(true)}
        />

        {/* Global Advisory Suites Footer */}
        <Footer
          onOpenModal={() => setIsModalOpen(true)}
        />
      </div>

      {/* 5. Interactive Consultation Booking Modal */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
