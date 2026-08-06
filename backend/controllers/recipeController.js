// controllers/recipeController.js
// Handles all recipe CRUD (Create, Read, Update, Delete) operations.

const Recipe = require("../models/Recipe");

// Helper: turns a title into a URL-friendly slug, same pattern as categories
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// @desc    Create a new recipe
// @route   POST /api/recipes
// @access  Private (any logged-in user)
const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      images,
      ingredients,
      instructions,
      categories,
      cuisine,
      mealType,
      dietType,
      allergens,
      difficulty,
      prepTime,
      cookTime,
      servings,
      nutrition,
      budget,
      tags,
    } = req.body;

    // Basic required-field check before even touching the database.
    // Mongoose would catch these too, but checking early gives cleaner, faster error messages.
    if (!title || !description || !ingredients || !instructions || !prepTime || !cookTime || !servings) {
      return res.status(400).json({
        message: "Please provide title, description, ingredients, instructions, prepTime, cookTime, and servings",
      });
    }

    // Generate base slug from title
    let slug = generateSlug(title);

    // Ensure slug is unique — if "chicken-curry" exists, try "chicken-curry-1", "chicken-curry-2", etc.
    let slugExists = await Recipe.findOne({ slug });
    let counter = 1;
    while (slugExists) {
      slug = `${generateSlug(title)}-${counter}`;
      slugExists = await Recipe.findOne({ slug });
      counter++;
    }

    const recipe = await Recipe.create({
      title,
      slug,
      description,
      images,
      createdBy: req.user._id, // always from the verified token, never from the request body
      ingredients,
      instructions,
      categories,
      cuisine,
      mealType,
      dietType,
      allergens,
      difficulty,
      prepTime,
      cookTime,
      servings,
      nutrition,
      budget,
      tags,
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error("Create Recipe Error:", error.message);

    // Mongoose validation errors have a specific shape — extract clean messages from them
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error while creating recipe" });
  }
};

// @desc    Get all recipes (pagination, sorting, advanced search & filters)
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = { isPublished: true };

    // --- Text search (recipe name / description / tags) ---
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // --- Basic exact-match filters ---
    if (req.query.category) filter.categories = req.query.category;
    if (req.query.cuisine) filter.cuisine = req.query.cuisine;
    if (req.query.mealType) filter.mealType = req.query.mealType;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.budget) filter.budget = req.query.budget;

    // --- dietType: supports multiple values, e.g. ?dietType=vegan,gluten-free ---
    if (req.query.dietType) {
      const diets = req.query.dietType.split(",");
      filter.dietType = { $in: diets }; // matches if recipe has ANY of these diet tags
    }

    // --- Allergy exclusion: hide recipes containing any of the user's allergens ---
    // e.g. ?excludeAllergens=peanuts,shellfish
    if (req.query.excludeAllergens) {
      const allergensToAvoid = req.query.excludeAllergens.split(",");
      filter.allergens = { $nin: allergensToAvoid }; // $nin = "not in this list"
    }

    // --- Ingredient-based search: find recipes containing ANY of these ingredients ---
    // e.g. ?ingredients=chicken,garlic
    if (req.query.ingredients) {
      const ingredientList = req.query.ingredients.split(",").map((i) => i.trim());
      // We search inside the embedded ingredients array, matching ingredient names
      // using a case-insensitive regex for each one, combined with $or
      filter.$or = ingredientList.map((ing) => ({
        "ingredients.name": { $regex: ing, $options: "i" },
      }));
    }

    // --- Cooking time range ---
    // Total time = prepTime + cookTime. Since MongoDB can't easily filter on a
    // calculated sum directly in a simple query, we filter on cookTime as a reasonable proxy,
    // and note this as a place to upgrade to an aggregation pipeline later if needed.
    if (req.query.maxCookTime) {
      filter.cookTime = { $lte: parseInt(req.query.maxCookTime) };
    }

    // --- Nutrition ranges ---
    if (req.query.maxCalories) {
      filter["nutrition.calories"] = { $lte: parseInt(req.query.maxCalories) };
    }
    if (req.query.minProtein) {
      filter["nutrition.protein"] = { $gte: parseInt(req.query.minProtein) };
    }
    if (req.query.maxCarbs) {
      filter["nutrition.carbs"] = { $lte: parseInt(req.query.maxCarbs) };
    }
    if (req.query.maxFat) {
      filter["nutrition.fat"] = { $lte: parseInt(req.query.maxFat) };
    }

    // --- Sorting ---
    let sortOption = { createdAt: -1 };
    if (req.query.sort === "popular") sortOption = { views: -1 };
    if (req.query.sort === "rating") sortOption = { averageRating: -1 };
    if (req.query.sort === "oldest") sortOption = { createdAt: 1 };
    if (req.query.sort === "quickest") sortOption = { cookTime: 1 };

    // If doing a text search, MongoDB can also sort by "relevance score" —
    // how well each result matches the search term
    let projection = {};
    if (req.query.search) {
      projection = { score: { $meta: "textScore" } };
      sortOption = { score: { $meta: "textScore" } };
    }

    const [recipes, totalRecipes] = await Promise.all([
      Recipe.find(filter, projection)
        .populate("createdBy", "name avatar")
        .populate("categories", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Recipe.countDocuments(filter),
    ]);

    res.status(200).json({
      recipes,
      currentPage: page,
      totalPages: Math.ceil(totalRecipes / limit),
      totalRecipes,
    });
  } catch (error) {
    console.error("Get Recipes Error:", error.message);
    res.status(500).json({ message: "Server error while fetching recipes" });
  }
};

// @desc    Get a single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("createdBy", "name avatar")
      .populate("categories", "name slug");

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Increment views every time someone fetches this recipe's detail page.
    // We use $inc (atomic increment) instead of reading, adding 1, then saving —
    // this avoids a rare bug called a "race condition" where two simultaneous
    // requests could both read "5" and both save "6", losing a view count.
    recipe.views += 1;
    await Recipe.updateOne({ _id: recipe._id }, { $inc: { views: 1 } });
    // Note: we already incremented the in-memory `recipe.views` above for the response,
    // and separately told MongoDB to increment its own stored value atomically.

    res.status(200).json(recipe);
  } catch (error) {
    console.error("Get Recipe By ID Error:", error.message);

    // If the ID format itself is invalid (not a real MongoDB ObjectId), Mongoose throws a CastError
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid recipe ID" });
    }

    res.status(500).json({ message: "Server error while fetching recipe" });
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private (owner or admin only)
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Ownership check: only the person who created it, OR an admin, can edit it
    const isOwner = recipe.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You are not authorized to edit this recipe" });
    }

    // Only update fields that were actually provided (partial update support)
    const allowedFields = [
      "title", "description", "images", "ingredients", "instructions",
      "categories", "cuisine", "mealType", "dietType", "allergens",
      "difficulty", "prepTime", "cookTime", "servings", "nutrition",
      "budget", "tags", "isPublished",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        recipe[field] = req.body[field];
      }
    });

    const updatedRecipe = await recipe.save();
    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error("Update Recipe Error:", error.message);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error while updating recipe" });
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private (owner or admin only)
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const isOwner = recipe.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You are not authorized to delete this recipe" });
    }

    await recipe.deleteOne();
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Delete Recipe Error:", error.message);
    res.status(500).json({ message: "Server error while deleting recipe" });
  }
};

module.exports = { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe };