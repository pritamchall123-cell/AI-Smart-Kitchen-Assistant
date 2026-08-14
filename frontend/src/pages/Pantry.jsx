// src/pages/Pantry.jsx
import { useState, useEffect } from "react";
import { getPantryItems, addPantryItem, deletePantryItem } from "../services/pantryService";

const CATEGORIES = ["vegetables", "fruits", "dairy", "meat", "grains", "spices", "condiments", "beverages", "other"];

function Pantry() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    category: "other",
    lowStockThreshold: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getPantryItems();
      setItems(data);
    } catch {
      setError("Failed to load pantry items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await addPantryItem({
        ...formData,
        quantity: Number(formData.quantity),
        lowStockThreshold: Number(formData.lowStockThreshold),
      });

      // Reset the form and refresh the list
      setFormData({ name: "", quantity: "", unit: "", category: "other", lowStockThreshold: 1 });
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePantryItem(id);
      // Update local state directly instead of re-fetching — faster, avoids an extra API call
      setItems(items.filter((item) => item._id !== id));
    } catch{
      setError("Failed to delete item.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Pantry</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
      )}

      {/* Add item form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Pantry Item</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Item name"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            placeholder="Quantity"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="Unit (grams, pieces...)"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 capitalize"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="capitalize">
                {cat}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="lowStockThreshold"
            value={formData.lowStockThreshold}
            onChange={handleChange}
            min="0"
            placeholder="Low stock alert at"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition disabled:bg-green-300"
        >
          {submitting ? "Adding..." : "Add Item"}
        </button>
      </form>

      {/* Pantry items list */}
      {loading && <p className="text-gray-600">Loading pantry...</p>}

      {!loading && items.length === 0 && (
        <p className="text-gray-600">Your pantry is empty. Add your first item above.</p>
      )}

      {!loading && items.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isLowStock = item.quantity <= item.lowStockThreshold;
                return (
                  <tr key={item._id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {item.name}
                      {isLowStock && (
                        <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          Low Stock
                        </span>
                      )}
                    </td>
                    <td className={`px-4 py-3 ${isLowStock ? "text-red-600 font-semibold" : "text-gray-700"}`}>
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{item.category}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Pantry;