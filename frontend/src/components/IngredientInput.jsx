import React from "react";
export default function IngredientInput({ value, setValue }) {
  return (
    <input
      type="text"
      placeholder="Ingredients (comma separated)"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="border rounded-lg px-3 py-2 w-full"
    />
  );
}
