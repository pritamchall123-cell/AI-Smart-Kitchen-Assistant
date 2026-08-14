// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Pantry from "./pages/Pantry";
import ProtectedRoute from "./components/ProtectedRoute";
import GroceryList from "./pages/GroceryList";
import MealPlanner from "./pages/MealPlanner";
import Nutrition from "./pages/Nutrition";


function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/pantry"
          element={
            <ProtectedRoute>
              <Pantry />
            </ProtectedRoute>
          }
        />

        <Route
          path="/grocery"
          element={
            <ProtectedRoute>
              <GroceryList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meal-planner"
          element={
            <ProtectedRoute>
              <MealPlanner />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nutrition"
          element={
            <ProtectedRoute>
              <Nutrition />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;