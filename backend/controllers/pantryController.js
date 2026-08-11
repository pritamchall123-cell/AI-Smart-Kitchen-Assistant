// controllers/pantryController.js
// Handles all pantry CRUD operations, scoped to the logged-in user.

const Pantry = require("../models/Pantry");

// @desc    Add a new pantry item
// @route   POST /api/pantry
// @access  Private
const addPantryItem = async (req, res) => {
  try {
    const { name, quantity, unit, category, lowStockThreshold, expiryDate } = req.body;

    if (!name || quantity === undefined) {
      return res.status(400).json({ message: "Please provide item name and quantity" });
    }

    const item = await Pantry.create({
      user: req.user._id,
      name,
      quantity,
      unit,
      category,
      lowStockThreshold,
      expiryDate,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Add Pantry Item Error:", error.message);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error while adding pantry item" });
  }
};

// @desc    Get all pantry items for the logged-in user
// @route   GET /api/pantry
// @access  Private
const getPantryItems = async (req, res) => {
  try {
    // Optional category filter, e.g. ?category=dairy
    const filter = { user: req.user._id };
    if (req.query.category) filter.category = req.query.category;

    const items = await Pantry.find(filter).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error("Get Pantry Items Error:", error.message);
    res.status(500).json({ message: "Server error while fetching pantry items" });
  }
};

// @desc    Update a pantry item (e.g., change quantity after cooking)
// @route   PUT /api/pantry/:id
// @access  Private
const updatePantryItem = async (req, res) => {
  try {
    const item = await Pantry.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Pantry item not found" });
    }

    // Ownership check — a user can only edit their OWN pantry items
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to edit this item" });
    }

    const { name, quantity, unit, category, lowStockThreshold, expiryDate } = req.body;

    if (name !== undefined) item.name = name;
    if (quantity !== undefined) item.quantity = quantity;
    if (unit !== undefined) item.unit = unit;
    if (category !== undefined) item.category = category;
    if (lowStockThreshold !== undefined) item.lowStockThreshold = lowStockThreshold;
    if (expiryDate !== undefined) item.expiryDate = expiryDate;

    const updated = await item.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update Pantry Item Error:", error.message);
    res.status(500).json({ message: "Server error while updating pantry item" });
  }
};

// @desc    Delete a pantry item
// @route   DELETE /api/pantry/:id
// @access  Private
const deletePantryItem = async (req, res) => {
  try {
    const item = await Pantry.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Pantry item not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this item" });
    }

    await item.deleteOne();
    res.status(200).json({ message: "Pantry item deleted successfully" });
  } catch (error) {
    console.error("Delete Pantry Item Error:", error.message);
    res.status(500).json({ message: "Server error while deleting pantry item" });
  }
};

// @desc    Get pantry analytics — low stock items and items expiring soon
// @route   GET /api/pantry/alerts
// @access  Private
const getPantryAlerts = async (req, res) => {
  try {
    const allItems = await Pantry.find({ user: req.user._id });

    // Low stock: current quantity at or below the item's own threshold
    const lowStock = allItems.filter((item) => item.quantity <= item.lowStockThreshold);

    // Expiring soon: has an expiry date within the next 3 days (and not already expired)
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    const expiringSoon = allItems.filter(
      (item) => item.expiryDate && item.expiryDate >= now && item.expiryDate <= threeDaysFromNow
    );

    const expired = allItems.filter((item) => item.expiryDate && item.expiryDate < now);

    res.status(200).json({ lowStock, expiringSoon, expired });
  } catch (error) {
    console.error("Get Pantry Alerts Error:", error.message);
    res.status(500).json({ message: "Server error while fetching pantry alerts" });
  }
};

module.exports = {
  addPantryItem,
  getPantryItems,
  updatePantryItem,
  deletePantryItem,
  getPantryAlerts,
};