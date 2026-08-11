// src/components/RecipeCard.jsx
import { Link } from "react-router-dom";

function RecipeCard({ recipe }) {
  // Fallback image if a recipe has no images uploaded yet
  const imageUrl =
    recipe.images && recipe.images.length > 0
      ? recipe.images[0]
      : "https://placehold.co/400x300?text=No+Image";

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <Link
      to={`/recipes/${recipe._id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition block"
    >
      <img
        src={imageUrl}
        alt={recipe.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg truncate">
          {recipe.title}
        </h3>

        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
          <span>⏱ {totalTime} min</span>
          <span className="capitalize">🎯 {recipe.difficulty}</span>
          <span>⭐ {recipe.averageRating?.toFixed(1) || "0.0"}</span>
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;