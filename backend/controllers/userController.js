// controllers/userController.js
// Handles user profile-related logic.

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private (requires token)
const getUserProfile = async (req, res) => {
  // req.user was attached by our authMiddleware
  res.status(200).json(req.user);
};

module.exports = { getUserProfile };