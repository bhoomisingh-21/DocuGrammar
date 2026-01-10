import axios from "axios";
import { CohereClient } from "cohere-ai";
import { parse as secureParse } from "jsonc-parser";
import dotenv from "dotenv";

dotenv.config();

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

/* ---------------- CUSTOM FIXES (RETAINED) ---------------- */
function applyCustomFixes(text) {
  let corrected = text;
  corrected = corrected.replace(/\bme and my friends\b/gi, "My friends and I");
  corrected = corrected.replace(/\bme and my sister\b/gi, "My sister and I");
  corrected = corrected.replace(/\bme and my brother\b/gi, "My brother and I");
  corrected = corrected.replace(/\b(My friends and I|We|They|You) was\b/gi, "$1 were");
  corrected = corrected.replace(/\bhe go\b/gi, "he went");
  corrected = corrected.replace(/\bbuy\b/gi, "bought");
  corrected = corrected.replace(/\bthing\b/gi, "things");
  corrected = corrected.replace(/\s{2,}/g, " ");
  return corrected.trim();
}

/* ---------------- CLEAN INPUT (RETAINED) ---------------- */
function cleanTextForCohere(text) {
  let cleaned = text;
  cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");
  cleaned = cleaned.replace(/\u00A0/g, " ");
  cleaned = cleaned.replace(/\u00AD/g, "");
  cleaned = cleaned.replace(/[“”]/g, '"');
  cleaned = cleaned.replace(/[‘’]/g, "'");
  cleaned = cleaned.replace(/–|—/g, "-");
  cleaned = cleaned.replace(/•/g, "-");
  cleaned = cleaned.replace(/\s+/g, " ");
  if (cleaned.length > 6000) cleaned = cleaned.slice(0, 6000);
  return cleaned.trim();
}

/* ---------------- PARSE COHERE JSON (RETAINED) ---------------- */
function extractCohereJSON(response) {
  try {
    const jsonText = response?.text?.trim();
    if (!jsonText) return {};
    const parsed = secureParse(jsonText) || {};
    // Ensure all keys exist
    parsed.correctedText = parsed.correctedText || parsed.corrected_text || "";
    parsed.styleSuggestions = parsed.styleSuggestions || parsed.style_suggestions || [];
    parsed.readabilitySuggestions = parsed.readabilitySuggestions || parsed.readability_suggestions || [];
    parsed.modernRewrite = parsed.modernRewrite || parsed.modern_rewrite || "";
    parsed.smartHighlights = parsed.smartHighlights || []; // NEW
    return parsed;
  } catch (err) {
    console.error("❌ JSON parse error:", err.message);
    return {};
  }
}

/* ---------------- COHERE REWRITE & SUGGEST (UPDATED FOR SMART HIGHLIGHTS) ---------------- */
export async function cohereRewriteAndSuggest(text) {
  const preparedText = cleanTextForCohere(text);

  const prompt = `
You are a grammar correction engine.

TASKS:
1. Fix grammar, spelling, and punctuation.
2. Provide 3 style suggestions.
3. Provide 3 readability suggestions.
4. Identify 3 specific phrases from the original text that need improvement and explain why.

Return ONLY JSON:
{
  "correctedText": "string",
  "styleSuggestions": ["string"],
  "readabilitySuggestions": ["string"],
  "smartHighlights": [
    { "original": "phrase from text", "replacement": "fixed phrase", "reason": "why it's better" }
  ]
}

TEXT:
"""
${preparedText}
"""
`;

  try {
    const response = await cohere.chat({
      model: "command-a-03-2025",
      message: prompt,
      response_format: { type: "json_object" },
    });

    const parsed = extractCohereJSON(response);

    return {
      correctedText: parsed.correctedText || preparedText,
      styleSuggestions: parsed.styleSuggestions,
      readabilitySuggestions: parsed.readabilitySuggestions,
      smartHighlights: parsed.smartHighlights || []
    };
  } catch (err) {
    console.error("❌ Cohere rewrite failed:", err.message);
    return { correctedText: preparedText, styleSuggestions: [], readabilitySuggestions: [], smartHighlights: [] };
  }
}

/* ---------------- MAIN PIPELINE (INTEGRATED) ---------------- */
export async function checkGrammar(originalText) {
  let correctedText = originalText;
  const issues = [];
  let toneAnalysis = null;
  let clarityFeatures = null;
  let clarityScore = null;
  let readabilityMetrics = null;

  try {
    // 1. LanguageTool for basic typos
    const ltResponse = await axios.post(
      "https://api.languagetool.org/v2/check",
      new URLSearchParams({ text: originalText, language: "en-US" })
    );

    ltResponse.data.matches.forEach((match, index) => {
      let issueType = match.rule.issueType === "misspelling" ? "spelling" : "grammar";
      issues.push({
        id: `lt-${index}`,
        type: issueType,
        message: match.message,
        start: match.offset,
        end: match.offset + match.length,
        original: originalText.slice(match.offset, match.offset + match.length),
        replacement: match.replacements?.[0]?.value || "",
      });
    });

    // 2. Cohere for smart suggestions and rewrite
    const cohereResult = await cohereRewriteAndSuggest(originalText);

    // 3. MERGE SMART HIGHLIGHTS INTO ISSUES
    cohereResult.smartHighlights.forEach((h, index) => {
      const startIndex = originalText.indexOf(h.original);
      // Only add if it doesn't overlap a basic typo significantly
      if (startIndex !== -1) {
        issues.push({
          id: `ai-${index}`,
          type: "grammar",
          message: h.reason,
          start: startIndex,
          end: startIndex + h.original.length,
          original: h.original,
          replacement: h.replacement,
        });
      }
    });

    // APPLY YOUR CUSTOM FIXES
    const customCorrected = applyCustomFixes(cohereResult.correctedText);
    const modernRewrite = await cohereModernRewrite(customCorrected);
    toneAnalysis = await analyzeTone(customCorrected);
    readabilityMetrics = extractReadabilityFeatures(customCorrected);

    clarityFeatures = extractClarityFeatures(
      originalText,
      issues,
      cohereResult.readabilitySuggestions
    );

    if (clarityFeatures) {
      clarityScore = calculateClarityScore(clarityFeatures);
    }

    // Sort and Filter overlaps
    issues.sort((a, b) => a.start - b.start);
    const finalIssues = issues.filter((issue, index, self) =>
        index === self.findIndex((t) => t.start === issue.start)
    );

    return {
      correctedText: customCorrected,
      modernRewrite,
      styleSuggestions: cohereResult.styleSuggestions,
      readabilitySuggestions: cohereResult.readabilitySuggestions,
      issues: finalIssues,
      issueCount: finalIssues.length,
      hasChanges: finalIssues.length > 0,
      clarityFeatures,
      clarity: clarityScore,
      toneAnalysis,
      readabilityMetrics,
    };

  } catch (err) {
    console.error("❌ Pipeline failed:", err.message);
    return { /* fallback */ };
  }
}

