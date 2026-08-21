// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../services/adminService";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch {
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="p-8 text-gray-600">Loading dashboard...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, color: "bg-blue-50 text-blue-700" },
    { label: "Total Recipes", value: stats.totalRecipes, color: "bg-green-50 text-green-700" },
    { label: "AI Generated Recipes", value: stats.aiGeneratedRecipes, color: "bg-purple-50 text-purple-700" },
    { label: "User Created Recipes", value: stats.userGeneratedRecipes, color: "bg-teal-50 text-teal-700" },
    { label: "Total Reviews", value: stats.totalReviews, color: "bg-yellow-50 text-yellow-700" },
    { label: "Categories", value: stats.totalCategories, color: "bg-pink-50 text-pink-700" },
    { label: "Admins", value: stats.adminCount, color: "bg-red-50 text-red-700" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-2 flex-wrap">
          <Link
            to="/admin/users"
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/recipes"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            Manage Recipes
          </Link>
          <Link
            to="/admin/categories"
            className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition"
          >
            Manage Categories
          </Link>
          <Link
            to="/admin/reviews"
            className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 transition"
          >
            Manage Reviews
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-lg p-5 ${card.color}`}>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-sm mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Users</h2>
          <ul className="divide-y divide-gray-100">
            {stats.recentUsers.map((u) => (
              <li key={u._id} className="py-2">
                <p className="text-gray-800 text-sm font-medium">{u.name}</p>
                <p className="text-gray-500 text-xs">{u.email}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Recipes */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Recipes</h2>
          <ul className="divide-y divide-gray-100">
            {stats.recentRecipes.map((r) => (
              <li key={r._id} className="py-2 flex items-center justify-between">
                <p className="text-gray-800 text-sm">{r.title}</p>
                {r.source === "ai" && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    AI
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;