// src/utils/format.js
export function formatIngredients(ingredients = []) {
  return ingredients
    .map(i => (typeof i === "string" ? i : i?.name))
    .filter(Boolean) // remove null/undefined
    .join(", ");
}
