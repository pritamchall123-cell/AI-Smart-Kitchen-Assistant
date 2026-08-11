// controllers/reviewController.js

const Review = require("../models/Review");
const Recipe = require("../models/Recipe");

// Reusable helper: recalculates and saves a recipe's averageRating and numReviews.
// Called any time a review is created, updated, or deleted.
const updateRecipeRatingStats = async (recipeId) => {
  const reviews = await Review.find({ recipe: recipeId });

  const numReviews = reviews.length;
  const averageRating =
    numReviews === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;

  await Recipe.findByIdAndUpdate(recipeId, {
    numReviews,
    averageRating: Math.round(averageRating * 10) / 10, // round to 1 decimal place
  });
};

// @desc    Create a review for a recipe
// @route   POST /api/reviews/:recipeId
// @access  Private
const createReview = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { rating, comment, photos } = req.body;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const review = await Review.create({
      user: req.user._id,
      recipe: recipeId,
      rating,
      comment,
      photos,
    });

    await updateRecipeRatingStats(recipeId);

    await review.populate("user", "name avatar");

    res.status(201).json(review);
  } catch (error) {
    console.error("Create Review Error:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this recipe" });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error while creating review" });
  }
};

// @desc    Get all reviews for a recipe
// @route   GET /api/reviews/:recipeId
// @access  Public
const getReviewsForRecipe = async (req, res) => {
  try {
    const reviews = await Review.find({ recipe: req.params.recipeId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Get Reviews Error:", error.message);
    res.status(500).json({ message: "Server error while fetching reviews" });
  }
};

// @desc    Update your own review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to edit this review" });
    }

    const { rating, comment, photos } = req.body;

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (photos !== undefined) review.photos = photos;

    const updated = await review.save();

    // Rating may have changed, so recalculate the recipe's stats
    await updateRecipeRatingStats(review.recipe);

    await updated.populate("user", "name avatar");

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update Review Error:", error.message);
    res.status(500).json({ message: "Server error while updating review" });
  }
};

// @desc    Delete your own review (or admin can delete any)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You are not authorized to delete this review" });
    }

    const recipeId = review.recipe;

    await review.deleteOne();
    await updateRecipeRatingStats(recipeId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete Review Error:", error.message);
    res.status(500).json({ message: "Server error while deleting review" });
  }
};

module.exports = { createReview, getReviewsForRecipe, updateReview, deleteReview };