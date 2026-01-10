import { CheckCircle } from "lucide-react";

export default function ClarityScoreCard({ clarityFeatures }) {
  if (!clarityFeatures) return null;

  /* ---------------- SCORE CALCULATION ---------------- */
  const score = Math.max(
    60,
    Math.round(
      100 -
        clarityFeatures.spellingIssues * 5 -
        clarityFeatures.grammarIssues * 7 -
        clarityFeatures.readabilitySuggestions * 3
    )
  );

  const label =
    score >= 85
      ? "Very Clear"
      : score >= 70
      ? "Postive & Clear"
      : "Needs Improvement";

  return (
    <div
      className="
        relative rounded-3xl p-10
        bg-linear-to-br from-[#020617] via-[#020a1e] to-[#000814]
        border border-white/10
        shadow-[0_0_60px_rgba(29,78,216,0.22)]
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
        </div>
        <h3 className="text-2xl font-semibold tracking-wide">
          Clarity Score
        </h3>
      </div>

      {/* SCORE RING */}
      <div className="flex justify-center mb-12">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="58"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="72"
              cy="72"
              r="58"
              stroke="#3b82f6"
              strokeWidth="10"
              fill="none"
              strokeDasharray={2 * Math.PI * 58}
              strokeDashoffset={
                2 * Math.PI * 58 * (1 - score / 100)
              }
              strokeLinecap="round"
              className="drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold">{score}</span>
            <span className="text-base text-gray-400 mt-1">
              Clarity
            </span>
          </div>
        </div>
      </div>

      {/* BREAKDOWN */}
      <div className="space-y-4 text-base mb-10">
        <div className="flex justify-between">
          <span className="text-gray-400">Sentence Length</span>
          <span className="text-green-400 font-medium">
            {clarityFeatures.avgSentenceLength}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Grammar Issues</span>
          <span className="text-green-400 font-medium">
            {clarityFeatures.grammarIssues}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Spelling Issues</span>
          <span className="text-yellow-400 font-medium">
            {clarityFeatures.spellingIssues}
          </span>
        </div>
      </div>

      {/* STATUS */}
      <div
        className="
          w-full rounded-xl px-5 py-3
          bg-linear-to-r from-green-500/10 to-green-400/5
          text-green-400 font-medium text-m
          flex items-center gap-2
          border border-green-500/20
        "
      >
        <CheckCircle className="w-4 h-4" />
        {label}
      </div>
    </div>
  );
}
