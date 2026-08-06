//routes/userRoutes.js

const express = require("express");
const router = express.Router();
const {getUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

//get /api/users/profile - protected route, "protect" runs BEFORE getUserProfile
router.get("/profile", protect, getUserProfile);

module.exports = router;
