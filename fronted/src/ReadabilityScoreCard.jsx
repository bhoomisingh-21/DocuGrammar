export default function ReadabilityScoreCard({ readability }) {
  if (!readability) return null;

  const {
    fleschScore = 78,
    gradeLevel = "9th Grade",
    avgSentenceLength = 16,
  } = readability;

  let label = "Moderate";
  if (fleschScore >= 85) label = "Easy to Read";
  else if (fleschScore < 60) label = "Challenging";

  return (
    <div
      className="
        relative rounded-3xl p-10
        bg-linear-to-br from-[#020617] via-[#07122b] to-[#020617]
        border border-white/10
        shadow-[0_0_60px_rgba(34,197,94,0.35)]
      "
    >
      <h3 className="text-2xl font-semibold mb-8">
        Readability Score
      </h3>

      <div className="text-center mb-8">
        <span className="text-4xl font-semibold">{fleschScore}</span>
        <div className="text-sm text-gray-400">{gradeLevel}</div>
      </div>

      <div className="flex justify-between text-gray-300 mb-6">
        <span className="text-gray-400">Avg. Sentence Length</span>
        <span className="font-medium">{avgSentenceLength}</span>
      </div>

      <div className="text-center text-green-400 font-medium">
        {label}
      </div>
    </div>
  );
}
