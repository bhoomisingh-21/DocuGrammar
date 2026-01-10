import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { motion } from "framer-motion";

export default function Hero({ onDemoClick }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    /* min-h-dvh ensures perfect vertical centering on mobile browsers */
    <div className="flex items-center justify-center min-h-dvh w-full px-4 sm:px-6 py-12 overflow-hidden">
      <motion.div
        className="flex flex-col items-center text-center max-w-6xl w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Tag - Adjusted margin and text size for mobile */}
        <motion.div variants={itemVariants} className="mb-6 md:mb-9">
          <div className="px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-[#111827] border border-blue-400 text-white text-[10px] xs:text-xs md:text-sm
            shadow-md shadow-blue-400/50 hover:shadow-lg hover:shadow-blue-400/70 transition-all duration-500 inline-block">
            <span className="text-blue-400 mr-1">●</span> v2.0 Now Available with AI Rewrite
          </div>
        </motion.div>

        {/* Heading - Fluid scaling from 4xl to 8xl */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] text-white tracking-tight"
        >
          Write flawless English,
          <br className="hidden sm:block" />
          <span className="bg-linear-to-r from-blue-300 via-blue-200 to-blue-400 bg-clip-text text-transparent">
            {" "}instantly & effortlessly.
          </span>
        </motion.h1>

        {/* Subtext - Max-width and text scaling */}
        <motion.p
          variants={itemVariants}
          className="text-gray-400 mt-6 md:mt-8 max-w-sm xs:max-w-md md:max-w-2xl text-sm xs:text-base md:text-lg leading-relaxed"
        >
          DocuGrammar uses advanced AI to correct grammar, refine tone, and
          enhance clarity in real-time. Stop worrying about typos and start
          communicating with confidence.
        </motion.p>

        {/* Buttons - Stacked on mobile, row on SM+ */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-10 w-full sm:w-auto justify-center items-center px-4 sm:px-0"
        >
          {user ? (
            <button
              onClick={() => navigate("/upload")}
              className="
                w-full sm:w-auto
                bg-blue-600 hover:bg-blue-700 transition
                px-6 py-3.5 text-base
                md:px-8 md:py-4 md:text-lg
                rounded-full
                flex justify-center items-center gap-2
                font-semibold text-white
                shadow-xl shadow-blue-500/25
                active:scale-95
              "
            >
              Open Workspace →
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="
                w-full sm:w-auto
                bg-blue-600 hover:bg-blue-700 transition
                px-6 py-3.5 text-base
                md:px-8 md:py-4 md:text-lg
                rounded-full
                flex justify-center items-center gap-2
                font-semibold text-white
                shadow-xl shadow-blue-500/25
                active:scale-95
              "
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5"
              />
              Sign Up to Start
            </button>
          )}

          <button
            onClick={onDemoClick}
            className="
              w-full sm:w-auto
              bg-[#101721] border border-gray-700 hover:border-blue-700 transition
              px-6 py-3.5 text-base
              md:px-8 md:py-4 md:text-lg
              rounded-full
              font-semibold text-white
              active:scale-95
            "
          >
            Try Live Demo →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}