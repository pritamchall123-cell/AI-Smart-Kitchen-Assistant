// routes/authRoutes.js
// Defines all authentication-related endpoints.

const express = require("express");
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    verifyEmail, 
    forgotPassword, 
    resetPassword,
    googleLogin } = require("../controllers/authController");

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/google", googleLogin);

module.exports = router;