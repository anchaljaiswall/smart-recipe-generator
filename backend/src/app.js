import express from "express";
import cors from "cors";
import morgan from "morgan";
import recipeRoutes from "./routes/recipeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => res.send("Smart Recipe API running 🚀"));

// routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// error handler (basic)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

export default app;
