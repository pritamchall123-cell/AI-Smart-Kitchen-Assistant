// controllers/communityController.js
// Follow system, recipe feed, badges, and leaderboard.

const User = require("../models/User");
const Recipe = require("../models/Recipe");

// @desc    Follow or unfollow a user (toggle)
// @route   POST /api/community/follow/:userId
// @access  Private
const toggleFollow = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = await User.findById(req.user._id);

    const isFollowing = currentUser.following.some((id) => id.toString() === userId);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter((id) => id.toString() !== userId);
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      currentUser.following.push(userId);
      targetUser.followers.push(req.user._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      message: isFollowing ? "Unfollowed" : "Followed",
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    console.error("Toggle Follow Error:", error.message);
    res.status(500).json({ message: "Server error while updating follow status" });
  }
};

// @desc    Get a user's public profile (followers/following counts, their recipes)
// @route   GET /api/community/profile/:userId
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const profileUser = await User.findById(req.params.userId).select(
      "name avatar followers following createdAt"
    );

    if (!profileUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const recipes = await Recipe.find({ createdBy: req.params.userId, isPublished: true })
      .sort({ createdAt: -1 })
      .limit(12);

    res.status(200).json({
      _id: profileUser._id,
      name: profileUser.name,
      avatar: profileUser.avatar,
      followersCount: profileUser.followers.length,
      followingCount: profileUser.following.length,
      memberSince: profileUser.createdAt,
      recipes,
    });
  } catch (error) {
    console.error("Get User Profile Error:", error.message);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};

// @desc    Get a feed of recent recipes from users you follow
// @route   GET /api/community/feed
// @access  Private
const getFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (currentUser.following.length === 0) {
      return res.status(200).json({ recipes: [], message: "Follow some users to see their recipes here!" });
    }

    const recipes = await Recipe.find({
      createdBy: { $in: currentUser.following },
      isPublished: true,
    })
      .populate("createdBy", "name avatar")
      .sort({ createdAt: -1 })
      .limit(30);

    res.status(200).json({ recipes });
  } catch (error) {
    console.error("Get Feed Error:", error.message);
    res.status(500).json({ message: "Server error while fetching feed" });
  }
};

// Badge definitions — computed on the fly from existing stats, no separate storage needed
const BADGE_DEFINITIONS = [
  { id: "first_recipe", label: "First Recipe", check: (stats) => stats.recipeCount >= 1 },
  { id: "recipe_creator", label: "Recipe Creator (10+)", check: (stats) => stats.recipeCount >= 10 },
  { id: "popular_chef", label: "Popular Chef (50+ favorites received)", check: (stats) => stats.totalFavoritesReceived >= 50 },
  { id: "reviewer", label: "Helpful Reviewer (5+ reviews written)", check: (stats) => stats.reviewCount >= 5 },
  { id: "social_butterfly", label: "Social Butterfly (10+ followers)", check: (stats) => stats.followersCount >= 10 },
];

// @desc    Get badges earned by a user
// @route   GET /api/community/badges/:userId
// @access  Public
const getUserBadges = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userRecipes = await Recipe.find({ createdBy: req.params.userId });
    const recipeCount = userRecipes.length;
    const totalFavoritesReceived = userRecipes.reduce((sum, r) => sum + (r.favoritesCount || 0), 0);

    const Review = require("../models/Review");
    const reviewCount = await Review.countDocuments({ user: req.params.userId });

    const stats = {
      recipeCount,
      totalFavoritesReceived,
      reviewCount,
      followersCount: targetUser.followers.length,
    };

    const earnedBadges = BADGE_DEFINITIONS.filter((badge) => badge.check(stats)).map((badge) => ({
      id: badge.id,
      label: badge.label,
    }));

    res.status(200).json({ badges: earnedBadges, stats });
  } catch (error) {
    console.error("Get User Badges Error:", error.message);
    res.status(500).json({ message: "Server error while fetching badges" });
  }
};

// @desc    Get the leaderboard — top users by recipes created and favorites received
// @route   GET /api/community/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    // Aggregation pipeline: group recipes by creator, sum favorites, count recipes
    const leaderboard = await Recipe.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: "$createdBy",
          recipeCount: { $sum: 1 },
          totalFavorites: { $sum: "$favoritesCount" },
        },
      },
      { $sort: { totalFavorites: -1, recipeCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users", // the actual MongoDB collection name (lowercase, pluralized)
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          avatar: "$user.avatar",
          recipeCount: 1,
          totalFavorites: 1,
        },
      },
    ]);

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Get Leaderboard Error:", error.message);
    res.status(500).json({ message: "Server error while fetching leaderboard" });
  }
};

module.exports = { toggleFollow, getUserProfile, getFeed, getUserBadges, getLeaderboard };