// src/pages/VisionScan.jsx
import { useState } from "react";
import { detectIngredients } from "../services/aiService";

function VisionScan() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setResults(null);
    setError("");

    // Create a local preview URL so the user can see the image they selected,
    // without needing to upload it first just to preview it.
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError("");

    try {
      const data = await detectIngredients(selectedFile);
      setResults(data.ingredients);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confidenceColor = (confidence) => {
    if (confidence === "high") return "bg-green-100 text-green-700";
    if (confidence === "medium") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Scan Your Fridge or Pantry</h1>
      <p className="text-gray-600 mb-6">
        Upload a photo, and AI will identify the ingredients it can see.
      </p>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      <div className="bg-white shadow-md rounded-lg p-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 mb-4
            file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
            file:bg-green-50 file:text-green-700 file:font-medium
            hover:file:bg-green-100 cursor-pointer"
        />

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Selected preview"
            className="w-full h-64 object-cover rounded-md mb-4"
          />
        )}

        <button
          onClick={handleAnalyze}
          disabled={!selectedFile || loading}
          className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition disabled:bg-green-300"
        >
          {loading ? "Analyzing image..." : "Analyze Image"}
        </button>
      </div>

      {results && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Detected Ingredients</h2>

          {results.length === 0 ? (
            <p className="text-gray-600">No ingredients could be clearly identified. Try a clearer photo.</p>
          ) : (
            <ul className="space-y-2">
              {results.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between border border-gray-100 rounded-md px-3 py-2"
                >
                  <span className="text-gray-800 capitalize">{item.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${confidenceColor(item.confidence)}`}>
                    {item.confidence} confidence
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default VisionScan;