// models/Review.js
// A single review, tied to one user and one recipe.

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },

    comment: {
      type: String,
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
      default: "",
    },

    photos: {
      type: [String], // Cloudinary URLs, added later
      default: [],
    },
  },
  { timestamps: true }
);

// A user can only review a specific recipe ONCE — enforced at the database level
reviewSchema.index({ user: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);