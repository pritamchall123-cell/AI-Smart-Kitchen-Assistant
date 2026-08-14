// src/pages/RecipeDetail.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRecipeById } from "../services/recipeService";
import { getReviewsForRecipe, createReview, deleteReview } from "../services/reviewService";

function RecipeDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const fetchRecipe = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRecipeById(id);
      setRecipe(data);
    } catch{
      setError("Recipe not found.");
    } finally {
      setLoading(false);
    }
  };

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
    fetchRecipe();
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setSubmitting(true);

    try {
      await createReview(id, { rating, comment });
      setComment("");
      setRating(5);
      fetchReviews(); // refresh review list
      fetchRecipe(); // refresh recipe to show updated averageRating
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter((r) => r._id !== reviewId));
      fetchRecipe(); // refresh recipe's averageRating
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  // Check if the logged-in user has already reviewed this recipe —
  // used to hide the form and avoid a duplicate-review error from the backend
  const userHasReviewed = isAuthenticated && reviews.some((r) => r.user._id === user._id);

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

      {/* Reviews Section */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>

        {/* Review submission form — only shown if logged in AND hasn't already reviewed */}
        {isAuthenticated && !userHasReviewed && (
          <form onSubmit={handleSubmitReview} className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Leave a Review</h3>

            {reviewError && (
              <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3 text-sm">
                {reviewError}
              </div>
            )}

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share your thoughts on this recipe..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition disabled:bg-green-300"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        {!isAuthenticated && (
          <p className="text-gray-500 mb-6 text-sm">Log in to leave a review.</p>
        )}

        {/* Existing reviews list */}
        {reviewsLoading && <p className="text-gray-600">Loading reviews...</p>}

        {!reviewsLoading && reviews.length === 0 && (
          <p className="text-gray-600">No reviews yet. Be the first to review this recipe!</p>
        )}

        {!reviewsLoading && reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white shadow-sm rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-800">{review.user.name}</span>
                    <span className="ml-2 text-yellow-400">
                      {"★".repeat(review.rating)}
                      <span className="text-gray-300">{"★".repeat(5 - review.rating)}</span>
                    </span>
                  </div>

                  {/* Only show delete button if this review belongs to the logged-in user */}
                  {isAuthenticated && user._id === review.user._id && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  )}
                </div>
                {review.comment && (
                  <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeDetail;