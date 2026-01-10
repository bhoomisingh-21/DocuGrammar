import React, { useState, useEffect, useRef } from "react";
import Navbar from "./NavBar";
import Hero from "./Hero";
import BelowHero from "./BelowHero";
import Features from "./Features";
import DocuGrammarDemo, { TestimonialsSection } from "./DocuGrammarDemo";


export default function Page() {
  const [style, setStyle] = useState({ opacity: 1, brightness: 1 });
  
  // Refs for navigation
  const featuresRef = useRef(null);
  const demoRef = useRef(null);
  const pricingRef = useRef(null);
  const testimonialsRef = useRef(null);

  // Optimized Scroll Function
  const scrollToSection = (ref) => {
    if (ref.current) {
      const offset = 100; // Adjust based on Navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = ref.current.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Hero Fading Effect Logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const fadeStart = 20;
      const fadeEnd = 450;

      let newOpacity = 1;
      if (scrollTop > fadeStart) {
        newOpacity = Math.max(1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart), 0);
      }
      setStyle({ opacity: newOpacity, brightness: Math.max(newOpacity, 0.3) });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#0b0f19] min-h-screen">
      <Navbar 
        onFeaturesClick={() => scrollToSection(featuresRef)}
        onDemoClick={() => scrollToSection(demoRef)}
        onPricingClick={() => scrollToSection(pricingRef)}
        onTestimonialsClick={() => scrollToSection(testimonialsRef)}
      />

      {/* 1. HERO SECTION */}
      <div
        style={{
          opacity: style.opacity,
          filter: `brightness(${style.brightness})`,
          transition: "opacity 0.2s, filter 0.2s",
          position: "relative",
          zIndex: style.opacity > 0 ? 10 : -1,
        }}
      >
        <Hero onDemoClick={() => scrollToSection(demoRef)} />
      </div>

      {/* 2. BELOW HERO (Trust badges/Stats) */}
      <BelowHero />

      {/* 3. FEATURES SECTION (Ref moved here) */}
      <div ref={featuresRef} className="scroll-mt-20">
        <Features />
      </div>

      {/* 4. DEMO SECTION */}
      <div ref={demoRef} className="scroll-mt-20">
        <DocuGrammarDemo />
      </div>

      <div ref={testimonialsRef} className="scroll-mt-20">
        <TestimonialsSection />
      </div>

      

     
    </div>
  );
}