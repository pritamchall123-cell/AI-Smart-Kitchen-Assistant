// routes/pantryRoutes.js

const express = require("express");
const router = express.Router();
const {
  addPantryItem,
  getPantryItems,
  updatePantryItem,
  deletePantryItem,
  getPantryAlerts,
} = require("../controllers/pantryController");
const { protect } = require("../middleware/authMiddleware");

// All pantry routes require login — every route uses `protect`
router.get("/alerts", protect, getPantryAlerts); // must come BEFORE "/:id" — see note below
router.get("/", protect, getPantryItems);
router.post("/", protect, addPantryItem);
router.put("/:id", protect, updatePantryItem);
router.delete("/:id", protect, deletePantryItem);

module.exports = router;