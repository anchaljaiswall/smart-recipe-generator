import React, { useState, useEffect } from "react";
import { fetchRecipes, createRecipe } from "../services/api";
import RecipeCard from "../components/RecipeCard";
import IngredientInput from "../components/IngredientInput";
import UploadImage from "../components/UploadImage";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  const loadRecipes = async () => {
    const { data } = await fetchRecipes();
    setRecipes(data);
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      ingredients: ingredients
        .split(",")
        .map((i) => ({ name: i.trim() }))
        .filter((i) => i.name),
      instructions,
    };

    await createRecipe(payload); // add JWT if required
    setTitle("");
    setIngredients("");
    setInstructions("");
    loadRecipes();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add a Recipe</h2>

      <form
        onSubmit={submit}
        className="space-y-4 bg-gray-100 p-4 rounded-xl"
      >
        <input
          type="text"
          placeholder="Title"
          className="border rounded-lg px-3 py-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <IngredientInput value={ingredients} setValue={setIngredients} />
        <UploadImage setIngredients={setIngredients} />

        <textarea
          placeholder="Instructions"
          className="border rounded-lg px-3 py-2 w-full"
          rows="4"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />

        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Add Recipe
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-4">Recipes</h2>
      <div className="grid gap-4">
        {recipes.length > 0 ? (
          recipes.map((r) => <RecipeCard key={r._id} recipe={r} />)
        ) : (
          <p className="text-gray-500">No recipes found.</p>
        )}
      </div>
    </div>
  );
}
