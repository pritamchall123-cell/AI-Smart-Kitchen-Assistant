// routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllRecipesAdmin,
  toggleRecipePublish,
  deleteRecipeAdmin,
  getAllReviewsAdmin,
  deleteReviewAdmin,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Every route here requires BOTH being logged in AND being an admin
router.get("/stats", protect, adminOnly, getDashboardStats);
router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id/role", protect, adminOnly, updateUserRole);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.get("/recipes", protect, adminOnly, getAllRecipesAdmin);
router.put("/recipes/:id/toggle-publish", protect, adminOnly, toggleRecipePublish);
router.delete("/recipes/:id", protect, adminOnly, deleteRecipeAdmin);
router.get("/reviews", protect, adminOnly, getAllReviewsAdmin);
router.delete("/reviews/:id", protect, adminOnly, deleteReviewAdmin);

module.exports = router;