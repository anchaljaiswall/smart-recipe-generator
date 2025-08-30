export const SUBSTITUTIONS = {
  "butter": ["margarine","olive oil"],
  "milk": ["soy milk","almond milk"],
  "egg": ["flaxseed + water","applesauce"],
  "sugar": ["honey","maple syrup"],
  "paneer": ["tofu"]
};

export function suggestSubstitutions(missing) {
  const subs = {};
  missing.forEach(m => {
    if (SUBSTITUTIONS[m]) subs[m] = SUBSTITUTIONS[m];
    else subs[m] = [];
  });
  return subs;
}
