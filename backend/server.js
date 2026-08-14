// server.js
// This is the entry point of our backend application.

// Load environment variables from .env FIRST, before anything else uses them
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const pantryRoutes = require("./routes/pantryRoutes");
const groceryRoutes = require("./routes/groceryRoutes");
const mealRoutes = require("./routes/mealRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Connect to MongoDB
connectDB();

// Create the Express application
const app = express();

// Middleware: allows our server to accept and understand JSON data in requests
app.use(express.json());

// Middleware: allows our frontend (different URL/port) to communicate with this backend
app.use(cors());

// Use the authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/grocery", groceryRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/ai", aiRoutes);

// A simple test route to confirm the server is alive
app.get("/", (req, res) => {
  res.send("AI Smart Kitchen Assistant API is running...");
});

// Read the port from .env, or fall back to 5500 if not set
const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

