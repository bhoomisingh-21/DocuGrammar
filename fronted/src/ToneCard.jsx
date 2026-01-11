
import ScoreCard from "./ScoreCard";
import Row from "./Row";

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

export default ToneCard;
