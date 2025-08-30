import React from "react";
import { formatIngredients } from "../utils/format";

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
      <p className="text-gray-600">
        Ingredients: {formatIngredients(recipe.ingredients) || "—"}
      </p>
      {recipe.instructions && (
        <p className="text-sm text-gray-700 mt-2">
          {recipe.instructions}
        </p>
      )}
      {recipe.nutrition && (
        <p className="mt-2 text-xs text-gray-500">
          Calories: {recipe.nutrition.calories} kcal
        </p>
      )}
    </div>
  );
}
