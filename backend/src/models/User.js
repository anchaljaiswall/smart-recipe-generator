import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
