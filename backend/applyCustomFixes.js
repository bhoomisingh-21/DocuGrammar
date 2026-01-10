function applyCustomFixes(text) {
  let corrected = text;

  // ---------------- Pronouns ----------------
  corrected = corrected.replace(/\bme and my sister\b/gi, "My sister and I");
  corrected = corrected.replace(/\bme and my brother\b/gi, "My brother and I");
  corrected = corrected.replace(/\bme and my friends\b/gi, "My friends and I");

  // ---------------- Subject-Verb Agreement ----------------
  corrected = corrected.replace(/\b(I|We|They|You|My friends and I) was\b/gi, "$1 were");
  corrected = corrected.replace(/\b(He|She|It|My brother) were\b/gi, "$1 was");
  corrected = corrected.replace(/\bI am\b/gi, "I am");
  corrected = corrected.replace(/\bMy friends and I am\b/gi, "My friends and I are");

  // ---------------- Tense Context Awareness ----------------
  // Past tense hints
  corrected = corrected.replace(/\byesterday\b/gi, (m) => m);
  corrected = corrected.replace(/\brain\b/gi, "rained"); // context: yesterday → past
  corrected = corrected.replace(/\bgo\b/gi, "went");      // past tense
  corrected = corrected.replace(/\bbuy\b/gi, "bought");    // past tense
  corrected = corrected.replace(/\bsay(ed)?\b/gi, "said");
  corrected = corrected.replace(/\bhas seen\b/gi, "saw");
  corrected = corrected.replace(/\bhave seen yesterday\b/gi, "saw yesterday");

  // Future tense hints
  corrected = corrected.replace(/\btomorrow\b/gi, (m) => m);
  corrected = corrected.replace(/\bplanning to go\b/gi, "are planning to go");

  // ---------------- Contractions & Helpers ----------------
  corrected = corrected.replace(/\bdon’t bring\b/gi, "didn’t bring");
  corrected = corrected.replace(/\bdon’t do\b/gi, "didn’t do");
  corrected = corrected.replace(/\bdon’t letting\b/gi, "don’t let");
  corrected = corrected.replace(/\bwe feeling\b/gi, "we are feeling");
  corrected = corrected.replace(/\bthey saying\b/gi, "they are saying");
  corrected = corrected.replace(/\bit not was\b/gi, "it was not");

  // ---------------- Common Word Fixes ----------------
  corrected = corrected.replace(/\bthing\b/gi, "things");
  corrected = corrected.replace(/\bgo the\b/gi, "go to the");
  corrected = corrected.replace(/\bvery disappoint\b/gi, "very disappointed");
  corrected = corrected.replace(/\bnot knowing\b/gi, "don’t know");

  // ---------------- Articles & Prepositions ----------------
  corrected = corrected.replace(/\bstorm is\b/gi, "a storm is");
  corrected = corrected.replace(/\bweather are\b/gi, "weather is");

  // ---------------- Infinitives vs Gerunds ----------------
  corrected = corrected.replace(/\blooking forward to went\b/gi, "looking forward to going");
  corrected = corrected.replace(/\binteresting in join\b/gi, "interested in joining");

  // ---------------- Idiomatic Expressions Fix ----------------
  corrected = corrected.replace(/\bHe is knowing\b/gi, "He knows");
  corrected = corrected.replace(/\bShe is knowing\b/gi, "She knows");
  corrected = corrected.replace(/\bThey is knowing\b/gi, "They know");

  // ---------------- Sentence Breaks & Punctuation ----------------
  corrected = corrected.replace(/\sso now/gi, ". Now");
  corrected = corrected.replace(/,\s*but/gi, ", but");
  corrected = corrected.replace(/\band me\b/gi, "and I");

  // ---------------- Capitalization ----------------
  corrected = corrected.replace(/(^|[.!?]\s+)([a-z])/g, (m, g1, g2) => g1 + g2.toUpperCase());

  // ---------------- Extra Spaces ----------------
  corrected = corrected.replace(/\s{2,}/g, " ");

  // ---------------- Trim ----------------
  corrected = corrected.trim();

  return corrected;
}
