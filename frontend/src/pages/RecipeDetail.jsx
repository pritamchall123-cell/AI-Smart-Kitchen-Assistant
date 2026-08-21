// src/pages/RecipeDetail.jsx

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  getRecipeById,
} from "../services/recipeService";

import {
  getReviewsForRecipe,
  createReview,
  deleteReview,
} from "../services/reviewService";

function RecipeDetail() {
  const { id } = useParams();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  /* ==========================================================
     FETCH RECIPE
  ========================================================== */

  const fetchRecipe = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getRecipeById(id);
      setRecipe(data);
    } catch (err) {
      console.error("Failed to load recipe:", err);
      setError("Recipe not found.");
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     FETCH REVIEWS
  ========================================================== */

  const fetchReviews = async () => {
    setReviewsLoading(true);

    try {
      const data = await getReviewsForRecipe(id);
      setReviews(data);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
  let cancelled = false;

  const loadRecipeData = async () => {
    try {
      const [recipeData, reviewsData] = await Promise.all([
        getRecipeById(id),
        getReviewsForRecipe(id),
      ]);

      if (cancelled) return;

      setRecipe(recipeData);
      setReviews(reviewsData);
      setError("");
    } catch (err) {
      if (cancelled) return;

      console.error("Failed to load recipe:", err);

      setError("Recipe not found.");
    } finally {
      if (!cancelled) {
        setLoading(false);
        setReviewsLoading(false);
      }
    }
  };

  loadRecipeData();

  return () => {
    cancelled = true;
  };
}, [id]);

  /* ==========================================================
     SUBMIT REVIEW
  ========================================================== */

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    setReviewError("");
    setSubmitting(true);

    try {
      await createReview(id, {
        rating,
        comment,
      });

      setComment("");
      setRating(5);

      await fetchReviews();
      await fetchRecipe();

    } catch (err) {
      setReviewError(
        err.response?.data?.message ||
          "Failed to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ==========================================================
     DELETE REVIEW
  ========================================================== */

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);

      setReviews((prev) =>
        prev.filter((review) => review._id !== reviewId)
      );

      await fetchRecipe();

    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  /* ==========================================================
     LOADING / ERROR
  ========================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6]">
        <div className="mx-auto max-w-6xl px-5 py-16">

          <div className="animate-pulse">

            <div className="h-6 w-32 rounded bg-stone-200" />

            <div className="mt-8 h-[420px] rounded-3xl bg-stone-200" />

            <div className="mt-8 h-10 w-2/3 rounded bg-stone-200" />

            <div className="mt-4 h-5 w-1/2 rounded bg-stone-200" />

          </div>

        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#FAF9F6] px-5">

        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-100 text-4xl">
            🍳
          </div>

          <h1 className="mt-6 text-2xl font-bold text-[#1C1917]">
            Recipe not found
          </h1>

          <p className="mt-2 text-sm text-[#78716C]">
            The recipe you're looking for doesn't exist.
          </p>

          <Link
            to="/recipes"
            className="mt-6 inline-flex rounded-xl bg-[#EA580C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#C2410C]"
          >
            Browse Recipes
          </Link>

        </div>

      </div>
    );
  }

  /* ==========================================================
     RECIPE DATA
  ========================================================== */

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

  const averageRating =
    recipe.averageRating?.toFixed(1) || "0.0";

  const userHasReviewed =
    isAuthenticated &&
    reviews.some(
      (review) =>
        review.user?._id === user?._id
    );

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <main className="min-h-screen bg-[#FAF9F6]">

      {/* ======================================================
          BREADCRUMB
      ======================================================= */}

      <div className="mx-auto max-w-6xl px-5 pt-8 sm:px-8">

        <div className="flex items-center gap-2 text-sm text-[#A8A29E]">

          <Link
            to="/"
            className="transition-colors hover:text-[#EA580C]"
          >
            Home
          </Link>

          <span>›</span>

          <Link
            to="/recipes"
            className="transition-colors hover:text-[#EA580C]"
          >
            Recipes
          </Link>

          <span>›</span>

          <span className="max-w-[180px] truncate text-[#57534E]">
            {recipe.title}
          </span>

        </div>

      </div>

      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="mx-auto max-w-6xl px-5 pb-12 pt-6 sm:px-8">

        <div className="overflow-hidden rounded-[28px] bg-white shadow-card">

          <div className="grid lg:grid-cols-2">

            {/* IMAGE */}

            <div className="relative min-h-[320px] overflow-hidden lg:min-h-[520px]">

              <img
                src={imageUrl}
                alt={recipe.title}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Difficulty */}

              <div className="absolute left-5 top-5">

                <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold capitalize text-[#1C1917] shadow-sm backdrop-blur">
                  {recipe.difficulty || "Easy"}
                </span>

              </div>

              {/* Time */}

              <div className="absolute bottom-5 left-5">

                <span className="rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                  ⏱ {totalTime} minutes
                </span>

              </div>

            </div>

            {/* CONTENT */}

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">

              {/* Rating */}

              <div className="flex items-center gap-3">

                <div className="flex items-center gap-1">

                  <span className="text-xl text-yellow-500">
                    ★
                  </span>

                  <span className="font-bold text-[#1C1917]">
                    {averageRating}
                  </span>

                </div>

                <span className="text-sm text-[#A8A29E]">
                  {recipe.numReviews || 0} reviews
                </span>

              </div>

              {/* Title */}

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#1C1917] sm:text-4xl lg:text-5xl">
                {recipe.title}
              </h1>

              {/* Description */}

              <p className="mt-5 text-base leading-7 text-[#78716C]">
                {recipe.description ||
                  "A delicious recipe made for your kitchen."}
              </p>

              {/* Metadata */}

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">

                <InfoCard
                  icon="⏱"
                  label="Prep"
                  value={`${recipe.prepTime || 0} min`}
                />

                <InfoCard
                  icon="🔥"
                  label="Cook"
                  value={`${recipe.cookTime || 0} min`}
                />

                <InfoCard
                  icon="🍽"
                  label="Servings"
                  value={recipe.servings || "-"}
                />

                <InfoCard
                  icon="🎯"
                  label="Difficulty"
                  value={recipe.difficulty || "Easy"}
                  capitalize
                />

              </div>

              {/* Creator */}

              {recipe.createdBy && (
                <div className="mt-8 flex items-center gap-3 border-t border-[#F5F5F4] pt-6">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700">
                    {recipe.createdBy.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <div>
                    <p className="text-xs text-[#A8A29E]">
                      Recipe created by
                    </p>

                    <p className="text-sm font-semibold text-[#292524]">
                      {recipe.createdBy.name}
                    </p>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          RECIPE CONTENT
      ======================================================= */}

      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">

        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">

          {/* ==================================================
              INGREDIENTS
          =================================================== */}

          <aside>

            <div className="sticky top-28 rounded-3xl border border-[#E7E5E4] bg-white p-6 shadow-card">

              <div className="flex items-center justify-between">

                <h2 className="text-xl font-bold text-[#1C1917]">
                  Ingredients
                </h2>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                  {recipe.ingredients?.length || 0} items
                </span>

              </div>

              <div className="mt-6 space-y-3">

                {recipe.ingredients?.map(
                  (ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-xl bg-[#FAF9F6] p-3"
                    >

                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                        {index + 1}
                      </div>

                      <div className="text-sm leading-5">

                        <span className="font-semibold text-[#292524]">
                          {ingredient.quantity}{" "}
                          {ingredient.unit}
                        </span>{" "}

                        <span className="text-[#57534E]">
                          {ingredient.name}
                        </span>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

          </aside>

          {/* ==================================================
              INSTRUCTIONS
          =================================================== */}

          <div>

            <div className="rounded-3xl border border-[#E7E5E4] bg-white p-6 shadow-card sm:p-8">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    Let's cook
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-[#1C1917]">
                    Instructions
                  </h2>
                </div>

                <div className="hidden rounded-xl bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 sm:block">
                  {recipe.instructions?.length || 0} steps
                </div>

              </div>

              <div className="mt-8 space-y-7">

                {recipe.instructions?.map(
                  (step, index) => (
                    <div
                      key={step.stepNumber || index}
                      className="relative flex gap-4"
                    >

                      {/* Number */}

                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EA580C] text-sm font-bold text-white shadow-sm">
                        {step.stepNumber || index + 1}
                      </div>

                      {/* Content */}

                      <div className="flex-1 pb-2">

                        <h3 className="font-bold text-[#292524]">
                          Step {step.stepNumber || index + 1}
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-[#57534E]">
                          {step.description}
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          REVIEWS
      ======================================================= */}

      <section className="border-t border-[#E7E5E4] bg-white">

        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">

          <div className="grid gap-10 lg:grid-cols-[320px_1fr]">

            {/* REVIEW SUMMARY */}

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Community
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-[#1C1917]">
                Reviews
              </h2>

              <div className="mt-6 rounded-3xl bg-[#FAF9F6] p-6">

                <div className="text-5xl font-extrabold text-[#1C1917]">
                  {averageRating}
                </div>

                <div className="mt-2 text-xl text-yellow-500">
                  ★★★★★
                </div>

                <p className="mt-2 text-sm text-[#78716C]">
                  Based on {recipe.numReviews || 0} reviews
                </p>

              </div>

            </div>

            {/* REVIEWS */}

            <div>

              {/* REVIEW FORM */}

              {isAuthenticated &&
                !userHasReviewed && (
                  <form
                    onSubmit={handleSubmitReview}
                    className="mb-8 rounded-3xl border border-[#E7E5E4] bg-[#FAF9F6] p-6"
                  >

                    <h3 className="text-lg font-bold text-[#1C1917]">
                      Share your experience
                    </h3>

                    {reviewError && (
                      <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                        {reviewError}
                      </div>
                    )}

                    {/* Stars */}

                    <div className="mt-5">

                      <p className="mb-2 text-xs font-semibold text-[#57534E]">
                        Your rating
                      </p>

                      <div className="flex gap-1">

                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setRating(star)
                              }
                              className={`text-3xl transition-transform hover:scale-110 ${
                                star <= rating
                                  ? "text-yellow-400"
                                  : "text-stone-300"
                              }`}
                            >
                              ★
                            </button>
                          )
                        )}

                      </div>

                    </div>

                    {/* Comment */}

                    <textarea
                      value={comment}
                      onChange={(e) =>
                        setComment(e.target.value)
                      }
                      rows={4}
                      placeholder="What did you think about this recipe?"
                      className="mt-5 w-full resize-none rounded-2xl border border-[#D6D3D1] bg-white px-4 py-3 text-sm text-[#292524] outline-none transition-colors placeholder:text-[#A8A29E] focus:border-orange-400"
                    />

                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-4 rounded-xl bg-[#EA580C] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C2410C] disabled:cursor-not-allowed disabled:bg-stone-300"
                    >
                      {submitting
                        ? "Submitting..."
                        : "Post Review"}
                    </button>

                  </form>
                )}

              {!isAuthenticated && (
                <div className="mb-8 rounded-2xl bg-orange-50 p-5 text-sm text-orange-800">
                  <Link
                    to="/login"
                    className="font-bold underline"
                  >
                    Log in
                  </Link>{" "}
                  to leave a review.
                </div>
              )}

              {/* Review loading */}

              {reviewsLoading && (
                <div className="space-y-4">

                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="animate-pulse rounded-2xl border border-[#E7E5E4] p-5"
                    >
                      <div className="h-4 w-32 rounded bg-stone-200" />
                      <div className="mt-3 h-4 w-full rounded bg-stone-200" />
                    </div>
                  ))}

                </div>
              )}

              {/* No reviews */}

              {!reviewsLoading &&
                reviews.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-[#D6D3D1] p-10 text-center">

                    <div className="text-4xl">
                      💬
                    </div>

                    <h3 className="mt-3 font-bold text-[#1C1917]">
                      No reviews yet
                    </h3>

                    <p className="mt-1 text-sm text-[#78716C]">
                      Be the first person to review this recipe.
                    </p>

                  </div>
                )}

              {/* Reviews list */}

              {!reviewsLoading &&
                reviews.length > 0 && (
                  <div className="space-y-4">

                    {reviews.map((review) => (
                      <article
                        key={review._id}
                        className="rounded-2xl border border-[#E7E5E4] bg-white p-5"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                              {review.user?.name
                                ?.charAt(0)
                                .toUpperCase() ||
                                "U"}
                            </div>

                            <div>

                              <p className="text-sm font-bold text-[#292524]">
                                {review.user?.name ||
                                  "User"}
                              </p>

                              <div className="mt-0.5 flex items-center gap-2">

                                <span className="text-sm text-yellow-400">
                                  {"★".repeat(
                                    review.rating
                                  )}
                                  <span className="text-stone-300">
                                    {"★".repeat(
                                      5 -
                                        review.rating
                                    )}
                                  </span>
                                </span>

                              </div>

                            </div>

                          </div>

                          {isAuthenticated &&
                            user?._id ===
                              review.user?._id && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteReview(
                                    review._id
                                  )
                                }
                                className="text-xs font-medium text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            )}

                        </div>

                        {review.comment && (
                          <p className="mt-4 text-sm leading-6 text-[#57534E]">
                            {review.comment}
                          </p>
                        )}

                      </article>
                    ))}

                  </div>
                )}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

/* ============================================================
   INFO CARD COMPONENT
============================================================ */

function InfoCard({
  icon,
  label,
  value,
  capitalize = false,
}) {
  return (
    <div className="rounded-2xl bg-[#FAF9F6] p-3">

      <div className="flex items-center gap-2">

        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm shadow-sm">
          {icon}
        </span>

        <div>

          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A8A29E]">
            {label}
          </p>

          <p
            className={`mt-0.5 text-sm font-bold text-[#292524] ${
              capitalize ? "capitalize" : ""
            }`}
          >
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}

export default RecipeDetail;