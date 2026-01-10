function mapToneToUI(tone) {
  if (!tone) return null;

  const confidenceScore =
    tone.confidenceLevel === "High"
      ? 90
      : tone.confidenceLevel === "Medium"
      ? 75
      : 60;

  const professional =
    tone.formality === "Formal"
      ? "High"
      : tone.formality === "Neutral"
      ? "Medium"
      : "Low";

  const engagement =
    tone.emotionalIntensity === "High"
      ? "High"
      : tone.emotionalIntensity === "Medium"
      ? "Medium"
      : "Low";

  let label = "Neutral";
  if (confidenceScore >= 85) label = "Positive & Clear";
  else if (confidenceScore >= 70) label = "Balanced";
  else label = "Needs Confidence";

  return {
    score: confidenceScore,
    primaryTone: tone.primaryTone,
    professional,
    formality: tone.formality,
    engagement,
    label,
  };
}

/* ================= TONE CARD ================= */

export default function ToneCard({ tone }) {
  const uiTone = mapToneToUI(tone);
  if (!uiTone) return null;

  return (
    <div
      className="
        relative rounded-3xl p-10
        bg-linear-to-br from-[#020617] via-[#07122b] to-[#020617]
        border border-white/10
        shadow-[0_0_60px_rgba(59,130,246,0.35)]
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
        </div>
        <h3 className="text-2xl font-semibold tracking-wide">
          Tone Analysis
        </h3>
      </div>

      {/* SCORE */}
      <div className="text-center mb-10">
        <span className="text-4xl font-semibold">{uiTone.score}</span>
        <div className="text-sm text-gray-400 mt-1">
          {uiTone.primaryTone}
        </div>
      </div>

      {/* BREAKDOWN */}
      <div className="space-y-4 text-base mb-8">
        <Row label="Professional" value={uiTone.professional} />
        <Row label="Formality" value={uiTone.formality} />
        <Row label="Engagement" value={uiTone.engagement} />
      </div>

      {/* STATUS */}
      <div
        className="
          w-full rounded-xl px-5 py-3
          bg-blue-500/10
          text-blue-400 font-medium
          text-center
          border border-blue-500/20
        "
      >
        {uiTone.label}
      </div>
    </div>
  );
}
