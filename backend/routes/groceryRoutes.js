// routes/groceryRoutes.js

const express = require("express");
const router = express.Router();
const {
  getGroceryList,
  addGroceryItem,
  toggleItemPurchased,
  deleteGroceryItem,
  clearPurchasedItems,
  autoGenerateGroceryList,
} = require("../controllers/groceryController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getGroceryList);
router.post("/", protect, addGroceryItem);
router.post("/auto-generate", protect, autoGenerateGroceryList);
router.put("/:itemId/toggle", protect, toggleItemPurchased);
router.delete("/clear-purchased", protect, clearPurchasedItems);
router.delete("/:itemId", protect, deleteGroceryItem);

module.exports = router;