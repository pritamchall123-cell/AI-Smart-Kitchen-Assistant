// src/pages/Leaderboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getLeaderboard } from "../services/communityService";

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaders(data);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const medalFor = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Top Chefs</h1>

      {loading ? (
        <p className="text-gray-600">Loading leaderboard...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg divide-y divide-gray-100">
          {leaders.map((leader, index) => (
            <Link
              key={leader.userId}
              to={`/profile/${leader.userId}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-xl w-8 text-center">{medalFor(index)}</span>
                <span className="font-medium text-gray-800">{leader.name}</span>
              </div>
              <div className="text-sm text-gray-500">
                {leader.recipeCount} recipes · {leader.totalFavorites} favorites
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Leaderboard;