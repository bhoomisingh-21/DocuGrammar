import Info from "./Info";
import { Info as InfoIcon } from "lucide-react";
import ScoreCard from "./ScoreCard";
import Row from "./Row";


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

export default ClarityCard;
