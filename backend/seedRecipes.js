// seedRecipes.js
// A one-time script to insert sample recipes into the database for testing.
// Run with: node seedRecipes.js

require("dotenv").config();
const connectDB = require("./config/db");
const Recipe = require("./models/Recipe");
const User = require("./models/User");

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const seedRecipes = async () => {
  try {
    await connectDB();

    const adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
      console.error("No admin user found. Please make sure you have an admin user in the database first.");
      process.exit(1);
    }

    console.log("Using admin user:", adminUser.email);

    const sampleRecipes = [
      {
        title: "Classic Margherita Pizza",
        description: "A simple Italian classic with fresh basil, mozzarella, and tomato sauce.",
        createdBy: adminUser._id,
        ingredients: [
          { name: "Pizza dough", quantity: "1", unit: "ball" },
          { name: "Tomato sauce", quantity: "1/2", unit: "cup" },
          { name: "Mozzarella cheese", quantity: "200", unit: "grams" },
          { name: "Fresh basil", quantity: "10", unit: "leaves" },
        ],
        instructions: [
          { stepNumber: 1, description: "Preheat oven to 250°C." },
          { stepNumber: 2, description: "Roll out the pizza dough on a floured surface." },
          { stepNumber: 3, description: "Spread tomato sauce evenly, then add mozzarella." },
          { stepNumber: 4, description: "Bake for 10-12 minutes, then top with fresh basil." },
        ],
        cuisine: "Italian",
        mealType: "dinner",
        dietType: ["vegetarian"],
        difficulty: "medium",
        prepTime: 20,
        cookTime: 12,
        servings: 4,
        nutrition: { calories: 280, protein: 12, carbs: 35, fat: 10 },
        budget: "low",
        tags: ["pizza", "italian", "classic"],
      },
      {
        title: "Thai Green Curry",
        description: "A fragrant, spicy Thai curry with coconut milk and fresh vegetables.",
        createdBy: adminUser._id,
        ingredients: [
          { name: "Green curry paste", quantity: "3", unit: "tbsp" },
          { name: "Coconut milk", quantity: "400", unit: "ml" },
          { name: "Chicken breast", quantity: "400", unit: "grams" },
          { name: "Thai basil", quantity: "1", unit: "handful" },
          { name: "Bell pepper", quantity: "1", unit: "sliced" },
        ],
        instructions: [
          { stepNumber: 1, description: "Fry the curry paste in a hot pan for 1 minute." },
          { stepNumber: 2, description: "Add coconut milk and bring to a simmer." },
          { stepNumber: 3, description: "Add chicken and cook for 10 minutes." },
          { stepNumber: 4, description: "Add vegetables and basil, simmer 5 more minutes." },
        ],
        cuisine: "Thai",
        mealType: "dinner",
        dietType: ["non-vegetarian", "gluten-free"],
        difficulty: "medium",
        prepTime: 15,
        cookTime: 20,
        servings: 4,
        nutrition: { calories: 380, protein: 28, carbs: 12, fat: 24 },
        budget: "medium",
        tags: ["curry", "thai", "spicy"],
      },
      {
        title: "Avocado Toast with Poached Egg",
        description: "A quick, healthy breakfast with creamy avocado and a perfectly poached egg.",
        createdBy: adminUser._id,
        ingredients: [
          { name: "Sourdough bread", quantity: "2", unit: "slices" },
          { name: "Avocado", quantity: "1", unit: "ripe" },
          { name: "Eggs", quantity: "2", unit: "large" },
          { name: "Lemon juice", quantity: "1", unit: "tsp" },
          { name: "Chili flakes", quantity: "1", unit: "pinch" },
        ],
        instructions: [
          { stepNumber: 1, description: "Toast the sourdough bread until golden." },
          { stepNumber: 2, description: "Mash avocado with lemon juice, salt, and pepper." },
          { stepNumber: 3, description: "Poach the eggs in simmering water for 3 minutes." },
          { stepNumber: 4, description: "Spread avocado on toast, top with egg and chili flakes." },
        ],
        cuisine: "American",
        mealType: "breakfast",
        dietType: ["vegetarian"],
        difficulty: "easy",
        prepTime: 10,
        cookTime: 5,
        servings: 2,
        nutrition: { calories: 320, protein: 14, carbs: 22, fat: 20 },
        budget: "low",
        tags: ["breakfast", "quick", "healthy"],
      },
      {
        title: "Beef Tacos",
        description: "Zesty ground beef tacos with fresh toppings, ready in under 30 minutes.",
        createdBy: adminUser._id,
        ingredients: [
          { name: "Ground beef", quantity: "500", unit: "grams" },
          { name: "Taco shells", quantity: "8", unit: "pieces" },
          { name: "Taco seasoning", quantity: "1", unit: "packet" },
          { name: "Lettuce", quantity: "1", unit: "cup shredded" },
          { name: "Cheddar cheese", quantity: "1", unit: "cup shredded" },
        ],
        instructions: [
          { stepNumber: 1, description: "Brown the ground beef in a skillet over medium heat." },
          { stepNumber: 2, description: "Add taco seasoning and a splash of water, simmer 5 minutes." },
          { stepNumber: 3, description: "Warm the taco shells in the oven for 5 minutes." },
          { stepNumber: 4, description: "Fill shells with beef, lettuce, and cheese." },
        ],
        cuisine: "Mexican",
        mealType: "dinner",
        dietType: ["non-vegetarian"],
        difficulty: "easy",
        prepTime: 10,
        cookTime: 15,
        servings: 4,
        nutrition: { calories: 410, protein: 26, carbs: 28, fat: 22 },
        budget: "low",
        tags: ["tacos", "mexican", "quick"],
      },
      {
        title: "Vegan Buddha Bowl",
        description: "A colorful, nutrient-packed bowl with quinoa, roasted vegetables, and tahini dressing.",
        createdBy: adminUser._id,
        ingredients: [
          { name: "Quinoa", quantity: "1", unit: "cup" },
          { name: "Sweet potato", quantity: "1", unit: "cubed" },
          { name: "Chickpeas", quantity: "1", unit: "can" },
          { name: "Kale", quantity: "2", unit: "cups" },
          { name: "Tahini", quantity: "2", unit: "tbsp" },
        ],
        instructions: [
          { stepNumber: 1, description: "Cook quinoa according to package instructions." },
          { stepNumber: 2, description: "Roast sweet potato and chickpeas at 200°C for 25 minutes." },
          { stepNumber: 3, description: "Massage kale with a little olive oil and salt." },
          { stepNumber: 4, description: "Assemble bowl and drizzle with tahini." },
        ],
        cuisine: "Mediterranean",
        mealType: "lunch",
        dietType: ["vegan", "vegetarian", "gluten-free"],
        difficulty: "easy",
        prepTime: 15,
        cookTime: 25,
        servings: 2,
        nutrition: { calories: 340, protein: 13, carbs: 48, fat: 11 },
        budget: "medium",
        tags: ["vegan", "healthy", "bowl"],
      },
      {
        title: "Chocolate Chip Cookies",
        description: "Soft, chewy homemade chocolate chip cookies — a timeless dessert favorite.",
        createdBy: adminUser._id,
        ingredients: [
          { name: "Butter", quantity: "1", unit: "cup softened" },
          { name: "Brown sugar", quantity: "1", unit: "cup" },
          { name: "Flour", quantity: "2.5", unit: "cups" },
          { name: "Chocolate chips", quantity: "2", unit: "cups" },
          { name: "Eggs", quantity: "2", unit: "large" },
        ],
        instructions: [
          { stepNumber: 1, description: "Cream butter and sugar together until fluffy." },
          { stepNumber: 2, description: "Beat in eggs, then mix in flour until combined." },
          { stepNumber: 3, description: "Fold in chocolate chips." },
          { stepNumber: 4, description: "Scoop onto baking sheet and bake at 180°C for 10-12 minutes." },
        ],
        cuisine: "American",
        mealType: "dessert",
        dietType: ["vegetarian"],
        difficulty: "easy",
        prepTime: 15,
        cookTime: 12,
        servings: 24,
        nutrition: { calories: 180, protein: 2, carbs: 24, fat: 9 },
        budget: "low",
        tags: ["dessert", "baking", "cookies"],
      },
    ];

    // Add a unique slug to each recipe BEFORE inserting
    sampleRecipes.forEach((r) => {
      r.slug = generateSlug(r.title);
    });

    await Recipe.deleteMany({});
    console.log("Cleared existing recipes.");

    const created = await Recipe.insertMany(sampleRecipes);
    console.log(`Successfully inserted ${created.length} recipes.`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedRecipes();