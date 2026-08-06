// controllers/categoryController.js
// Handles creating, listing, updating, and deleting categories.

const Category = require("../models/Category");

// Helper: turns "Indian Cuisine" into "indian-cuisine"
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // replace any non-letter/number with a dash
    .replace(/(^-|-$)/g, ""); // remove leading/trailing dashes
};

// @desc    Create a new category (admin only)
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, image, type } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const slug = generateSlug(name);

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "A category with this name already exists" });
    }

    const category = await Category.create({ name, slug, description, image, type });

    res.status(201).json(category);
  } catch (error) {
    console.error("Create Category Error:", error.message);
    res.status(500).json({ message: "Server error while creating category" });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }); // 1 = ascending alphabetical
    res.status(200).json(categories);
  } catch (error) {
    console.error("Get Categories Error:", error.message);
    res.status(500).json({ message: "Server error while fetching categories" });
  }
};

// @desc    Update a category (admin only)
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const { name, description, image, type } = req.body;

    if (name !== undefined) {
      category.name = name;
      category.slug = generateSlug(name);
    }
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (type !== undefined) category.type = type;

    const updated = await category.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update Category Error:", error.message);
    res.status(500).json({ message: "Server error while updating category" });
  }
};

// @desc    Delete a category (admin only)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.deleteOne();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete Category Error:", error.message);
    res.status(500).json({ message: "Server error while deleting category" });
  }
};

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };