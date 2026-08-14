// src/pages/MealPlanner.jsx
import { useState, useEffect } from "react";
import { getMealPlan, addMealPlanEntry, deleteMealPlanEntry } from "../services/mealService";
import { getRecipes } from "../services/recipeService";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

// Helper: given any date, find the Monday of that week
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// Helper: format a Date object as "YYYY-MM-DD" for our API and for display keys
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function MealPlanner() {
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const [entries, setEntries] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // The 7 dates of the currently displayed week, e.g. ["2025-06-09", ..., "2025-06-15"]
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return formatDate(d);
  });

  const fetchWeek = async () => {
    setLoading(true);
    setError("");
    try {
      const startDate = weekDates[0];
      const endDate = weekDates[6];
      const data = await getMealPlan(startDate, endDate);
      setEntries(data);
    } catch {
      setError("Failed to load meal plan.");
    } finally {
      setLoading(false);
    }
  };

  // Load the full recipe list once, so we can offer a dropdown of choices
  const fetchRecipesForDropdown = async () => {
    try {
      const data = await getRecipes({ limit: 100 });
      setAllRecipes(data.recipes);
    } catch (err) {
      console.error("Failed to load recipes for dropdown:", err);
    }
  };

  useEffect(() => {
    fetchWeek();
  }, [weekStart]); // re-fetch whenever the displayed week changes

  useEffect(() => {
    fetchRecipesForDropdown();
  }, []); // only once

  const handleAddEntry = async (date, mealType, recipeId) => {
    if (!recipeId) return;

    try {
      await addMealPlanEntry({ recipe: recipeId, date, mealType, servings: 1 });
      fetchWeek(); // refresh to show the new entry
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add meal.");
    }
  };

  const handleRemoveEntry = async (id) => {
    try {
      await deleteMealPlanEntry(id);
      setEntries(entries.filter((e) => e._id !== id));
    } catch  {
      setError("Failed to remove meal.");
    }
  };

  const goToPreviousWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };

  const goToNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  // Finds all entries matching a specific date + mealType combination
  const getEntriesFor = (date, mealType) => {
    return entries.filter((e) => formatDate(new Date(e.date)) === date && e.mealType === mealType);
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Meal Planner</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousWeek}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          ← Previous Week
        </button>
        <span className="font-medium text-gray-700">
          {weekDates[0]} to {weekDates[6]}
        </span>
        <button
          onClick={goToNextWeek}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Next Week →
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading meal plan...</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[900px]">
            {weekDates.map((date) => (
              <div key={date} className="bg-white rounded-lg shadow-sm p-3">
                <h3 className="font-semibold text-gray-800 text-sm mb-3 text-center">
                  {new Date(date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                </h3>

                {MEAL_TYPES.map((mealType) => (
                  <div key={mealType} className="mb-3">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">{mealType}</p>

                    {getEntriesFor(date, mealType).map((entry) => (
                      <div
                        key={entry._id}
                        className="bg-green-50 border border-green-200 rounded px-2 py-1 mb-1 flex items-center justify-between text-xs"
                      >
                        <span className="truncate">{entry.recipe?.title || "Recipe"}</span>
                        <button
                          onClick={() => handleRemoveEntry(entry._id)}
                          className="text-red-500 hover:text-red-700 ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <select
                      onChange={(e) => {
                        handleAddEntry(date, mealType, e.target.value);
                        e.target.value = ""; // reset dropdown after selecting
                      }}
                      value=""
                      className="w-full text-xs border border-gray-200 rounded px-1 py-1 text-gray-500"
                    >
                      <option value="">+ Add recipe</option>
                      {allRecipes.map((recipe) => (
                        <option key={recipe._id} value={recipe._id}>
                          {recipe.title}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MealPlanner;