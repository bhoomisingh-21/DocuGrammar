import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import FooterSection from "./FooterSection";
import {
  FileText, CheckCircle, Lightbulb, TrendingUp,
  Info, Copy, Download, Check, ArrowLeft, Save
} from "lucide-react";

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

  //Save to MongoDB Function
  const handleSaveToHistory = async () => {
    if (isSaved) return; // Prevent double saves

    const analysisSession = {
      userId: "test_user_id",
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


  if (!location.state) {
    return (
      <div className="min-h-screen bg-[#030a1a] flex items-center justify-center p-6">
        <button onClick={() => navigate("/")} className="text-blue-400 flex items-center gap-2">
          <ArrowLeft size={20} /> Please upload a file first
        </button>
      </div>
    );
  }

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

const Card = ({ title, icon, children, actions }) => (
  <div className="rounded-2xl md:rounded-3xl bg-[#0a101f] border border-white/10 shadow-lg flex flex-col">
    <div className="bg-white/2 px-4 md:px-8 py-4 md:py-5 border-b border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="opacity-80 scale-90 md:scale-100">{icon}</div>
        <h3 className="text-base md:text-lg font-bold tracking-tight text-white">{title}</h3>
      </div>
      {actions}
    </div>
    <div className="p-4 md:p-8">{children}</div>
  </div>
);

const HighlightedText = ({ text, issues }) => {
  if (!text) return "—";
  if (!issues.length) return text;

  const elements = [];
  let lastIndex = 0;
  const sortedIssues = [...issues].sort((a, b) => a.start - b.start);

  sortedIssues.forEach((issue, i) => {
    const { start, end, type, replacement, reason, message, id } = issue;
    const isAI = id?.toString().startsWith('ai-');

    if (start > lastIndex) {
      elements.push(<span key={`text-${i}`}>{text.slice(lastIndex, start)}</span>);
    }

    elements.push(
      <span
        key={`issue-${i}`}
        className={`group relative inline-block cursor-help border-b-2 leading-loose transition-all ${isAI ? "border-blue-500/60 hover:bg-blue-500/10"
          : type === "grammar" ? "border-red-500/60 hover:bg-red-500/10"
            : "border-yellow-400/60 hover:bg-yellow-400/10"
          }`}
      >
        {text.slice(start, end)}
        <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 md:w-72 p-4 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all z-50 pointer-events-none translate-y-2 group-hover:translate-y-0 ${isAI ? "bg-blue-600 text-white" : type === "grammar" ? "bg-red-600 text-white" : "bg-yellow-500 text-black"
          }`}>
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">{isAI ? "AI Suggestion" : `${type} issue`}</span>
          </div>
          <div className="text-[12px] md:text-[13px] leading-snug font-medium mb-2">{reason || message}</div>
          {replacement && <div className="mt-2 p-2 rounded-lg text-[11px] font-bold bg-black/20 text-white">Suggested: {replacement}</div>}
        </span>
      </span>
    );
    lastIndex = end;
  });

  if (lastIndex < text.length) elements.push(<span key="rest">{text.slice(lastIndex)}</span>);
  return <>{elements}</>;
};

const InsightList = ({ data, type }) => {
  const isStyle = type === "style";
  if (!data.length) return <div className="py-8 text-center text-gray-500 italic border border-white/5 rounded-2xl">Everything looks great.</div>;
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="bg-white/3 border border-white/10 rounded-xl p-4 transition-all hover:bg-white/6">
          <div className="flex items-start gap-4">
            <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${isStyle ? "border-yellow-500/50 text-yellow-500" : "border-purple-500/50 text-purple-400"}`}>
              {i + 1}
            </span>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{isStyle ? "Tone & Style" : "Clarity & Flow"}</span>
              <p className="text-[14px] md:text-[15px] text-gray-200 leading-snug">{item}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const TextBox = ({ children, large, innerRef }) => (
  <div
    ref={innerRef}
    className={`bg-[#020617] rounded-xl md:rounded-2xl p-4 md:p-6 text-gray-300 leading-relaxed transition-all 
      ${large ? "text-base md:text-lg" : "text-sm md:text-base"} 
      selection:bg-blue-500/30 selection:text-blue-100`}
  >
    {children || "—"}
  </div>
);


const Tag = ({ children, color }) => {
  const styles = {
    red: "bg-red-500/10 text-red-400",
    yellow: "bg-yellow-500/10 text-yellow-400",
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-green-500/10 text-green-400"
  };

  const selectedStyle = styles[color] || styles.yellow;

  return (
    <span className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${selectedStyle}`}>
      {children}
    </span>
  );
};


const Row = ({ label, value }) => (
  <div className="flex justify-between text-xs md:text-sm">
    <span className="text-gray-400">{label}</span>
    <span className="text-gray-100 font-medium">{value}</span>
  </div>
);

const ClarityCard = ({ clarityFeatures }) => {
  if (!clarityFeatures) return null;
  const score = Math.max(60, Math.round(100 - clarityFeatures.grammarIssues * 5));
  return (
    <ScoreCard title="Clarity Score" score={score} label={score >= 85 ? "Very Clear" : "Positive & Clear"} color="#3b82f6" subText="Clarity" description="Measures ease of understanding.">
      <Row label="Sentence Length" value={clarityFeatures.avgSentenceLength} />
      <Row label="Grammar Issues" value={clarityFeatures.grammarIssues} />
      <Row label="Spelling Issues" value={clarityFeatures.spellingIssues} />
    </ScoreCard>
  );
};

const ToneCard = ({ tone }) => {
  if (!tone) return null;
  const score = tone.confidenceLevel === "High" ? 90 : 75;
  return (
    <ScoreCard title="Tone Analysis" score={score} label={score >= 85 ? "Positive & Clear" : "Balanced"} color="#a855f7" subText={tone.primaryTone} description="Identifies writing vibe.">
      <Row label="Professional" value={tone.formality === "Formal" ? "High" : "Medium"} />
      <Row label="Formality" value={tone.formality} />
      <Row label="Engagement" value={tone.emotionalIntensity || "Medium"} />
    </ScoreCard>
  );
};

const ReadabilityScoreCard = ({ readability }) => {
  if (!readability) return null;
  const score = readability.score || 0;
  const color = score >= 70 ? "#22c55e" : "#eab308";
  return (
    <ScoreCard title="Readability" score={score} label={readability.level === "Easy" ? "Simple & Clear" : "Detailed Text"} color={color} subText={readability.level} description="Flesch Reading Ease score.">
      <Row label="Avg. Sentence" value={`${readability.avgSentence} words`} />
      <Row label="Reading Ease" value={`${score}/100`} />
      <Row label="Reading Time" value={`${readability.readingTime} min`} />
    </ScoreCard>
  );
};

const ScoreCard = ({ title, score, label, color, subText, children, description }) => (
  <div className="relative rounded-3xl p-6 md:p-8 bg-linear-to-br from-[#020617] via-[#07122b] to-[#020617] border border-white/10 flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-white">{title}</h3>

        <div className="group relative">
          <Info className="w-4 h-4 text-gray-500 cursor-help hover:text-blue-400 transition-colors" />

          <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-[#1e293b] border border-white/10 text-white text-[11px] rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
            <div className="font-bold mb-1 border-b border-white/10 pb-1 uppercase tracking-tighter text-blue-400">
              What is this?
            </div>
            {description}
            <div className="absolute top-full right-1 w-2 h-2 bg-[#1e293b] rotate-45 border-r border-b border-white/10 -translate-y-1"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative w-36 h-36 md:w-44 md:h-44">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
            <circle
              cx="60" cy="60" r="54"
              stroke={color} strokeWidth="6" fill="none"
              strokeDasharray={339.29}
              strokeDashoffset={339.29 * (1 - score / 100)}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl md:text-4xl font-black text-white leading-none">{score}</span>
            <span className="text-[11px] md:text-[13px] font-bold uppercase tracking-widest text-gray-200 mt-2 whitespace-nowrap px-4 text-center">
              {subText}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">{children}</div>
    </div>

    <div className="w-full rounded-xl py-3 px-4 bg-white/5 border border-white/10 text-center text-xs md:text-sm font-black uppercase tracking-widest" style={{ color }}>
      {label}
    </div>
  </div>
);