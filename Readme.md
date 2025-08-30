# 🍳 Smart Recipe Generator

An **AI-powered recipe app** where users can create, search, and rate recipes.  
It supports **ingredient recognition from images** and **nutrition estimation** using **Google Gemini API**.

---

## 🚀 Features
- 🔐 User authentication with JWT
- 🥗 Add, view, and rate recipes
- 📷 Ingredient recognition from food images (Gemini Vision API)
- 🍎 Nutrition estimation (Gemini Text API)
- 🔍 Search & filter recipes by tags, diet, and difficulty
- ⭐ Save & rate favorites
- 🎨 Beautiful UI with React + Tailwind

---

## 🛠 Tech Stack
- **Backend**: Node.js, Express, MongoDB, JWT, Multer, Gemini API  
- **Frontend**: React (Vite), TailwindCSS, Axios  
- **Deployment**: Backend → Render, Frontend → Vercel  

---

## ⚡ Installation & Running (Step by Step)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/smart-recipe-generator.git
cd smart-recipe-generator
```
2️⃣ Backend Setup
```bash
cd backend
npm install
```
###Create a .env file inside backend/:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

# Gemini
GEMINI_API_KEY=your_gemini_api_key
```

Run backend:
```bash
npm install
npm run dev
```
3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
```
Run frontend:
```bash
npm run dev
```
