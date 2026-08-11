// controllers/mealController.js

const MealPlan = require("../models/MealPlan");

// @desc    Add a recipe to the meal plan
// @route   POST /api/meals
// @access  Private
const addMealPlanEntry = async (req, res) => {
  try {
    const { recipe, date, mealType, servings, notes } = req.body;

    if (!recipe || !date || !mealType) {
      return res.status(400).json({ message: "Please provide recipe, date, and mealType" });
    }

    const entry = await MealPlan.create({
      user: req.user._id,
      recipe,
      date,
      mealType,
      servings,
      notes,
    });

    // Populate the recipe details before sending back, so the frontend
    // doesn't need a second request just to show the recipe's name/image
    await entry.populate("recipe", "title images cookTime prepTime nutrition");

    res.status(201).json(entry);
  } catch (error) {
    console.error("Add Meal Plan Entry Error:", error.message);

    // Our unique index throws a MongoDB error code 11000 on duplicates
    if (error.code === 11000) {
      return res.status(400).json({ message: "This recipe is already planned for that date and meal" });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error while adding meal plan entry" });
  }
};

// @desc    Get meal plan entries within a date range
// @route   GET /api/meals?startDate=2025-01-01&endDate=2025-01-07
// @access  Private
const getMealPlan = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { user: req.user._id };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const entries = await MealPlan.find(filter)
      .populate("recipe", "title images cookTime prepTime nutrition difficulty")
      .sort({ date: 1 });

    res.status(200).json(entries);
  } catch (error) {
    console.error("Get Meal Plan Error:", error.message);
    res.status(500).json({ message: "Server error while fetching meal plan" });
  }
};

// @desc    Update a meal plan entry (e.g., change servings or swap the meal type)
// @route   PUT /api/meals/:id
// @access  Private
const updateMealPlanEntry = async (req, res) => {
  try {
    const entry = await MealPlan.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Meal plan entry not found" });
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to edit this entry" });
    }

    const { date, mealType, servings, notes } = req.body;

    if (date !== undefined) entry.date = date;
    if (mealType !== undefined) entry.mealType = mealType;
    if (servings !== undefined) entry.servings = servings;
    if (notes !== undefined) entry.notes = notes;

    const updated = await entry.save();
    await updated.populate("recipe", "title images cookTime prepTime nutrition");

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update Meal Plan Entry Error:", error.message);
    res.status(500).json({ message: "Server error while updating meal plan entry" });
  }
};

// @desc    Remove a meal plan entry
// @route   DELETE /api/meals/:id
// @access  Private
const deleteMealPlanEntry = async (req, res) => {
  try {
    const entry = await MealPlan.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Meal plan entry not found" });
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this entry" });
    }

    await entry.deleteOne();
    res.status(200).json({ message: "Meal plan entry removed" });
  } catch (error) {
    console.error("Delete Meal Plan Entry Error:", error.message);
    res.status(500).json({ message: "Server error while deleting meal plan entry" });
  }
};

module.exports = { addMealPlanEntry, getMealPlan, updateMealPlanEntry, deleteMealPlanEntry };