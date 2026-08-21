// controllers/adminController.js
// Admin-only operations: dashboard stats and user management.

const User = require("../models/User");
const Review = require("../models/Review");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");


// @desc    Get overall app statistics for the admin dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Run all these counts simultaneously rather than one-by-one, for speed
    const [
      totalUsers,
      totalRecipes,
      aiGeneratedRecipes,
      totalReviews,
      totalCategories,
      adminCount,
      recentUsers,
      recentRecipes,
    ] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments(),
      Recipe.countDocuments({ source: "ai" }),
      Review.countDocuments(),
      Category.countDocuments(),
      User.countDocuments({ role: "admin" }),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt"),
      Recipe.find().sort({ createdAt: -1 }).limit(5).select("title createdAt source"),
    ]);

    res.status(200).json({
      totalUsers,
      totalRecipes,
      aiGeneratedRecipes,
      userGeneratedRecipes: totalRecipes - aiGeneratedRecipes,
      totalReviews,
      totalCategories,
      adminCount,
      recentUsers,
      recentRecipes,
    });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error.message);
    res.status(500).json({ message: "Server error while fetching dashboard stats" });
  }
};

// @desc    Get all users (paginated)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    // Optional search by name or email
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const [users, totalUsers] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    console.error("Get All Users Error:", error.message);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

// @desc    Update a user's role (promote/demote admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'admin'" });
    }

    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent an admin from accidentally demoting themselves and losing access
    if (targetUser._id.toString() === req.user._id.toString() && role === "user") {
      return res.status(400).json({ message: "You cannot remove your own admin access" });
    }

    targetUser.role = role;
    await targetUser.save();

    res.status(200).json({ message: `User role updated to ${role}`, user: targetUser });
  } catch (error) {
    console.error("Update User Role Error:", error.message);
    res.status(500).json({ message: "Server error while updating user role" });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent an admin from deleting their own account through this panel
    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account from here" });
    }

    await targetUser.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error.message);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};

// @desc    Get ALL recipes for admin (including unpublished), paginated
// @route   GET /api/admin/recipes
// @access  Private/Admin
const getAllRecipesAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }

    const [recipes, totalRecipes] = await Promise.all([
      Recipe.find(filter)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Recipe.countDocuments(filter),
    ]);

    res.status(200).json({
      recipes,
      currentPage: page,
      totalPages: Math.ceil(totalRecipes / limit),
      totalRecipes,
    });
  } catch (error) {
    console.error("Get All Recipes Admin Error:", error.message);
    res.status(500).json({ message: "Server error while fetching recipes" });
  }
};

// @desc    Toggle a recipe's published status
// @route   PUT /api/admin/recipes/:id/toggle-publish
// @access  Private/Admin
const toggleRecipePublish = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    recipe.isPublished = !recipe.isPublished;
    await recipe.save();

    res.status(200).json({ message: `Recipe ${recipe.isPublished ? "published" : "unpublished"}`, recipe });
  } catch (error) {
    console.error("Toggle Recipe Publish Error:", error.message);
    res.status(500).json({ message: "Server error while updating recipe" });
  }
};

// @desc    Delete any recipe (admin)
// @route   DELETE /api/admin/recipes/:id
// @access  Private/Admin
const deleteRecipeAdmin = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    await recipe.deleteOne();
    res.status(200).json({ message: "Recipe deleted" });
  } catch (error) {
    console.error("Delete Recipe Admin Error:", error.message);
    res.status(500).json({ message: "Server error while deleting recipe" });
  }
};

// @desc    Get all reviews across the app, paginated
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviewsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [reviews, totalReviews] = await Promise.all([
      Review.find()
        .populate("user", "name email")
        .populate("recipe", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments(),
    ]);

    res.status(200).json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit),
      totalReviews,
    });
  } catch (error) {
    console.error("Get All Reviews Admin Error:", error.message);
    res.status(500).json({ message: "Server error while fetching reviews" });
  }
};

// @desc    Delete any review (admin) — also resyncs the recipe's rating stats
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
const deleteReviewAdmin = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const recipeId = review.recipe;
    await review.deleteOne();

    // Recalculate the recipe's rating stats, same logic as reviewController
    const remainingReviews = await Review.find({ recipe: recipeId });
    const numReviews = remainingReviews.length;
    const averageRating =
      numReviews === 0 ? 0 : remainingReviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;

    await Recipe.findByIdAndUpdate(recipeId, {
      numReviews,
      averageRating: Math.round(averageRating * 10) / 10,
    });

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error("Delete Review Admin Error:", error.message);
    res.status(500).json({ message: "Server error while deleting review" });
  }
};

module.exports = { 
  getDashboardStats, 
  getAllUsers, 
  updateUserRole, 
  deleteUser,
  getAllRecipesAdmin,
  toggleRecipePublish,
  deleteRecipeAdmin,
  getAllReviewsAdmin,
  deleteReviewAdmin,
};