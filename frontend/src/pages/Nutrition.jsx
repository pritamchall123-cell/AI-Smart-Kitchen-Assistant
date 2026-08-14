// src/pages/Nutrition.jsx
import { useState } from "react";
import { getNutritionReport } from "../services/nutritionService";

// Helper: format a Date as "YYYY-MM-DD" for date input fields
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// Default range: today minus 6 days, through today (last 7 days)
const today = new Date();
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(today.getDate() - 6);

function Nutrition() {
  const [startDate, setStartDate] = useState(formatDate(sevenDaysAgo));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getNutritionReport(startDate, endDate);
      setReport(data);
    } catch  {
      setError("Failed to generate nutrition report.");
    } finally {
      setLoading(false);
    }
  };

  const NUTRIENTS = [
    { key: "calories", label: "Calories", unit: "" },
    { key: "protein", label: "Protein", unit: "g" },
    { key: "carbs", label: "Carbs", unit: "g" },
    { key: "fat", label: "Fat", unit: "g" },
    { key: "fiber", label: "Fiber", unit: "g" },
    { key: "sugar", label: "Sugar", unit: "g" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nutrition Report</h1>

      {/* Date range picker */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          onClick={fetchReport}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition disabled:bg-green-300"
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      {report && (
        <>
          {/* Overall totals */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Totals ({report.startDate} to {report.endDate})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {NUTRIENTS.map((n) => (
                <div key={n.key} className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(report.overallTotals[n.key])}
                    {n.unit}
                  </p>
                  <p className="text-xs text-gray-500 uppercase mt-1">{n.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Daily average */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Average</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {NUTRIENTS.map((n) => (
                <div key={n.key} className="text-center">
                  <p className="text-xl font-semibold text-gray-700">
                    {report.dailyAverage[n.key]}
                    {n.unit}
                  </p>
                  <p className="text-xs text-gray-500 uppercase mt-1">{n.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Day-by-day breakdown */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Day-by-Day Breakdown</h2>

            {Object.keys(report.dailyBreakdown).length === 0 && (
              <p className="text-gray-600">No meals planned in this date range.</p>
            )}

            {Object.entries(report.dailyBreakdown).map(([date, dayData]) => (
              <div key={date} className="border-t border-gray-100 py-3 first:border-t-0">
                <p className="font-medium text-gray-800">{date}</p>
                <p className="text-sm text-gray-600">
                  {Math.round(dayData.calories)} cal · {Math.round(dayData.protein)}g protein ·{" "}
                  {Math.round(dayData.carbs)}g carbs · {Math.round(dayData.fat)}g fat
                </p>
                <ul className="text-sm text-gray-500 mt-1">
                  {dayData.meals.map((meal, idx) => (
                    <li key={idx} className="capitalize">
                      {meal.mealType}: {meal.recipeTitle} ({meal.servings}x)
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Nutrition;