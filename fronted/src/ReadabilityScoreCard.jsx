
import ScoreCard from "./ScoreCard";
import Row from "./Row";

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

export default ReadabilityScoreCard;