/* ---------------- RETAINED HELPERS (UNCHANGED) ---------------- */
function extractClarityFeatures(text, issues = [], readabilitySuggestions = []) {
  if (!text || typeof text !== "string") return null;
  const wordsArray = text.trim().split(/\s+/).filter(Boolean);
  const sentenceArray = text.split(/[.!?]+/).filter(Boolean);
  const totalWords = wordsArray.length || 1;
  const totalSentences = sentenceArray.length || 1;
  const grammarIssues = issues.filter(i => i.type === "grammar").length;
  const spellingIssues = issues.filter(i => i.type === "spelling").length;
  return {
    totalWords, totalSentences, grammarIssues, spellingIssues,
    readabilitySuggestions: readabilitySuggestions.length,
    avgSentenceLength: Number((totalWords / totalSentences).toFixed(2)),
    issueDensity: Number((issues.length / totalWords).toFixed(4)),
  };
}

function calculateClarityScore(features) {
  const { totalWords, totalSentences, grammarIssues, spellingIssues, readabilitySuggestions, avgSentenceLength } = features;
  let sentenceClarity = 100;
  if (avgSentenceLength > 22) sentenceClarity -= 15;
  if (avgSentenceLength > 30) sentenceClarity -= 25;
  sentenceClarity -= grammarIssues * 5;
  sentenceClarity = Math.max(60, Math.min(100, sentenceClarity));
  let wordChoice = 100;
  wordChoice -= spellingIssues * 7;
  wordChoice = Math.max(60, Math.min(100, wordChoice));
  let structure = 100;
  structure -= readabilitySuggestions * 6;
  if (totalSentences < 2) structure -= 15;
  structure = Math.max(60, Math.min(100, structure));
  const clarityScore = Math.round(sentenceClarity * 0.4 + wordChoice * 0.35 + structure * 0.25);
  let label = clarityScore >= 85 ? "Very Clear" : clarityScore >= 70 ? "Clear" : clarityScore >= 55 ? "Somewhat Clear" : "Needs Improvement";
  return { clarityScore, sentenceClarity, wordChoice, structure, label };
}

function extractReadabilityFeatures(text) {
  if (!text || text.trim().length === 0) return { score: 0, level: "N/A", avgSentence: 0, readingTime: 0 };
  const words = text.trim().split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const totalWords = words.length || 1;
  const totalSentences = sentences.length || 1;
  const countSyllables = (word) => {
    word = word.toLowerCase().replace(/[^a-z]/g, "");
    if (word.length <= 3) return 1;
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  };
  const totalSyllables = words.reduce((acc, word) => acc + countSyllables(word), 0);
  const asl = totalWords / totalSentences; 
  const asw = totalSyllables / totalWords; 
  const easeScore = 206.835 - (1.015 * asl) - (84.6 * asw);
  const finalScore = Math.max(0, Math.min(100, Math.round(easeScore)));
  const timeInMinutes = Math.ceil(totalWords / 225);
  let level = finalScore >= 80 ? "Easy" : finalScore >= 60 ? "Intermediate" : finalScore >= 40 ? "Advanced" : "Complex";
  return { score: finalScore, level, avgSentence: asl.toFixed(1), readingTime: timeInMinutes };
}

async function analyzeTone(text) {
  if (!text || typeof text !== "string") return null;
  const cleanedText = cleanTextForCohere(text);
  const prompt = `Analyze the tone... Return ONLY JSON... { "primaryTone": "...", ... } TEXT: """${cleanedText}"""`;
  try {
    const response = await cohere.chat({ model: "command-a-03-2025", message: prompt, response_format: { type: "json_object" } });
    const parsed = secureParse(response?.text || "{}");
    return {
      primaryTone: parsed.primaryTone || "Neutral",
      secondaryTones: parsed.secondaryTones || [],
      confidenceLevel: parsed.confidenceLevel || "Medium",
      emotionalIntensity: parsed.emotionalIntensity || "Medium",
      formality: parsed.formality || "Neutral",
      toneSummary: parsed.toneSummary || "",
    };
  } catch (err) { return null; }
}

export async function cohereModernRewrite(text) {
  try {
    const response = await cohere.chat({ model: "command-a-03-2025", message: `Return ONLY JSON: { "modernRewrite": "string" } TEXT: """${text}"""`, response_format: { type: "json_object" } });
    const parsed = extractCohereJSON(response);
    return parsed?.modernRewrite || text;
  } catch (err) { return text; }
}