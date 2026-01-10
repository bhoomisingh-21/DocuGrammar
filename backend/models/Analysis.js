import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fileName: { type: String, required: true },
  
  // Store the full content
  originalText: String,
  correctedText: String,
  rewrittenText: String,
  
  // Store the complex data
  issues: Array, 
  styleSuggestions: Array,
  readabilitySuggestions: Array,
  
  // Store the scores
  clarityFeatures: Object,
  toneAnalysis: Object,
  readabilityMetrics: Object,
  selectedChecks: Array,

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Analysis", AnalysisSchema);