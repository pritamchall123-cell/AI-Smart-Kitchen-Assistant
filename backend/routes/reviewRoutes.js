// routes/reviewRoutes.js

const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviewsForRecipe,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:recipeId", getReviewsForRecipe); // public
router.post("/:recipeId", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;