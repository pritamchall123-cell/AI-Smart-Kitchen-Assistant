// routes/communityRoutes.js

const express = require("express");
const router = express.Router();
const {
  toggleFollow,
  getUserProfile,
  getFeed,
  getUserBadges,
  getLeaderboard,
} = require("../controllers/communityController");
const { protect } = require("../middleware/authMiddleware");

router.get("/leaderboard", getLeaderboard);
router.get("/feed", protect, getFeed);
router.get("/profile/:userId", getUserProfile);
router.get("/badges/:userId", getUserBadges);
router.post("/follow/:userId", protect, toggleFollow);

module.exports = router;