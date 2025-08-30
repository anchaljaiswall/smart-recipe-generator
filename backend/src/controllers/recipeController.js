import Recipe from "../models/Recipe.js";
import { getNutritionForIngredients } from "../utils/ingredientRecognizer.js";
import { computeMatchScore } from "../utils/matcher.js";

// ✅ Create Recipe
export const createRecipe = async (req, res) => {
  try {
    let {
      title,
      ingredients,
      instructions,
      image,
      tags,
      difficulty,
      cookTimeMins,
      servings,
      dietary,
    } = req.body;

    let nutrition = req.body.nutrition || null;

    // Normalize ingredients → always objects { name }
    if (Array.isArray(ingredients)) {
      ingredients = ingredients.map((i) =>
        typeof i === "string" ? { name: i.trim() } : i
      );
    }

    // Auto-compute nutrition if Gemini API key is set
    if (!nutrition && process.env.GEMINI_API_KEY && ingredients?.length) {
      try {
        nutrition = await getNutritionForIngredients(
          ingredients.map((i) => i.name)
        );
      } catch (err) {
        console.warn("⚠️ Nutrition fetch failed:", err.message);
        nutrition = null;
      }
    }

    const recipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      image,
      tags,
      difficulty,
      cookTimeMins,
      servings,
      dietary,
      nutrition,
    });

    res.status(201).json(recipe);
  } catch (err) {
    console.error("❌ Create recipe error:", err);
    res
      .status(400)
      .json({ error: "Failed to add recipe", details: err.message });
  }
};

// ✅ Get Recipes with filters
export const getRecipes = async (req, res) => {
  try {
    const {
      diet,
      difficulty,
      maxTime,
      tags,
      minServings,
      q,
      page = 1,
      limit = 50,
    } = req.query;

    const filter = {};
    if (diet) filter.dietary = { $in: diet.split(",") };
    if (difficulty) filter.difficulty = difficulty;
    if (maxTime) filter.cookTimeMins = { $lte: Number(maxTime) };
    if (minServings) filter.servings = { $gte: Number(minServings) };
    if (tags) filter.tags = { $in: tags.split(",") };
    if (q) filter.title = { $regex: q, $options: "i" };

    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

// ✅ Get Single Recipe
export const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
};

// ✅ Rate Recipe
export const rateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;

    const numericScore = Number(score);
    if (numericScore < 1 || numericScore > 5) {
      return res
        .status(400)
        .json({ error: "Score must be between 1 and 5" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized - user missing" });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    // Remove old rating from same user
    recipe.ratings = recipe.ratings.filter(
      (r) => r.user.toString() !== req.user._id.toString()
    );

    recipe.ratings.push({ user: req.user._id, score: numericScore });

    await recipe.save();
    res.json(recipe.toJSON()); // includes avgRating virtual
  } catch (err) {
    console.error("❌ Rate recipe error:", err);
    res
      .status(500)
      .json({ error: "Failed to rate recipe", details: err.message });
  }
};

// ✅ Suggest Recipes by Ingredients
export const suggestRecipes = async (req, res) => {
  try {
    const available = (req.body.ingredients || [])
      .map((s) => s.toLowerCase().trim());
    const dietary = req.body.dietary || [];

    const recipes = await Recipe.find(
      dietary.length ? { dietary: { $in: dietary } } : {}
    ).lean();

    const scored = recipes.map((r) => {
      const recipeIngredients = r.ingredients.map((i) =>
        (i.name || i).toLowerCase()
      );
      const { score, missing, matches, substitutions } = computeMatchScore(
        available,
        recipeIngredients
      );
      return { recipe: r, score, missing, matches, substitutions };
    });

    const results = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, req.body.maxResults || 10);

    res.json(results);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to suggest recipes", details: err.message });
  }
};
