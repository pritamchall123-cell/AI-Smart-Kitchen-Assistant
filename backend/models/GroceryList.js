// models/GroceryList.js
// Each user has ONE ongoing grocery list document, containing an array of items.
// (Rather than one document per item, like Pantry — grocery lists are more naturally
// thought of as a single evolving list per user.)

const mongoose = require("mongoose");

const groceryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    quantity: {
      type: String, // flexible, e.g. "2", "a bunch"
      default: "1",
    },
    unit: {
      type: String,
      default: "",
    },
    purchased: {
      type: Boolean,
      default: false,
    },
    // Marks whether this item was added manually by the user, or suggested by auto-generate
    source: {
      type: String,
      enum: ["manual", "auto"],
      default: "manual",
    },
  },
  { _id: true } // unlike Recipe sub-schemas, we DO want IDs here — needed to check off individual items
);

const groceryListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one grocery list document per user
    },
    items: {
      type: [groceryItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroceryList", groceryListSchema);