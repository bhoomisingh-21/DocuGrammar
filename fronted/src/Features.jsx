import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useState } from "react";

// Reusable ShineCard wrapper
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
      className={`relative overflow-hidden rounded-xl h-full ${className}`}
    >
      {/* Shine overlay */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-xl"
        style={{
          background: `radial-gradient(circle at ${coords.x}px ${coords.y}px, rgba(255,255,255,0.18) 0%, transparent 80%)`,
          transition: "background 0.1s",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function Features() {
  return (
    <section className="w-full mt-10 md:mt-24 bg-black py-16 md:py-20 px-6 md:px-12 relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 md:-left-40 -top-20 md:-top-40 w-[300px] md:w-[520px] h-[300px] md:h-[520px] rounded-full bg-blue-600/30 blur-[100px] md:blur-[160px]" />
        <div className="absolute -right-20 md:-right-36 -bottom-20 md:-bottom-40 w-[300px] md:w-[520px] h-[300px] md:h-[520px] rounded-full bg-purple-600/30 blur-[120px] md:blur-[180px]" />
      </div>

      {/* HEADING */}
      <div className="text-center mb-10 md:mb-14 px-2">
        <h2 className="text-3xl md:text-5xl font-bold bg-linear-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
          Powerful features for flawless writing
        </h2>
        <p className="text-gray-400 text-lg md:text-xl mt-3 max-w-2xl mx-auto">
          Everything you need to analyze, correct, and improve your text in one elegant interface.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 md:gap-8">

        {/* LEFT TOP (Deep Context Analysis) */}
        <div className="col-span-12 lg:col-span-8">
          <ShineCard className="bg-[#031027]/95 border border-blue-800/40 p-6 md:p-8">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center mb-6">
              ✨
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">Deep Context Analysis</h3>
            <p className="text-gray-400 mb-6 text-sm md:text-base">
              Our AI understands the nuances of your text, offering suggestions that fit your specific context and tone.
            </p>

            <div className="relative bg-[#031027] border border-blue-800/40 rounded-2xl p-4 md:p-8 overflow-hidden">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(59,130,246,0.25) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(59,130,246,0.25) 1px, transparent 1px)
                  `,
                  backgroundSize: "36px 36px",
                }}
              />

              <div className="relative bg-[#031027] border border-blue-400/60 rounded-xl p-4 md:p-6 max-w-lg mx-auto shadow-2xl">
                <p className="text-blue-400 text-[10px] md:text-xs mb-2 flex justify-between uppercase tracking-wider">
                  AI INSIGHT
                  <span className="text-gray-400">Just now</span>
                </p>
                <p className="text-gray-200 text-xs md:text-sm leading-relaxed">
                  The tone of this paragraph shifts abruptly. Consider using more transitional phrases like
                  <span className="text-blue-400 font-medium"> "furthermore"</span> or
                  <span className="text-blue-400 font-medium"> "however"</span>.
                </p>

                <div className="flex gap-2 md:gap-3 mt-5">
                  <button className="bg-blue-600 text-white hover:bg-blue-500 px-4 md:px-5 py-2 rounded-md text-xs md:text-sm transition-all">
                    Apply Fix
                  </button>
                  <button className="bg-transparent px-4 md:px-5 py-2 rounded-md text-xs md:text-sm border border-gray-700 text-gray-400 hover:text-white transition-all">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </ShineCard>
        </div>

        {/* RIGHT TOP (Real-time Correction) */}
        <div className="col-span-12 lg:col-span-4">
          <ShineCard className="bg-[#031027]/95 border border-blue-800/40 p-6 md:p-8">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center mb-6">
              ⚡
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">Real-time Correction</h3>
            <p className="text-gray-400 mb-6 text-sm md:text-base">
              Instant feedback as you type, so you can fix errors on the fly.
            </p>

            <div className="relative bg-[#031027] border border-blue-800/40 rounded-2xl p-8 md:p-12 flex items-center justify-center overflow-hidden min-h-[220px]">
              <div className="absolute w-40 h-40 bg-blue-500/20 blur-3xl rounded-full" />
              <svg
                viewBox="0 0 24 24"
                className="relative z-10 w-20 h-20 drop-shadow-[0_0_40px_rgba(59,130,246,0.8)]"
                fill="url(#blueBoltGradient)"
              >
                <defs>
                  <linearGradient id="blueBoltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#93c5fd" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
                <path d="M13 2L3 14h7l-1 8 11-14h-7l0-6z" />
              </svg>
            </div>
          </ShineCard>
        </div>

        {/* LEFT BOTTOM (Document Support) */}
        <div className="col-span-12 lg:col-span-4 order-last lg:order-0">
          <ShineCard className="bg-[#031027]/95 border border-blue-800/40 p-6 md:p-8">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center mb-6">
              📄
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">Document Support</h3>
            <p className="text-gray-400 mb-6 text-sm md:text-base">
              Upload PDF, DOCX, or TXT files for comprehensive analysis.
            </p>

            <div className="relative mt-4 bg-[#031027] border border-blue-800/40 rounded-2xl h-[180px] flex items-center justify-center overflow-hidden scale-90 md:scale-100">
              {/* File Stack - Adjusted for better mobile display */}
              <div className="absolute left-1/2 -translate-x-[110px] top-10 w-20 h-14 bg-[#031027] border border-sky-500/60 rounded-lg flex flex-col items-center justify-center text-sky-400 text-xs opacity-70">
                <div className="font-bold">TXT</div>
              </div>

              <div className="absolute left-1/2 translate-x-10 top-6 w-24 h-18 bg-[#031027] border border-green-500/60 rounded-lg flex flex-col items-center justify-center text-green-400 text-sm shadow-lg">
                <div className="font-bold text-lg">DOCX</div>
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 top-2 w-24 h-18 mt-2 bg-[#031027] border border-red-500/70 rounded-lg flex flex-col items-center justify-center text-red-400 text-sm shadow-2xl z-10">
                <div className="font-bold text-lg">PDF</div>
              </div>
            </div>
          </ShineCard>
        </div>

        {/* RIGHT BOTTOM (Plagiarism Check) */}
        <div className="col-span-12 lg:col-span-8">
          <ShineCard className="bg-[#031027]/95 border border-blue-800/40 p-6 md:p-8 shadow-xl">
            <motion.div
              whileHover={{ scale: 1.12 }}
              transition={{ type: "spring", stiffness: 180 }}
              className="w-12 h-12 rounded-xl bg-blue-500/60 flex items-center justify-center mb-6 text-2xl shadow-lg"
            >
              🛡️
            </motion.div>

            <h3 className="text-xl font-semibold text-white mb-2">Plagiarism Check</h3>
            <p className="text-gray-400 mb-6 text-sm md:text-base">
              Ensure your content is original with our integrated database scan.
            </p>

            <div className="bg-[#031027] border border-blue-800/40 rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between text-xs md:text-sm mb-3">
                <span className="text-green-400">● Analysis Complete</span>
                <span className="text-green-400 font-bold">
                  <CountUp end={100} duration={1.2} />% Unique
                </span>
              </div>

              <div className="h-2.5 bg-[#061026] rounded-full overflow-hidden mb-6 relative">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.3, ease: "easeOut" }}
                  className="h-full bg-linear-to-r from-blue-500 to-green-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-[#031027] border border-blue-900 rounded-lg p-3 md:p-4 text-center">
                  <div className="text-xl md:text-3xl font-bold text-white">
                    <CountUp end={0} duration={1} />%
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">Plagiarized</div>
                </div>

                <div className="bg-[#031027] border border-blue-900 rounded-lg p-3 md:p-4 text-center">
                  <div className="text-xl md:text-3xl font-bold text-white">50B+</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">Sources</div>
                </div>
              </div>
            </div>
          </ShineCard>
        </div>

      </div>
    </section>
  );
}