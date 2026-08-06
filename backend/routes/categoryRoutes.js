// routes/categoryRoutes.js

const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getCategories); // public — anyone can view categories
router.post("/", protect, adminOnly, createCategory); // admin only
router.put("/:id", protect, adminOnly, updateCategory); // admin only
router.delete("/:id", protect, adminOnly, deleteCategory); // admin only

module.exports = router;