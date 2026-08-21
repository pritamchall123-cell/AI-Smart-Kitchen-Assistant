// src/pages/RecipeGenerator.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateRecipe } from "../services/aiService";

function RecipeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [dietType, setDietType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [maxCookTime, setMaxCookTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");

    try {
      const recipe = await generateRecipe({
        prompt,
        dietType: dietType || undefined,
        cuisine: cuisine || undefined,
        maxCookTime: maxCookTime ? Number(maxCookTime) : undefined,
      });

      // Redirect straight to the newly created recipe's detail page
      navigate(`/recipes/${recipe._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Recipe Generator</h1>
      <p className="text-gray-600 mb-6">
        Describe what you're craving, and let AI create a complete recipe for you.
      </p>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What would you like to cook?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            rows={3}
            placeholder="e.g., a quick vegetarian dinner with chickpeas and rice"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diet Type</label>
            <input
              type="text"
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              placeholder="e.g., vegan"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
            <input
              type="text"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="e.g., Italian"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Time (min)</label>
            <input
              type="number"
              value={maxCookTime}
              onChange={(e) => setMaxCookTime(e.target.value)}
              placeholder="e.g., 30"
              min="1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition disabled:bg-green-300"
        >
          {loading ? "Generating your recipe... (this can take a few seconds)" : "Generate Recipe"}
        </button>
      </form>
    </div>
  );
}

export default RecipeGenerator;