import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Wand2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Import your Auth hook
import { ArrowRight, Sparkles } from "lucide-react"; // Optional: adding icons

export default function DocuGrammarDemo() {
  const [fixed, setFixed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const startAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setFixed(true);
    }, 1500);
  };
  const { user } = useAuth(); // Get user status

  return (
    <div className="min-h-screen bg-linear-to-br from-[#031026] via-[#030d1b] to-[#091c37] text-white flex items-center justify-center pt-24 md:pt-30 p-4 md:p-6 pb-15 relative overflow-hidden">
      {/* Soft blue ambient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 md:left-32 w-[300px] md:w-[480px] h-[300px] md:h-[480px] bg-blue-700/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-10 right-20 w-[380px] h-[380px] bg-blue-500/15 blur-[110px] rounded-full"></div>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* LEFT CONTENT */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 text-xs border border-blue-900 bg-blue-900/20 font-medium text-blue-400 px-3 py-1 rounded-full mb-6">
            ⚡ LIVE DEMO
          </span>

          <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight mb-6">
            See the magic happen <br />
            <span className="bg-linear-to-r from-blue-200 via-blue-300 to-blue-400 bg-clip-text text-transparent">
              in real-time.
            </span>
          </h1>

          <p className="text-gray-400 max-w-xl mb-10 mx-auto lg:mx-0">
            Experience the power of our advanced AI engine. It goes beyond simple
            spell-check to understand context, tone, and nuance.
          </p>

          <div className="space-y-4 max-w-lg mx-auto lg:mx-0">
            {[{
              title: "Smart Grammar Check",
              desc: "Catches subtle errors standard checkers miss",
            }, {
              title: "Tone Adjustment",
              desc: "Modify text to sound professional, friendly, or academic",
            }, {
              title: "Clarity Improvements",
              desc: "Simplifies complex sentences for better readability",
            }].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow text-left">
                <div className="shrink-0 w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">✓</div>
                <div>
                  <p className="font-semibold text-sm md:text-base">{item.title}</p>
                  <p className="text-xs md:text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT DEMO PANEL */}
        <motion.div
          layout
          className="bg-linear-to-br from-[#0c1220] to-[#0a0f1c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden mt-8 lg:mt-19"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>
            <div className="hidden sm:block text-xs text-gray-400">Sans · Serif · Mono</div>
            <div className={`text-sm ${fixed ? "text-emerald-400" : "text-red-400"}`}>
              {fixed ? "All clear" : "3 issues found"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* TEXT AREA */}
            <div className="md:col-span-2 relative p-4 md:p-6 text-base md:text-lg font-serif leading-relaxed bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-[#071220] to-transparent">
              <div className={`${analyzing ? "blur-sm pointer-events-none" : ""} transition-all duration-300`}>
                {fixed ? (
                  <div className="bg-[#07202a] border border-white/5 rounded-xl p-5 md:p-6 h-full">
                    <p className="text-gray-200">
                      There are too many errors in this sentence. It doesn't look very
                      professional, and I need help fixing it as soon as possible.
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#07121b] border border-white/5 rounded-xl p-5 md:p-6 h-full">
                    <p className="text-gray-200">
                      <span className="underline decoration-red-500 underline-offset-2">Thier</span> are <span className="underline decoration-red-500 underline-offset-2">to</span> many errors in this <span className="underline decoration-red-500 underline-offset-2">sentance</span>. It <span className="underline decoration-yellow-400 underline-offset-2">don't</span> look very
                      professional and <span className="underline decoration-yellow-400 underline-offset-2">i</span> need help fixing it <span className="underline decoration-yellow-400 underline-offset-2">asap</span>.
                    </p>
                  </div>
                )}
              </div>

              {analyzing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} className="relative">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 w-20 h-20 rounded-full border border-blue-500/30" />
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], boxShadow: ["0 0 15px rgba(56,137,255,0.3)", "0 0 30px rgba(56,137,255,0.5)", "0 0 15px rgba(56,137,255,0.3)"] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-14 h-14 rounded-full bg-blue-500/40 border border-blue-300/30 backdrop-blur-md"
                    />
                  </motion.div>
                </div>
              )}
            </div>

            {/* SIDE PANEL */}
            <div className="md:col-span-1 bg-[#081225] p-3 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-1 mb-4 overflow-x-auto scrollbar-hide">
                  {["GRAMMAR", "TONE", "CLARITY"].map((tab) => (
                    <button key={tab} className="px-3 md:px-4 rounded-xl font-semibold text-[10px] md:text-xs h-9 flex items-center justify-center min-w-10 whitespace-nowrap">
                      {tab}
                    </button>
                  ))}
                </div>

                {!fixed ? (
                  <div className="space-y-4">
                    {[1].map((i) => (
                      <div key={i} className="bg-[#0b1224] border border-white/6 rounded-xl p-4 shadow-inner">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-red-400 font-semibold">Spelling</p>
                            <p className="text-[10px] text-gray-400 mt-1">Change "Thier" to "There"</p>
                          </div>
                          <button className="text-gray-400 text-xs px-2 py-1">✕</button>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full mt-3">
                          <div className="h-2 w-4/5 bg-red-500 rounded-full shadow-[0_6px_18px_rgba(255,59,48,0.12)]"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-8">
                    <CheckCircle className="w-10 h-10 text-emerald-400 mb-4" />
                    <p className="font-semibold text-sm">Perfect!</p>
                  </div>
                )}

                <div className="mt-6 md:mt-auto pb-2">
                  {!fixed ? (
                    <button onClick={startAnalyze} className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 transition rounded-xl py-3 text-sm font-semibold shadow-lg">
                      <Wand2 className="w-4 h-4" /> Try Demo
                    </button>
                  ) : (
                    <button onClick={() => setFixed(false)} className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 transition rounded-xl py-3 text-sm font-semibold">
                      <RefreshCcw className="w-4 h-4" /> Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const testimonials = [
    {
      text: "DocuGrammar completely changed my workflow. I spend 50% less time editing and my clients have noticed the quality jump. It's indispensable.",
      name: "Sarah Jenkins",
      role: "Content Strategist at TechFlow",
      img: "https://i.pravatar.cc/100?img=32",
    },
    {
      text: "The context-aware suggestions are a lifesaver. It understands legal nuances that other tools completely miss. It's like having a second pair of eyes.",
      name: "David Chen",
      role: "Senior Legal Counsel",
      img: "https://i.pravatar.cc/100?img=12",
    },
    {
      text: "English isn't my first language, but with DocuGrammar, my essays read like a native speaker wrote them. It's taught me so much about writing.",
      name: "Elena Rodriguez",
      role: "PhD Candidate",
      img: "https://i.pravatar.cc/100?img=48",
    },
  ];

  return (
    <section className="py-20 md:py-28 px-6 bg-[#020617] text-white">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-5xl bg-linear-to-r from-gray-200 via-blue-100 to-blue-400 bg-clip-text text-transparent font-bold mb-4">
          Loved by writers everywhere
        </h2>
        <p className="text-gray-400">
          Join thousands of professionals who trust us with their words.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((item, i) => (
          <div
            key={i}
            className="group relative bg-linear-to-br from-[#050b1a] to-[#050916] border border-white/10 rounded-3xl p-8 shadow-xl transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(80,150,255,0.35)] hover:border-blue-400/30"
          >
            {/* Glow behind card */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-40 bg-blue-500/20 blur-[45px] transition-all duration-500 -z-10"></div>

            {/* Shine sweep */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              <div className="hidden group-hover:block absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent w-[200%] h-full animate-shimmer"></div>
            </div>

            <div className="flex gap-1 mb-4 text-yellow-400">{"★★★★★"}</div>
            <p className="text-gray-200 mb-8 leading-relaxed">“{item.text}”</p>

            <div className="h-px bg-white/10 my-6"></div>

            <div className="flex items-center gap-4">
              <img src={item.img} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-blue-400">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CTASection() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user status

  return (
    <section className="py-20 md:py-32 px-6 bg-[#020617] relative overflow-hidden">
      {/* Soft ambient glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-40 left-10 md:left-20 w-[300px] md:w-[420px] h-[300px] md:h-[420px] bg-blue-600/20 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-20 right-10 md:right-32 w-[250px] md:w-[350px] h-[250px] md:h-[350px] bg-blue-400/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto relative bg-linear-to-br from-[#071022] to-[#04070f] rounded-[40px] border border-blue-400/30 shadow-[0_0_60px_rgba(40,120,255,0.25)] py-16 md:py-24 px-6 md:px-10 text-center overflow-hidden">
        {/* Shine sweep */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[40px]">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent w-[180%] h-full animate-shimmer opacity-0 hover:opacity-100 transition duration-700"></div>
        </div>

        {/* Icon Glow */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-blue-500/20 border border-blue-300/30 flex items-center justify-center mx-auto mb-10 text-3xl md:text-4xl text-blue-300 shadow-[0_0_40px_rgba(70,140,255,0.4)] animate-pulse-soft">
          ✨
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {user ? `Welcome back, ${user.name.split(' ')[0]}!` : "Ready to elevate your writing?"}
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-base md:text-lg">
          {user 
            ? "Your next masterpiece is waiting. Head over to the dashboard to start a new analysis." 
            : "Join thousands of writers, students, and professionals who trust DocuGrammar to deliver flawless, impactful writing every day."}
        </p>

        {/* CTA BUTTONS - Force one-line on all screens */}
<div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
  {user ? (
    <button
      onClick={() => navigate("/upload")}
      className="w-full sm:w-auto group flex items-center justify-center gap-2 md:gap-3 bg-blue-600 text-white px-6 md:px-12 py-3.5 md:py-4 rounded-full font-bold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
    >
      <Sparkles className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
      <span className="text-base md:text-xl whitespace-nowrap">
        Start Analyzing
      </span>
      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
    </button>
  ) : (
    <button
      onClick={() => navigate("/login")}
      className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-white text-black px-6 md:px-12 py-3.5 md:py-4 rounded-full font-bold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" 
        className="w-5 md:w-6 shrink-0" 
        alt="Google" 
      />
      <span className="text-base md:text-xl whitespace-nowrap">
        Sign up with Google
      </span>
    </button>
  )}
  
  {!user && (
    <p className="text-gray-500 text-xs md:text-sm font-medium whitespace-nowrap">
      No credit card required.
    </p>
  )}
</div>
      </div>
    </section>
  );
}