// src/pages/AdminRecipes.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllRecipesAdmin, toggleRecipePublish, deleteRecipeAdmin } from "../services/adminService";

function AdminRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadRecipes = async () => {
      setLoading(true);
      try {
        const data = await getAllRecipesAdmin({ limit: 50 });
        if (!ignore) {
          setRecipes(data.recipes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadRecipes();

    return () => {
      ignore = true;
    };
  }, []);

  const handleTogglePublish = async (id) => {
    try {
      await toggleRecipePublish(id);
      setRecipes(recipes.map((r) => (r._id === id ? { ...r, isPublished: !r.isPublished } : r)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecipeAdmin(id);
      setRecipes(recipes.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Recipes</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Creator</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe._id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <Link to={`/recipes/${recipe._id}`} className="text-green-600 hover:underline">
                      {recipe.title}
                    </Link>
                    {recipe.source === "ai" && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        AI
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{recipe.createdBy?.name || "Unknown"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        recipe.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {recipe.isPublished ? "Published" : "Unpublished"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() => handleTogglePublish(recipe._id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {recipe.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDelete(recipe._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminRecipes;