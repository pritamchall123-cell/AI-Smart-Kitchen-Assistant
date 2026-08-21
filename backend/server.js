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
const adminRoutes = require("./routes/adminRoutes");
const communityRoutes = require("./routes/communityRoutes");
const path = require("path");

// Connect to MongoDB
connectDB();

// Create the Express application
const app = express();

// Middleware: allows our server to accept and understand JSON data in requests
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.CLIENT_URL, // will be set to your deployed frontend URL on Render
  ],
  credentials: true,
}));

// Serve uploaded images as static files, e.g. http://localhost:5500/uploads/recipes/filename.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.use("/api/admin",adminRoutes);
app.use("/api/community", communityRoutes);


// A simple test route to confirm the server is alive
app.get("/", (req, res) => {
  res.send("AI Smart Kitchen Assistant API is running...");
});

// Read the port from .env, or fall back to 5500 if not set
const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

