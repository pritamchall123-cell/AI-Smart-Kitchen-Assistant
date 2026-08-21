// routes/recipeRoutes.js

const express = require("express");
const router = express.Router();
const { createRecipe, getRecipes , getRecipeById, updateRecipe, deleteRecipe} = require("../controllers/recipeController");
const { protect } = require("../middleware/authMiddleware");
const recipeUpload = require("../middleware/recipeUpload");

router.post("/", protect, recipeUpload.array("images", 5),  createRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);

module.exports = router;