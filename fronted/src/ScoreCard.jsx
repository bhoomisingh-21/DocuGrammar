import React from "react";
import { CheckCircle } from "lucide-react";

export default function ScoreCard({
  title,
  score,
  label,
  breakdownItems = [],
  statusColor = "blue",
  ringLabel = "",
  primaryText = "",
}) {
  const colors = {
    blue: {
      ring: "#3b82f6",
      text: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    green: {
      ring: "#10b981",
      text: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
  };

  const color = colors[statusColor];

  return (
    <div className="relative rounded-3xl p-6 bg-linear-to-br from-[#020617] via-[#020a1e] to-[#000814] border border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.35)]">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center`}>
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
        </div>
        <h3 className="text-2xl font-semibold tracking-wide">{title}</h3>
      </div>

      {/* SCORE RING */}
      <div className="flex justify-center mb-8">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="52"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="52"
              stroke={color.ring}
              strokeWidth="10"
              fill="none"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={2 * Math.PI * 52 * (1 - score / 100)}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold">{score}</span>
            {primaryText ? (
              <span className="text-sm text-gray-400 mt-1">{primaryText}</span>
            ) : (
              <span className="text-sm text-gray-400 mt-1">{ringLabel}</span>
            )}
          </div>
        </div>
      </div>

      {/* BREAKDOWN */}
      <div className="space-y-3 text-sm mb-6">
        {breakdownItems.map((item, i) => (
          <div key={i} className="flex justify-between text-gray-300">
            <span className="text-gray-400">{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>

      {/* STATUS */}
      <div
        className={`w-full rounded-xl px-4 py-2 ${color.bg} ${color.text} font-medium flex items-center gap-2 border ${color.border}`}
      >
        <CheckCircle className="w-4 h-4" />
        {label}
      </div>
    </div>
  );
}
