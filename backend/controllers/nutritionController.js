// controllers/nutritionController.js
// Calculates nutrition reports by aggregating the user's meal plan + recipe data.
// No dedicated "Nutrition" model needed — we compute this live from existing data.

const MealPlan = require("../models/MealPlan");

// @desc    Get a nutrition report for a date range (daily breakdown + totals)
// @route   GET /api/nutrition?startDate=2025-06-01&endDate=2025-06-07
// @access  Private
const getNutritionReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Please provide startDate and endDate" });
    }

    const entries = await MealPlan.find({
      user: req.user._id,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).populate("recipe", "title nutrition servings");

    // dailyBreakdown groups nutrition totals by date (as a string key, e.g. "2025-06-01")
    const dailyBreakdown = {};

    // overallTotals sums everything across the entire range
    const overallTotals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 };

    entries.forEach((entry) => {
      if (!entry.recipe) return; // safety check, in case a recipe was deleted after being planned

      const dateKey = entry.date.toISOString().split("T")[0]; // "2025-06-01T00:00:00.000Z" -> "2025-06-01"

      if (!dailyBreakdown[dateKey]) {
        dailyBreakdown[dateKey] = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, meals: [] };
      }

      // Recipe nutrition is defined "per serving" — multiply by how many servings were actually planned
      const multiplier = entry.servings || 1;
      const nutrition = entry.recipe.nutrition || {};

      const mealNutrition = {
        calories: (nutrition.calories || 0) * multiplier,
        protein: (nutrition.protein || 0) * multiplier,
        carbs: (nutrition.carbs || 0) * multiplier,
        fat: (nutrition.fat || 0) * multiplier,
        fiber: (nutrition.fiber || 0) * multiplier,
        sugar: (nutrition.sugar || 0) * multiplier,
      };

      // Add this meal's nutrition into both the day's totals AND the overall totals
      Object.keys(mealNutrition).forEach((key) => {
        dailyBreakdown[dateKey][key] += mealNutrition[key];
        overallTotals[key] += mealNutrition[key];
      });

      dailyBreakdown[dateKey].meals.push({
        mealType: entry.mealType,
        recipeTitle: entry.recipe.title,
        servings: entry.servings,
        nutrition: mealNutrition,
      });
    });

    // Calculate a simple daily average across however many days had entries
    const daysWithEntries = Object.keys(dailyBreakdown).length;
    const dailyAverage = {};
    Object.keys(overallTotals).forEach((key) => {
      dailyAverage[key] = daysWithEntries > 0 ? Math.round(overallTotals[key] / daysWithEntries) : 0;
    });

    res.status(200).json({
      startDate,
      endDate,
      overallTotals,
      dailyAverage,
      dailyBreakdown,
    });
  } catch (error) {
    console.error("Get Nutrition Report Error:", error.message);
    res.status(500).json({ message: "Server error while generating nutrition report" });
  }
};

module.exports = { getNutritionReport };