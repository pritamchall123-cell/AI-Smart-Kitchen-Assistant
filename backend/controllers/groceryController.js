// controllers/groceryController.js

const GroceryList = require("../models/GroceryList");
const Pantry = require("../models/Pantry");

// Helper: finds the user's grocery list, or creates an empty one if it doesn't exist yet
const getOrCreateList = async (userId) => {
  let list = await GroceryList.findOne({ user: userId });
  if (!list) {
    list = await GroceryList.create({ user: userId, items: [] });
  }
  return list;
};

// @desc    Get the logged-in user's grocery list
// @route   GET /api/grocery
// @access  Private
const getGroceryList = async (req, res) => {
  try {
    const list = await getOrCreateList(req.user._id);
    res.status(200).json(list);
  } catch (error) {
    console.error("Get Grocery List Error:", error.message);
    res.status(500).json({ message: "Server error while fetching grocery list" });
  }
};

// @desc    Add an item to the grocery list manually
// @route   POST /api/grocery
// @access  Private
const addGroceryItem = async (req, res) => {
  try {
    const { name, quantity, unit } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Item name is required" });
    }

    const list = await getOrCreateList(req.user._id);

    list.items.push({ name, quantity, unit, source: "manual" });
    await list.save();

    res.status(201).json(list);
  } catch (error) {
    console.error("Add Grocery Item Error:", error.message);
    res.status(500).json({ message: "Server error while adding grocery item" });
  }
};

// @desc    Toggle purchased status of an item (shopping progress)
// @route   PUT /api/grocery/:itemId/toggle
// @access  Private
const toggleItemPurchased = async (req, res) => {
  try {
    const list = await getOrCreateList(req.user._id);

    // .id() is a Mongoose sub-document helper — finds an item inside the array by its _id
    const item = list.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found in grocery list" });
    }

    item.purchased = !item.purchased;
    await list.save();

    res.status(200).json(list);
  } catch (error) {
    console.error("Toggle Item Error:", error.message);
    res.status(500).json({ message: "Server error while updating item" });
  }
};

// @desc    Remove an item from the grocery list
// @route   DELETE /api/grocery/:itemId
// @access  Private
const deleteGroceryItem = async (req, res) => {
  try {
    const list = await getOrCreateList(req.user._id);

    const item = list.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in grocery list" });
    }

    // .pull() removes a sub-document from the array by its _id
    list.items.pull(req.params.itemId);
    await list.save();

    res.status(200).json(list);
  } catch (error) {
    console.error("Delete Grocery Item Error:", error.message);
    res.status(500).json({ message: "Server error while deleting item" });
  }
};

// @desc    Clear all purchased items at once (e.g., after a shopping trip)
// @route   DELETE /api/grocery/clear-purchased
// @access  Private
const clearPurchasedItems = async (req, res) => {
  try {
    const list = await getOrCreateList(req.user._id);

    list.items = list.items.filter((item) => !item.purchased);
    await list.save();

    res.status(200).json(list);
  } catch (error) {
    console.error("Clear Purchased Error:", error.message);
    res.status(500).json({ message: "Server error while clearing items" });
  }
};

// @desc    Auto-generate grocery items from low-stock pantry alerts
// @route   POST /api/grocery/auto-generate
// @access  Private
const autoGenerateGroceryList = async (req, res) => {
  try {
    const pantryItems = await Pantry.find({ user: req.user._id });

    // Same logic as our pantry alerts endpoint — find items at or below their threshold
    const lowStockItems = pantryItems.filter(
      (item) => item.quantity <= item.lowStockThreshold
    );

    const list = await getOrCreateList(req.user._id);

    let addedCount = 0;

    lowStockItems.forEach((pantryItem) => {
      // Avoid adding a duplicate suggestion if this item is already on the list (unpurchased)
      const alreadyOnList = list.items.some(
        (groceryItem) =>
          groceryItem.name.toLowerCase() === pantryItem.name.toLowerCase() &&
          !groceryItem.purchased
      );

      if (!alreadyOnList) {
        list.items.push({
          name: pantryItem.name,
          quantity: "1",
          unit: pantryItem.unit,
          source: "auto",
        });
        addedCount++;
      }
    });

    await list.save();

    res.status(200).json({
      message: `Added ${addedCount} suggested item(s) based on your low pantry stock.`,
      list,
    });
  } catch (error) {
    console.error("Auto Generate Grocery List Error:", error.message);
    res.status(500).json({ message: "Server error while auto-generating grocery list" });
  }
};

module.exports = {
  getGroceryList,
  addGroceryItem,
  toggleItemPurchased,
  deleteGroceryItem,
  clearPurchasedItems,
  autoGenerateGroceryList,
};