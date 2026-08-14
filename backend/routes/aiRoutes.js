// routes/aiRoutes.js

const express = require("express");
const router = express.Router();
const { generateRecipe, chatWithAssistant, detectIngredients } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/generate-recipe", protect, generateRecipe);
router.post("/chat", protect, chatWithAssistant);
router.post("/detect-ingredients", protect, upload.single("image"), detectIngredients);

module.exports = router;