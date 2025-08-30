import express from "express";
import { register, login, addFavorite, removeFavorite } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/favorites/:recipeId", requireAuth, addFavorite);
router.delete("/favorites/:recipeId", requireAuth, removeFavorite);

export default router;
