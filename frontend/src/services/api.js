// frontend/src/services/api.js
import axios from "axios";

// ✅ Pick from environment (Vercel) or fallback to localhost
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// ---------------- Recipes ----------------
export const fetchRecipes = () => API.get("/recipes");

export const createRecipe = (data, token) =>
  API.post("/recipes", data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

// ---------------- Image Upload ----------------
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ---------------- Auth ----------------
export const registerUser = (data) => API.post("/users/register", data);

export const loginUser = (data) => API.post("/users/login", data);
