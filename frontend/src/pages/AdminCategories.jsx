// src/pages/AdminCategories.jsx
import { useState, useEffect } from "react";
import { getCategories, createCategory, deleteCategory } from "../services/adminService";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("cuisine");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await getCategories();
        if (!ignore) {
          setCategories(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      ignore = true;
    };
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createCategory({ name, type });
      setName("");
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Categories</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleCreate} className="bg-white shadow-md rounded-lg p-6 mb-6 flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Category name"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="cuisine">Cuisine</option>
          <option value="mealType">Meal Type</option>
          <option value="diet">Diet</option>
          <option value="other">Other</option>
        </select>
        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded-md font-medium hover:bg-green-700 transition"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg divide-y divide-gray-100">
          {categories.map((cat) => (
            <div key={cat._id} className="flex items-center justify-between px-4 py-3">
              <div>
                <span className="text-gray-800 font-medium">{cat.name}</span>
                <span className="ml-2 text-xs text-gray-400 capitalize">{cat.type}</span>
              </div>
              <button
                onClick={() => handleDelete(cat._id)}
                className="text-red-600 hover:underline text-sm"
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

export default AdminCategories;