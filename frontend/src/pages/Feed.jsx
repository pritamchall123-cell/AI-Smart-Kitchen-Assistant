// src/pages/Feed.jsx
import { useState, useEffect } from "react";
import { getFeed } from "../services/communityService";
import RecipeCard from "../components/RecipeCard";

function Feed() {
  const [recipes, setRecipes] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await getFeed();
        setRecipes(data.recipes);
        if (data.message) setMessage(data.message);
      } catch (err) {
        console.error("Failed to load feed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Feed</h1>

      {loading && <p className="text-gray-600">Loading feed...</p>}

      {!loading && message && <p className="text-gray-600">{message}</p>}

      {!loading && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;