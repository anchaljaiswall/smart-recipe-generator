import React from "react";
import { useEffect, useState } from "react";
import { getFavorites, toggleFavorite } from "../services/api";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    try {
      const { data } = await getFavorites();
      setFavorites(data);
    } catch (err) {
      console.error("Failed to load favorites", err);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleToggle = async (id) => {
    await toggleFavorite(id);
    loadFavorites();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">⭐ My Favorite Recipes</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorites yet.</p>
      ) : (
        <div className="grid gap-4">
          {favorites.map((r) => (
            <div key={r._id} className="relative">
              <RecipeCard recipe={r} />
              <button
                onClick={() => handleToggle(r._id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
