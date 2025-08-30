import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { recognizeIngredientsFromImage } from "../utils/ingredientRecognizer.js";

const router = express.Router();

// Configure multer for uploads
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG files are allowed"));
    }
  },
});

router.post("/image", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;

  try {
    // Call the ingredient recognizer
    const ingredients = await recognizeIngredientsFromImage(filePath);

    res.json({ ingredients });
  } catch (err) {
    console.error("Image recognition error:", err);
    res.status(500).json({ error: "Image recognition failed", details: err.message });
  } finally {
    // Clean up uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete uploaded file:", err);
    });
  }
});

export default router;
