// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRecipes } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";

function Home() {
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getRecipes({ limit: 4, sort: "popular" });
        setTrendingRecipes(data.recipes);
      } catch (err) {
        console.error("Failed to load trending recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []); // empty dependency array = run once, only on first render

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-16 px-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to AI Smart Kitchen</h1>
        <p className="text-lg text-green-100 mb-6">
          Discover delicious recipes and manage your pantry with ease.
        </p>
        <Link
          to="/recipes"
          className="bg-white text-green-600 px-6 py-3 rounded-md font-medium hover:bg-green-50 transition"
        >
          Browse Recipes
        </Link>
      </div>

      {/* Trending Recipes Section */}
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Trending Recipes
        </h2>

        {loading && <p className="text-gray-600">Loading...</p>}

        {!loading && trendingRecipes.length === 0 && (
          <p className="text-gray-600">No recipes yet — check back soon!</p>
        )}

        {!loading && trendingRecipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;