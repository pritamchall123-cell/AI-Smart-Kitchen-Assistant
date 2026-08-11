// routes/nutritionRoutes.js

const express = require("express");
const router = express.Router();
const { getNutritionReport } = require("../controllers/nutritionController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getNutritionReport);

module.exports = router;