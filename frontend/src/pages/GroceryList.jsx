// src/pages/GroceryList.jsx
import { useState, useEffect } from "react";
import {
  getGroceryList,
  addGroceryItem,
  toggleItemPurchased,
  deleteGroceryItem,
  clearPurchasedItems,
  autoGenerateGroceryList,
} from "../services/groceryService";

function GroceryList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("");

  const fetchList = async () => {
    setLoading(true);
    try {
      const data = await getGroceryList();
      setItems(data.items);
    } catch  {
      setError("Failed to load grocery list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      const updatedList = await addGroceryItem({
        name: newItemName,
        quantity: newItemQuantity || "1",
        unit: newItemUnit,
      });
      setItems(updatedList.items);
      setNewItemName("");
      setNewItemQuantity("");
      setNewItemUnit("");
    } catch{
      setError("Failed to add item.");
    }
  };

  const handleToggle = async (itemId) => {
    try {
      const updatedList = await toggleItemPurchased(itemId);
      setItems(updatedList.items);
    } catch {
      setError("Failed to update item.");
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const updatedList = await deleteGroceryItem(itemId);
      setItems(updatedList.items);
    } catch  {
      setError("Failed to delete item.");
    }
  };

  const handleClearPurchased = async () => {
    try {
      const updatedList = await clearPurchasedItems();
      setItems(updatedList.items);
    } catch {
      setError("Failed to clear purchased items.");
    }
  };

  const handleAutoGenerate = async () => {
    setError("");
    setInfoMessage("");
    try {
      const result = await autoGenerateGroceryList();
      setItems(result.list.items);
      setInfoMessage(result.message);
    } catch {
      setError("Failed to auto-generate list.");
    }
  };

  const purchasedCount = items.filter((item) => item.purchased).length;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Grocery List</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
      {infoMessage && (
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded mb-4">{infoMessage}</div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleAutoGenerate}
          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition"
        >
          Auto-Generate from Pantry
        </button>
        {purchasedCount > 0 && (
          <button
            onClick={handleClearPurchased}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition"
          >
            Clear Purchased ({purchasedCount})
          </button>
        )}
      </div>

      {/* Add item form */}
      <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add an item..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          value={newItemQuantity}
          onChange={(e) => setNewItemQuantity(e.target.value)}
          placeholder="Qty"
          className="w-20 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          value={newItemUnit}
          onChange={(e) => setNewItemUnit(e.target.value)}
          placeholder="Unit"
          className="w-24 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition"
        >
          Add
        </button>
      </form>

      {/* List */}
      {loading && <p className="text-gray-600">Loading...</p>}

      {!loading && items.length === 0 && (
        <p className="text-gray-600">Your grocery list is empty.</p>
      )}

      {!loading && items.length > 0 && (
        <ul className="bg-white shadow-md rounded-lg divide-y divide-gray-100">
          {items.map((item) => (
            <li key={item._id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.purchased}
                  onChange={() => handleToggle(item._id)}
                  className="w-5 h-5 accent-green-600 cursor-pointer"
                />
                <span
                  className={`${
                    item.purchased ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                >
                  {item.name} {item.quantity && `(${item.quantity} ${item.unit})`}
                </span>
                {item.source === "auto" && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    Suggested
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-600 hover:underline text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GroceryList;