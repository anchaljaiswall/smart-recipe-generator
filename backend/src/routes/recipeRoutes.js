import express from "express";
import {
  createRecipe,
  getRecipes,
  getRecipe,
  suggestRecipes,
  rateRecipe,
} from "../controllers/recipeController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getRecipes);
router.post("/", createRecipe);

// ✅ FIXED: allow POST for suggest
router.post("/suggest", suggestRecipes);

router.get("/:id", getRecipe);
router.post("/:id/rate", requireAuth, rateRecipe);

export default router;
