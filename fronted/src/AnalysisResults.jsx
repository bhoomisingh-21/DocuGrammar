import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../NavBar";
import FooterSection from "../FooterSection";

import {
  FileText,
  ArrowLeft,
  Copy,
  Download,
  CheckCircle,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

import Card from "./Card";
import TextBox from "./TextBox";
import Tag from "./Tag";
import HighlightedText from "./HighlightedText";
import InsightList from "./InsightList";
import ClarityScoreCard from "./ClarityScoreCard";
import ToneCard from "./ToneCard";

export default function AnalysisResults() {
  const location = useLocation();

  const {
    originalText = "",
    correctedText = "",
    rewrittenText = "",
    styleSuggestions = [],
    readabilitySuggestions = [],
    issues = [],
    clarityFeatures = null,
    toneAnalysis = null,
    fileName = "Document.pdf" // <--- ADD THIS LINE
  } = location.state || {};


  const handleSaveToHistory = async () => {
    // UPDATED: Include EVERYTHING so history can restore the full page
    const analysisData = {
      userId: "temporary_test_id",
      fileName: fileName || "Untitled Document", // Ensure fileName is defined
      originalText,
      correctedText,
      rewrittenText,
      styleSuggestions,
      readabilitySuggestions,
      issues,
      clarityFeatures,
      toneAnalysis,
      // Add these to match your new Schema
      score: clarityFeatures?.score || 0,
      issueCount: issues.length
    };

    try {
      const response = await fetch("https://docugrammar-backend.onrender.com/api/save-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analysisData),
      });

      if (response.ok) {
        alert("✅ Full analysis saved to your profile!");
      }
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#030a1a] via-[#050f24] to-[#020617] text-white">
      <Navbar />

      <section className="px-6 pb-24 flex justify-center">
        <div className="w-full max-w-7xl space-y-12">


          {/* ACTION BAR */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Upload
            </button>

            <div className="flex gap-4">
              <button
                onClick={handleSaveToHistory}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20"
              >
                <Download className="w-4 h-4" /> Save to Profile
              </button>
            </div>
          </div>

          {/* ORIGINAL VS CORRECTED */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            <Card title="Original Text" icon={<FileText className="w-5 h-5 text-blue-400" />}>
              <TextBox>
                <HighlightedText text={originalText} issues={issues} />
              </TextBox>

              <div className="flex gap-2 mt-4">
                <Tag color="red">Grammar</Tag>
                <Tag color="yellow">Spelling</Tag>
              </div>
            </Card>

            <Card title="Corrected Text" icon={<CheckCircle className="w-5 h-5 text-green-400" />}>
              <TextBox>{correctedText}</TextBox>

              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold">
                <CheckCircle className="w-4 h-4" />
                Fully corrected version
              </div>
            </Card>
          </div>

          {/* REWRITE */}
          <Card title="Modern Rewrite" icon={<Lightbulb className="w-5 h-5 text-blue-400" />}>
            <TextBox large>{rewrittenText}</TextBox>

            <span className="mt-4 inline-flex items-center gap-1 px-7 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-s">
              <Lightbulb className="w-4 h-4" />
              AI enhanced, Improved tone & flow
            </span>
          </Card>

          {/* LIST CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            <Card title="Style Improvements" icon={<Lightbulb className="w-6 h-6 text-yellow-400" />}>
              <InsightList data={styleSuggestions} tone="style" />
            </Card>

            <Card title="Readability Insights" icon={<TrendingUp className="w-6 h-6 text-purple-400" />}>
              <InsightList data={readabilitySuggestions} tone="readability" />
            </Card>
          </div>

          {/* SCORE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ClarityScoreCard clarityFeatures={clarityFeatures} />
            <ToneCard tone={toneAnalysis} />
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8" />
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
