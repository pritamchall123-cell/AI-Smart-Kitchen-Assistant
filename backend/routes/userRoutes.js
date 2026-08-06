// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  toggleFavorite,
    getFavorites
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);
router.post("/favorites/:recipeId", protect, toggleFavorite);
router.get("/favorites", protect, getFavorites);

module.exports = router;