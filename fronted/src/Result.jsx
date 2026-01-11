  import React, { useState, useRef } from "react";
  import { useLocation, useNavigate } from "react-router-dom";
  import Navbar from "./NavBar";
  import FooterSection from "./FooterSection";
  import {
    FileText, CheckCircle, Lightbulb, TrendingUp, Copy, Download, Check, ArrowLeft, Save, Info as InfoIcon,
  } from "lucide-react";
  import { useAuth } from "./context/AuthContext"; 
  import ReadabilityScoreCard from "./ReadabilityScoreCard";
  import ClarityCard from "./ClarityCard";
  import ToneCard from "./ToneCard";
  import HighlightedText from "./HighlightedText";
  import InsightList from "./InsightList";
  import TextBox from "./TextBox";
  import Card from "./Card";
  import Tag from "./Tag";


export default function AnalysisResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  // Destructure selectedChecks from state
  const {
    _id,
    originalText = "",
    correctedText = "",
    rewrittenText = "",
    styleSuggestions = [],
    readabilitySuggestions = [],
    issues = [],
    clarityFeatures = null,
    toneAnalysis = null,
    readabilityMetrics = null,
    selectedChecks = [],
    fileName = "Document.pdf" 
  } = location.state || {};

  /* --- Action Handlers --- */
  const isFromHistory = !!_id;
  const correctedRef = useRef(null);
  const rewriteRef = useRef(null);
  const [copiedSection, setCopiedSection] = useState("");

  // Helper function to check if a specific check was requested
  const isEnabled = (checkName) => selectedChecks.includes(checkName);

  const handleCopy = (text, section, elementRef) => {
    navigator.clipboard.writeText(text);
    if (elementRef.current) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(elementRef.current);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    setCopiedSection(section);
    setTimeout(() => {
      setCopiedSection("");
      window.getSelection().removeAllRanges();
    }, 2000);
  };

  const handleDownload = (text, fileName) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
