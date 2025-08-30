import { SUBSTITUTIONS, suggestSubstitutions } from "./substitutions.js";

export function computeMatchScore(available, recipeIngredients) {
  const availableSet = new Set(available.map(x=>x.toLowerCase()));
  const recipeNorm = recipeIngredients.map(r=>r.toLowerCase());
  const matches = recipeNorm.filter(i => availableSet.has(i));
  const missing = recipeNorm.filter(i => !availableSet.has(i));
  const total = recipeNorm.length || 1;
  const baseScore = matches.length / total;

  // substitution bonus
  let substitutionCount = 0;
  missing.forEach(m => {
    if (SUBSTITUTIONS[m]) substitutionCount++;
  });
  const substitutionBonus = (substitutionCount / total) * 0.3; // small bonus
  const score = Math.min(1, baseScore + substitutionBonus);

  const substitutions = suggestSubstitutions(missing);
  return { score, missing, matches, substitutions };
}
