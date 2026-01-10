import React, { useState, useEffect, useRef } from "react";

// --- 1. STREAMING TEXT COMPONENT WITH CURSOR ---
function StreamingText({ text, speed = 40, delay = 0, showCursor = false, trigger = false }) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay, trigger]);

  useEffect(() => {
    if (started && displayedText.length < text.length) {
      const charTimer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(charTimer);
    } else if (started && displayedText.length === text.length) {
      setIsDone(true);
    }
  }, [started, displayedText, text, speed]);

  return (
    <span className="relative">
      {displayedText}
      {started && !isDone && showCursor && (
        <span className="inline-block w-0.5 h-[1em] bg-blue-400 ml-1 animate-pulse align-middle" />
      )}
    </span>
  );
}

// --- 2. SHINE CARD EFFECT COMPONENT ---
function ShineCard({ children, className }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-3xl ${className}`}
    >
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-3xl "
        style={{
          background: `radial-gradient(circle at ${coords.x}px ${coords.y}px,
              rgba(255,255,255,0.15) 0%, transparent 80%)`,
          transition: "background 0.1s",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// --- 3. MAIN SECTION COMPONENT ---
export default function BelowHero() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="w-full mt-24 md:mt-40 px-4 md:px-6 flex flex-col items-center text-center pb-32 md:pb-60"
    >
      {/* Heading */}
      <h2 className="text-3xl md:text-5xl font-bold bg-linear-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent px-4">
        See corrections come to life
      </h2>

      {/* Subtext */}
      <p className="text-gray-400 mt-4 max-w-3xl text-base md:text-xl px-2">
        Watch as our AI analyzes and corrects your text in real-time with
        intelligent suggestions.
      </p>

      {/* WRAPPER */}
      <div className="relative w-full max-w-5xl mt-12 md:mt-16">
        {/* OUTER GLOW - Adjusted for the extra bottom space */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[90%] h-48 bg-blue-600/25 blur-[120px] rounded-full pointer-events-none" />

        {/* CARD */}
        <ShineCard
          className="relative bg-[#0a0f25] rounded-4xl md:rounded-3xl p-4 md:p-8 border border-blue-900 shadow-[0_0_60px_rgba(0,0,255,0.1)]"
        >
          {/* TEXT BOX WITH CHECKERED BG */}
          <div className="relative bg-[#040613] border border-[#1d2338] rounded-2xl p-6 md:p-12 pb-20 md:pb-30 text-left overflow-hidden min-h-[200px] md:min-h-[300px]">
            {/* CHECKERED BG */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-2 md:gap-4 pointer-events-none opacity-10">
              {Array.from({ length: 72 }).map((_, idx) => (
                <div key={idx} className="border border-gray-600 rounded-sm"></div>
              ))}
            </div>

            {/* HEADER INSIDE TEXT BOX */}
            <div className="flex items-center justify-between mb-4 md:mb-7 relative z-10">
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="w-2 md:w-3 h-2 md:h-3 bg-red-500 rounded-full"></span>
                <span className="w-2 md:w-3 h-2 md:h-3 bg-yellow-500 rounded-full"></span>
                <span className="w-2 md:w-3 h-2 md:h-3 bg-green-500 rounded-full"></span>
              </div>

              <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 border border-blue-900/50 bg-blue-900/20 rounded-full text-[10px] md:text-sm text-white">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                AI Active
              </div>
            </div>

            <div className="border-b border-gray-800/50 mb-6 md:mb-8 relative z-10"></div>

            {/* MAIN TEXT AREA */}
            <div className="relative z-10 text-lg md:text-4xl font-serif text-gray-200 leading-relaxed tracking-wide">
              <StreamingText 
                text="The quick brown fox " 
                delay={300} 
                speed={40} 
                trigger={isVisible} 
              />
              
              <span className="text-red-400 underline decoration-red-500 decoration-2 md:decoration-4 underline-offset-4 mx-1">
                <StreamingText 
                  text="jumps" 
                  delay={1400} 
                  speed={80} 
                  trigger={isVisible} 
                />
              </span>

              <StreamingText 
                text=" over the lazy dog." 
                delay={2000} 
                speed={40} 
                showCursor={true} 
                trigger={isVisible} 
              />
            </div>
          </div>

          {/* STATS ROW */}
          <div className="mt-6 md:mt-8 grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4">
            {[
              {
                title: "ERRORS FOUND",
                value: "1",
                color: "red",
                icon: "M6.28 5.22a.75.75 0 011.06 0L12 9.88l4.66-4.66a.75.75 0 111.06 1.06L13.06 10.94l4.66 4.66a.75.75 0 11-1.06 1.06L12 12l-4.66 4.66a.75.75 0 11-1.06-1.06L10.94 10.94 6.28 6.28a.75.75 0 010-1.06z",
              },
              {
                title: "WORDS ANALYZED",
                value: "9",
                color: "blue",
                customSvg: (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h6l4 4v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 3v4a1 1 0 0 0 1 1h4" />
                  </>
                ),
              },
              {
                title: "READABILITY",
                value: "98%",
                color: "green",
                icon: "M9.29 16.29a1 1 0 001.42 0L18 9a1 1 0 10-1.42-1.42L10 14.17l-2.29-2.3A1 1 0 006.29 13.3l3 3z",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-[#040613] border border-blue-900/30 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col items-center justify-center transition-all duration-300"
              >
                <div className={`w-4 h-4 md:w-8 md:h-8 mb-1 md:mb-1 text-${stat.color}-400 flex items-center justify-center border border-${stat.color}-400/50 rounded-full p-0.5 md:p-0`}>
                  <svg
                    viewBox="0 0 24 24"
                    fill={stat.color === "blue" ? "none" : "currentColor"}
                    stroke={stat.color === "blue" ? "currentColor" : "none"}
                    strokeWidth={1.5}
                    className="w-full h-full"
                  >
                    {stat.customSvg ? stat.customSvg : <path d={stat.icon} />}
                  </svg>
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-[8px] md:text-sm text-gray-400 uppercase tracking-tight text-center">{stat.title}</p>
              </div>
            ))}
          </div>
        </ShineCard>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}