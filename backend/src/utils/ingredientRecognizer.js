import "dotenv/config";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getFromCache, saveToCache } from "./nutritionCache.js";



const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔎 Extract ingredients from image
export async function recognizeIngredientsFromImage(filePath) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const imageBytes = fs.readFileSync(filePath);
  const base64Image = imageBytes.toString("base64");

  const prompt = `
    You are a food recognition AI.
    Look at this food image and return ONLY a JSON array of ingredient names.
    Example: ["tomato","onion","cheese"]
  `;

  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        mimeType: "image/jpeg", // or "image/png"
        data: base64Image,
      },
    },
  ]);

  const text = result.response.text().trim();

  try {
    return JSON.parse(text);
  } catch {
    return text
      .split(/,|\n/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  }
}

// 🔎 Estimate nutrition from ingredients
export async function getNutritionForIngredients(ingredients) {
  const key = ingredients.join(",").toLowerCase();
  const cached = getFromCache(key);
  if (cached) return cached;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const prompt = `...`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const data = JSON.parse(text);
    saveToCache(key, data);
    return data;
  } catch (err) {
    console.warn("⚠️ Nutrition fetch failed:", err.message);
    return { info: "Nutrition unavailable (quota exceeded)" };
  }
}
