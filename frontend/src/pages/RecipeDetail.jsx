// src/pages/RecipeDetail.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../services/recipeService";

function RecipeDetail() {
  // useParams reads dynamic segments from the URL — for a route like "/recipes/:id",
  // visiting "/recipes/abc123" gives us { id: "abc123" }
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch {
        setError("Recipe not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]); // re-fetch if the ID in the URL ever changes (e.g., navigating between recipes)

  if (loading) return <p className="p-8 text-gray-600">Loading recipe...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!recipe) return null;

  const imageUrl =
    recipe.images && recipe.images.length > 0
      ? recipe.images[0]
      : "https://placehold.co/800x400?text=No+Image";

  return (
    <div className="max-w-4xl mx-auto p-8">
      <img
        src={imageUrl}
        alt={recipe.title}
        className="w-full h-80 object-cover rounded-lg mb-6"
      />

      <h1 className="text-3xl font-bold text-gray-800">{recipe.title}</h1>
      <p className="text-gray-600 mt-2">{recipe.description}</p>

      <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-700">
        <span>⏱ Prep: {recipe.prepTime} min</span>
        <span>🍳 Cook: {recipe.cookTime} min</span>
        <span>🍽 Servings: {recipe.servings}</span>
        <span className="capitalize">🎯 {recipe.difficulty}</span>
        <span>⭐ {recipe.averageRating?.toFixed(1) || "0.0"} ({recipe.numReviews || 0} reviews)</span>
        <span>👁 {recipe.views} views</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing, index) => (
              <li key={index} className="text-gray-700">
                • {ing.quantity} {ing.unit} {ing.name}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Instructions</h2>
          <ol className="space-y-3">
            {recipe.instructions.map((step) => (
              <li key={step.stepNumber} className="text-gray-700">
                <span className="font-semibold">Step {step.stepNumber}:</span>{" "}
                {step.description}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {recipe.createdBy && (
        <p className="text-sm text-gray-500 mt-8">
          Recipe by {recipe.createdBy.name}
        </p>
      )}
    </div>
  );
}

export default RecipeDetail;