// models/User.js
// Defines the structure of a "User" document stored in MongoDB.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // removes accidental leading/trailing spaces
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // no two users can have the same email
      lowercase: true, // stores email in lowercase, avoids "A@x.com" vs "a@x.com" duplicates
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // by default, password will NOT be returned in queries (extra security)
    },

    role: {
      type: String,
      enum: ["user", "admin"], // only these two values are allowed
      default: "user",
    },

    avatar: {
      type: String, // will store a Cloudinary image URL later
      default: "",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    allergies: {
      type: [String], // array of strings, e.g. ["peanuts", "shellfish"]
      default: [],
    },

    dietaryPreference: {
      type: String,
      enum: ["none", "vegetarian", "vegan", "non-vegetarian"],
      default: "none",
    },

    favoriteRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId, // stores the _id of a Recipe document
        ref: "Recipe", // tells Mongoose this ID points to the Recipe model
      },
    ],
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("User", userSchema);