import React from "react";
import { useState } from "react";
import { uploadImage } from "../services/api";

export default function UploadImage({ setIngredients }) {
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const { data } = await uploadImage(file);
      setIngredients(data.ingredients.join(", "));
    } catch (err) {
      alert("Image upload failed");
    }
    setLoading(false);
  };

  return (
    <div>
      <label className="block mb-1 font-medium">Upload Food Image:</label>
      <input type="file" onChange={handleFile} />
      {loading && <p className="text-sm text-gray-500">Analyzing image...</p>}
    </div>
  );
}