// 1. Make sure you are getting 'user' from your AuthContext at the top of your component
  const { user } = useAuth(); 

 const handleSaveToHistory = async () => {
    if (isSaved) return;

    // 1. Get the actual ID. Try uid, then _id, then googleId
    const currentUserId = user?.uid || user?._id || user?.googleId;

    // 2. Updated Check
    if (!user || !currentUserId) {
      alert("Please log in to save your analysis.");
      console.log("Debug - User Object:", user); // This will help you see what's inside 'user'
      return;
    }

    const analysisSession = {
      userId: currentUserId, // <--- CHANGED THIS from "test_user_id" to user.uid
      fileName,
      originalText,
      correctedText,
      rewrittenText,
      styleSuggestions,
      readabilitySuggestions,
      issues,
      clarityFeatures,
      toneAnalysis,
      readabilityMetrics,
      selectedChecks,
    };

    try {
      const response = await fetch("https://docugrammar-backend.onrender.com/api/save-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analysisSession),
      });

      if (response.ok) {
        setIsSaved(true);
      } else {
        alert("❌ Failed to save.");
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#030a1a] via-[#050f24] to-[#020617] text-white">
      <Navbar />

      <section className="pt-24 md:pt-32 pb-10 md:pb-16 px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Analysis Results</h1>
        <p className="mt-3 text-gray-400 text-base md:text-lg">Your document has been analyzed based on your selected checks</p>
      </section>

      <section className="px-4 md:px-6 pb-24 flex justify-center">
        <div className="w-full max-w-7xl space-y-8 md:space-y-12">

          {/* MINIMALIST ACTION BAR - Responsive Stack */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 md:mb-10 w-full px-2">

            {/* Back Button */}
            <button
              onClick={() => isFromHistory ? navigate("/profile") : navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
                {isFromHistory ? "Back to Profile" : "Back to Upload"}
              </span>
            </button>

            {/* CONDITIONAL RENDER: Save Button */}
            {!isFromHistory && (
              <button
                onClick={handleSaveToHistory}
                disabled={isSaved}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 border px-6 py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${isSaved
                    ? "border-green-500/50 text-green-400 cursor-default bg-green-500/10"
                    : "border-blue-500/50 hover:bg-blue-500 hover:text-white text-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  }`}
              >
                {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {isSaved ? "Saved to Profile" : "Save to Profile"}
              </button>
            )}
          </div>

          {/* TEXT COMPARISON GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            {/* ALWAYS SHOW ORIGINAL */}
            <Card title="Original Text" icon={<FileText className="w-5 h-5 text-blue-400" />}>
              <TextBox>
                <HighlightedText text={originalText} issues={issues} />
              </TextBox>
              <div className="flex flex-wrap gap-2 mt-4">
                <Tag color="red">Grammar</Tag>
                <Tag color="yellow">Spelling</Tag>
                <Tag color="blue">AI Suggestion</Tag>
              </div>
            </Card>

            {/* ONLY SHOW CORRECTED IF GRAMMAR IS SELECTED */}
            {isEnabled("Grammar") && (
              <Card
                title="Corrected Text"
                icon={<CheckCircle className="w-5 h-5 text-green-400" />}
                actions={
                  <div className="flex gap-2">
                    <ActionButton
                      icon={copiedSection === "corrected" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      label={copiedSection === "corrected" ? "Copied" : "Copy"}
                      onClick={() => handleCopy(correctedText, "corrected", correctedRef)}
                    />
                    <ActionButton
                      icon={<Download className="w-4 h-4" />}
                      label="Download"
                      onClick={() => handleDownload(correctedText, "corrected_text")}
                    />
                  </div>
                }
              >
                <TextBox innerRef={correctedRef}>{correctedText}</TextBox>
              </Card>
            )}
          </div>

          {/* MODERN REWRITE CARD */}
          {isEnabled("Rewrite") && (
            <Card
              title="Modern Rewrite"
              icon={<Lightbulb className="w-5 h-5 text-blue-400" />}
              actions={
                <div className="flex gap-2">
                  <ActionButton
                    icon={copiedSection === "rewrite" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    label={copiedSection === "rewrite" ? "Copied" : "Copy"}
                    onClick={() => handleCopy(rewrittenText, "rewrite", rewriteRef)}
                  />
                  <ActionButton
                    icon={<Download className="w-4 h-4" />}
                    label="Download"
                    onClick={() => handleDownload(rewrittenText, "modern_rewrite")}
                  />
                </div>
              }
            >
              <TextBox large innerRef={rewriteRef}>{rewrittenText}</TextBox>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1 px-4 md:px-7 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs md:text-sm">
                  <Lightbulb className="w-4 h-4" /> AI enhanced, Improved tone & flow
                </span>
              </div>
            </Card>
          )}

          {/* INSIGHTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {isEnabled("Style Suggestions") && (
              <Card title="Style Improvements" icon={<Lightbulb className="w-6 h-6 text-yellow-400" />}>
                <InsightList data={styleSuggestions} type="style" />
              </Card>
            )}
            {isEnabled("Readability Suggestion") && (
              <Card title="Readability Insights" icon={<TrendingUp className="w-6 h-6 text-purple-400" />}>
                <InsightList data={readabilitySuggestions} type="readability" />
              </Card>
            )}
          </div>

          {/* SCORE CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {isEnabled("Clarity Score") && <ClarityCard clarityFeatures={clarityFeatures} />}
            {isEnabled("Tone") && <ToneCard tone={toneAnalysis} />}
            {isEnabled("Ease of Reading Score") && <ReadabilityScoreCard readability={readabilityMetrics} />}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}

/* ================= COMPONENTS ================= */

const ActionButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-[10px] md:text-xs font-medium"
  >
    {icon}
    <span className="hidden xs:inline">{label}</span>
  </button>
);


