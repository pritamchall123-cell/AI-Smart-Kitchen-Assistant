// src/components/RecipeCard.jsx

import { Link } from "react-router-dom";
import { Heart, Clock, Star, ChefHat } from "lucide-react";

function RecipeCard({ recipe }) {
const BACKEND_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const imageUrl =
  recipe.images && recipe.images.length > 0
    ? recipe.images[0].startsWith("http")
      ? recipe.images[0]
      : `${BACKEND_URL}${recipe.images[0]}`
    : "https://placehold.co/400x300?text=No+Image";

  const totalTime =
    (recipe.prepTime || 0) +
    (recipe.cookTime || 0);

  const rating =
    recipe.averageRating?.toFixed(1) || "0.0";

  const difficulty =
    recipe.difficulty || "Easy";

  return (
    <article className="group overflow-hidden rounded-3xl border border-[#E7E5E4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* =====================================================
          IMAGE
      ====================================================== */}

      <Link
        to={`/recipes/${recipe._id}`}
        className="relative block h-56 overflow-hidden"
      >

        <img
          src={imageUrl}
          alt={recipe.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* IMAGE GRADIENT */}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

        {/* DIFFICULTY */}

        <div className="absolute left-4 top-4">

          <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold capitalize text-[#292524] shadow-sm backdrop-blur">
            {difficulty}
          </span>

        </div>

        {/* FAVORITE BUTTON */}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="Add recipe to favorites"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#57534E] shadow-sm backdrop-blur transition-all hover:scale-110 hover:text-red-500"
        >
          <Heart
            size={17}
            strokeWidth={2}
          />
        </button>

        {/* TIME */}

        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-sm font-medium text-white">

          <Clock size={15} />

          <span>
            {totalTime} min
          </span>

        </div>

      </Link>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="p-5">

        {/* TITLE */}

        <Link
          to={`/recipes/${recipe._id}`}
          className="block"
        >

          <h3 className="line-clamp-1 text-lg font-bold text-[#1C1917] transition-colors group-hover:text-[#EA580C]">
            {recipe.title}
          </h3>

        </Link>

        {/* DESCRIPTION */}
        <p className="mt-2 line-clamp-2 min-h-[42px] text-sm leading-5 text-[#78716C]">
          {recipe.description ||
            "A delicious recipe waiting to be discovered."}
        </p>

        {/* =================================================
            BOTTOM INFORMATION
        ================================================== */}

        <div className="mt-5 flex items-center justify-between border-t border-[#F5F5F4] pt-4">

          {/* RATING */}
          <div className="flex items-center gap-1.5">
            <Star
              size={16}
              fill="currentColor"
              className="text-yellow-400"
            />

            <span className="text-sm font-bold text-[#292524]">
              {rating}
            </span>
            <span className="text-xs text-[#A8A29E]">
              ({recipe.numReviews || 0})
            </span>
          </div>

          {/* DIFFICULTY */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#78716C]">
            <ChefHat size={15} />
            <span className="capitalize">
              {difficulty}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default RecipeCard;