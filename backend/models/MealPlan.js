// models/MealPlan.js
// Each document represents ONE recipe assigned to ONE user, on ONE date, for ONE meal slot.

const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema(
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

    date: {
      type: Date,
      required: [true, "Date is required"],
    },

    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: [true, "Meal type is required"],
    },

    servings: {
      type: Number,
      default: 1,
      min: 1,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevents the exact same recipe being planned twice for the same user/date/mealType
// (e.g., you can't accidentally plan "Chicken Curry" for breakfast on the 5th, twice)
mealPlanSchema.index({ user: 1, date: 1, mealType: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model("MealPlan", mealPlanSchema);