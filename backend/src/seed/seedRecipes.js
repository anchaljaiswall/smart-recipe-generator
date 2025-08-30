import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Recipe from "../models/Recipe.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smart-recipe";

const sampleRecipes = [
  {
    title: "Paneer Butter Masala",
    ingredients: [{name:"paneer"},{name:"butter"},{name:"tomato"},{name:"cream"}],
    instructions: "Cook onion and tomato, add spices, add paneer and cream.",
    tags: ["indian","vegetarian"],
    difficulty: "medium",
    cookTimeMins: 30,
    servings: 3,
    dietary: ["vegetarian"],
    nutrition: { calories: 350, protein_g: 12, fat_g: 25, carbs_g: 8 }
  },
  {
    title: "Tomato Soup",
    ingredients: [{name:"tomato"},{name:"onion"},{name:"garlic"},{name:"salt"}],
    instructions: "Boil tomatoes, blend, season, serve.",
    tags: ["soup","vegetarian"],
    difficulty: "easy",
    cookTimeMins: 20,
    servings: 2,
    dietary: ["vegetarian"],
    nutrition: { calories: 120, protein_g: 3, fat_g: 4, carbs_g: 18 }
  },
  // ... add 18 more recipes (vegan/gluten-free/breakfast/lunch/dinner) to reach 20
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to DB, seeding recipes...");
  await Recipe.deleteMany({});
  await Recipe.insertMany(sampleRecipes);
  console.log("Seeded recipes:", sampleRecipes.length);
  process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
