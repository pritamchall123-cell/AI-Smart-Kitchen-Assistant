// models/Category.js
// Defines the structure of a "Category" document (e.g., Indian, Vegan, Breakfast).

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String, // Cloudinary URL, added later
      default: "",
    },

    type: {
      type: String,
      enum: ["cuisine", "mealType", "diet", "other"],
      default: "cuisine",
      // cuisine = Indian, Chinese, Italian...
      // mealType = Breakfast, Lunch, Dinner, Snacks...
      // diet = Vegetarian, Vegan, Non-Vegetarian...
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);