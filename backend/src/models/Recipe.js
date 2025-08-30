import mongoose from "mongoose";

const { Schema } = mongoose;

// ✅ Rating sub-schema
const ratingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { _id: false }
);

// ✅ Main Recipe schema
const recipeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    ingredients: [
      {
        name: { type: String, required: true, trim: true },
      },
    ],
    instructions: { type: String, trim: true },
    image: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    cookTimeMins: { type: Number, min: 0 },
    servings: { type: Number, min: 1 },
    dietary: [{ type: String, trim: true }],
    nutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
    ratings: [ratingSchema], // ⭐ user ratings
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// ✅ Virtual for average rating
recipeSchema.virtual("averageRating").get(function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.score, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10; // 1 decimal place
});

// ✅ Instance method (alternative way to calculate avg)
recipeSchema.methods.avgRating = function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.score, 0);
  return sum / this.ratings.length;
};

// ✅ Optional: enforce one rating per user
// (unique compound index: recipeId + userId in ratings array isn't natively supported in Mongo,
// so this can be enforced at controller/service level)
ratingSchema.index({ user: 1 });

export default mongoose.model("Recipe", recipeSchema);
