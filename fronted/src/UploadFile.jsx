import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; 
import Navbar from "./NavBar";
import FooterSection from "./FooterSection";
import {
  UploadCloud,
  CheckCircle,
  FileText,
  Wand2,
  ShieldCheck,
  Edit3,
  X,
  Loader2,
  ArrowLeft,
} from "lucide-react";

const CHECKS_CONFIG = [
  { label: "Grammar", icon: CheckCircle },
  { label: "Rewrite", icon: Wand2 },
  { label: "Readability Suggestion", icon: Edit3 },
  { label: "Style Suggestions", icon: ShieldCheck },
  { label: "Clarity Score", icon: Wand2 },
  { label: "Tone", icon: FileText },
  { label: "Ease of Reading Score", icon: FileText },
];

export default function UploadFile() {
  const { user } = useAuth(); 
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChecks, setSelectedChecks] = useState(["Grammar", "Rewrite", "Tone"]);
  const navigate = useNavigate();

  const toggleCheck = (label) => {
    setSelectedChecks((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const handleAnalyze = async () => {
    if (isLoading) return;
    if (!file && !text.trim()) return alert("Please upload a file or paste text first!");

    setIsLoading(true);
    try {
      const formData = new FormData();
      file ? formData.append("file", file) : formData.append("text", text);

      const res = await fetch("http://localhost:5000/uploadFile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const payload = {
        originalText: data.originalText || text || "",
        correctedText: data.correctedText || "",
        rewrittenText: data.modernRewrite || "",
        styleSuggestions: data.styleSuggestions || [],
        readabilitySuggestions: data.readabilitySuggestions || [],
        issues: data.issues || [],
        issueCount: data.issueCount || 0,
        clarityFeatures: data.clarityFeatures || null,
        toneAnalysis: data.toneAnalysis || null,
        readabilityMetrics: data.readabilityMetrics || null,
        selectedChecks,
      };

      navigate("/result", { state: payload });
    } catch (err) {
      console.error("Analyze failed:", err);
      alert("Error analyzing file/text.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0b0f19] text-white relative">
      {isLoading && (
        <div className="fixed inset-0 z-60 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md transition-all px-6 text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">Analyzing your content...</h2>
          <p className="text-gray-300 mt-2">Our AI is perfecting your writing.</p>
        </div>
      )}

      <Navbar />

    {/* SUB-HEADER */}
<div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-28 pb-4 flex justify-end md:justify-start">
  <button 
    onClick={() => navigate("/")}
    className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
  >
    {/* Icon stays on left of text for desktop, but you could flip it for mobile if desired */}
    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Explore Home</span>
  </button>
</div>

      {/* HERO SECTION */}
      <section className="text-center py-8 md:py-10 px-4 md:px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl xs:text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-white via-gray-200 to-blue-300 bg-clip-text text-transparent leading-tight">
          Your Writing, Perfected
        </h1>
        <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
          Upload a document or paste text to instantly improve grammar, tone, clarity, and more.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 py-8 md:py-12">
        
        {/* LEFT PANEL: UPLOAD / TEXT AREA */}
        <div className="bg-linear-to-br from-[#050b1a] to-[#050916] border border-blue-500/20 rounded-3xl p-6 md:p-10 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Get Started</h2>

          {!file ? (
            <div className="flex flex-col">
              <label className="border border-dashed border-blue-400/30 rounded-2xl flex flex-col items-center justify-center py-12 md:py-16 cursor-pointer hover:border-blue-400/60 mb-6 transition-all bg-blue-500/5 group">
                <UploadCloud className="w-12 h-12 md:w-14 md:h-14 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-gray-300 text-sm md:text-base text-center px-4">Drag & drop or click to upload</p>
                <p className="text-gray-500 text-xs mt-1">PDF, DOCX, TXT</p>
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              </label>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#050a18] px-2 text-gray-500">OR</span>
                </div>
              </div>

              <textarea
                placeholder="Paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full min-h-[180px] md:min-h-[200px] bg-[#07101f] border border-white/10 rounded-2xl p-4 text-gray-200 mb-6 focus:outline-none focus:border-blue-500/50 transition-colors text-sm md:text-base"
              />
            </div>
          ) : (
            <div className="mb-6 bg-blue-500/10 border border-blue-500/30 p-8 md:p-12 rounded-2xl flex flex-col items-center justify-center relative group">
              <button 
                onClick={() => setFile(null)} 
                className="absolute top-4 right-4 p-2 hover:bg-red-500/20 rounded-full text-gray-400 hover:text-red-400 transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
              </div>
              <p className="text-base md:text-lg text-blue-100 font-medium text-center break-all px-4">{file.name}</p>
              <p className="text-xs md:text-sm text-blue-400/60 mt-2">Ready for analysis</p>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 py-3.5 md:py-4 rounded-xl font-bold text-sm md:text-lg disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] mt-2"
          >
            {isLoading ? "Processing..." : "Analyze Now"}
          </button>
        </div>

        {/* RIGHT PANEL: AI CHECKS */}
        <div className="bg-linear-to-br from-[#050b1a] to-[#050916] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Select AI Checks</h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1">Customize your analysis features</p>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            {CHECKS_CONFIG.map(({ label, icon: Icon }) => {
              const isActive = selectedChecks.includes(label);
              return (
                <div
                  key={label}
                  onClick={() => toggleCheck(label)}
                  className={`p-3.5 md:p-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all border ${
                    isActive 
                      ? "bg-blue-500/15 border-blue-400/40 shadow-[0_0_15px_rgba(56,137,255,0.1)]" 
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`p-2 rounded-lg ${isActive ? "bg-blue-500/20" : "bg-white/5"}`}>
                      <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? "text-blue-300" : "text-gray-500"}`} />
                    </div>
                    <p className={`text-sm md:text-base font-medium transition-colors ${isActive ? "text-white" : "text-gray-400"}`}>
                      {label}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] md:text-xs font-black tracking-tighter transition-colors ${isActive ? "text-emerald-400" : "text-gray-600"}`}>
                      {isActive ? "ACTIVE" : "OFF"}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-700"}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
}