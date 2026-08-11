// models/Pantry.js
// Defines a single pantry item belonging to a specific user.

const mongoose = require("mongoose");

const pantrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },

    unit: {
      type: String, // e.g., "grams", "pieces", "liters"
      trim: true,
      default: "pieces",
    },

    category: {
      type: String,
      enum: ["vegetables", "fruits", "dairy", "meat", "grains", "spices", "condiments", "beverages", "other"],
      default: "other",
    },

    // Below this quantity, we consider the item "low stock"
    lowStockThreshold: {
      type: Number,
      default: 1,
      min: 0,
    },

    expiryDate: {
      type: Date,
      // optional — not all items have a meaningful expiry (e.g., salt)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pantry", pantrySchema);