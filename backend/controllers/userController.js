// controllers/userController.js
// Handles user profile-related logic.

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Recipe = require("../models/Recipe");

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Update logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    // req.user._id comes from our authMiddleware — we NEVER let the user pass in
    // their own ID to update, otherwise someone could edit another person's account
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only update fields that were actually provided in the request body.
    // This means a partial update (e.g., just allergies) won't wipe out other fields.
    const { name, avatar, allergies, dietaryPreference } = req.body;

    if (name !== undefined) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (allergies !== undefined) user.allergies = allergies;
    if (dietaryPreference !== undefined) user.dietaryPreference = dietaryPreference;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      allergies: updatedUser.allergies,
      dietaryPreference: updatedUser.dietaryPreference,
      isEmailVerified: updatedUser.isEmailVerified,
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

// @desc    Change password while logged in
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide current and new password" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    // We must re-fetch the user WITH the password field, since it's select:false by default
    const user = await User.findById(req.user._id).select("+password");

    // Google-login users have no password set at all
    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google Sign-In and has no password to change",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change Password Error:", error.message);
    res.status(500).json({ message: "Server error while changing password" });
  }
};

// @desc    Toggle favorite status of a recipe (add if not favorited, remove if already favorited)
// @route   POST /api/users/favorites/:recipeId
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const user = await User.findById(req.user._id);

    // Check if this recipe is already in the user's favorites list
    const alreadyFavorited = user.favoriteRecipes.some(
      (id) => id.toString() === recipeId
    );

    if (alreadyFavorited) {
      // Remove it — keep every favorite EXCEPT this one
      user.favoriteRecipes = user.favoriteRecipes.filter(
        (id) => id.toString() !== recipeId
      );
      recipe.favoritesCount = Math.max(0, recipe.favoritesCount - 1); // never go below 0
    } else {
      // Add it
      user.favoriteRecipes.push(recipeId);
      recipe.favoritesCount += 1;
    }

    await user.save();
    await recipe.save();

    res.status(200).json({
      message: alreadyFavorited ? "Recipe removed from favorites" : "Recipe added to favorites",
      isFavorited: !alreadyFavorited,
      favoritesCount: recipe.favoritesCount,
    });
  } catch (error) {
    console.error("Toggle Favorite Error:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid recipe ID" });
    }

    res.status(500).json({ message: "Server error while updating favorites" });
  }
};

// @desc    Get all of the logged-in user's favorite recipes
// @route   GET /api/users/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    // We populate the full favoriteRecipes array, turning stored IDs into full recipe data
    const user = await User.findById(req.user._id).populate({
      path: "favoriteRecipes",
      populate: { path: "createdBy", select: "name avatar" },
    });

    res.status(200).json(user.favoriteRecipes);
  } catch (error) {
    console.error("Get Favorites Error:", error.message);
    res.status(500).json({ message: "Server error while fetching favorites" });
  }
};

module.exports = { getUserProfile, updateUserProfile, changePassword, toggleFavorite, getFavorites };