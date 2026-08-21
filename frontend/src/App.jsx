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
import RecipeGenerator from "./pages/RecipeGenerator";
import ChatWidget from "./components/ChatWidget";
import VisionScan from "./pages/VisionScan";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import UserProfile from "./pages/UserProfile";
import Feed from "./pages/Feed";
import Leaderboard from "./pages/Leaderboard";
import AdminRecipes from "./pages/AdminRecipes";
import AdminCategories from "./pages/AdminCategories";
import AdminReviews from "./pages/AdminReview";
import CreateRecipe from "./pages/CreateRecipe";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ChatWidget />
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

        <Route
          path="/ai/generate-recipe"
          element={
            <ProtectedRoute>
              <RecipeGenerator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai/scan"
          element={
            <ProtectedRoute>
              <VisionScan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />

        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />

        <Route path = "/admin/recipes" element={<AdminRoute><AdminRecipes /></AdminRoute>} />
        <Route path = "/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
        <Route path = "/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>}/>
        <Route
          path="/recipes/create"
          element={
            <ProtectedRoute>
              <CreateRecipe />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;