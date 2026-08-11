// routes/mealRoutes.js

const express = require("express");
const router = express.Router();
const {
  addMealPlanEntry,
  getMealPlan,
  updateMealPlanEntry,
  deleteMealPlanEntry,
} = require("../controllers/mealController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getMealPlan);
router.post("/", protect, addMealPlanEntry);
router.put("/:id", protect, updateMealPlanEntry);
router.delete("/:id", protect, deleteMealPlanEntry);

module.exports = router;