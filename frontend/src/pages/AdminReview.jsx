// src/pages/AdminReviews.jsx
import { useState, useEffect } from "react";
import { getAllReviewsAdmin, deleteReviewAdmin } from "../services/adminService";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await getAllReviewsAdmin({ limit: 50 });
        if (!active) return;
        setReviews(data.reviews);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteReviewAdmin(id);
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Reviews</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white shadow-sm rounded-lg p-4 flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {review.user?.name} on <span className="font-medium">{review.recipe?.title}</span>
                </p>
                <p className="text-yellow-400 text-sm">
                  {"★".repeat(review.rating)}
                  <span className="text-gray-300">{"★".repeat(5 - review.rating)}</span>
                </p>
                {review.comment && <p className="text-gray-700 text-sm mt-1">{review.comment}</p>}
              </div>
              <button
                onClick={() => handleDelete(review._id)}
                className="text-red-600 hover:underline text-sm shrink-0 ml-4"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReviews;