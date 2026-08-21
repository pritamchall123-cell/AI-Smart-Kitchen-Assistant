// src/pages/CreateRecipe.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe } from "../services/recipeService";

const emptyIngredient = { name: "", quantity: "", unit: "" };
const emptyStep = { stepNumber: 1, description: "" };

function CreateRecipe() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [mealType, setMealType] = useState("dinner");
  const [difficulty, setDifficulty] = useState("easy");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const [ingredients, setIngredients] = useState([{ ...emptyIngredient }]);
  const [steps, setSteps] = useState([{ ...emptyStep }]);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // --- Ingredients handlers ---
  const updateIngredient = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };
  const addIngredient = () => setIngredients([...ingredients, { ...emptyIngredient }]);
  const removeIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));

  // --- Steps handlers ---
  const updateStep = (index, value) => {
    const updated = [...steps];
    updated[index].description = value;
    setSteps(updated);
  };
  const addStep = () =>
    setSteps([...steps, { stepNumber: steps.length + 1, description: "" }]);
  const removeStep = (index) => {
    const updated = steps.filter((_, i) => i !== index);
    // Renumber steps after removal
    updated.forEach((s, i) => (s.stepNumber = i + 1));
    setSteps(updated);
  };

  // --- Image handling ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // max 5 images
    setImageFiles(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (ingredients.some((i) => !i.name || !i.quantity)) {
      setError("Please fill in all ingredient names and quantities.");
      return;
    }
    if (steps.some((s) => !s.description)) {
      setError("Please fill in all instruction steps.");
      return;
    }

    setSubmitting(true);

    try {
      const recipe = await createRecipe(
        {
          title,
          description,
          ingredients,
          instructions: steps,
          cuisine,
          mealType,
          difficulty,
          prepTime: Number(prepTime),
          cookTime: Number(cookTime),
          servings: Number(servings),
          nutrition: {
            calories: Number(calories) || 0,
            protein: Number(protein) || 0,
            carbs: Number(carbs) || 0,
            fat: Number(fat) || 0,
          },
        },
        imageFiles
      );

      navigate(`/recipes/${recipe._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create recipe.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create a Recipe</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="Cuisine (e.g. Italian)"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
              <option value="dessert">Dessert</option>
              <option value="drink">Drink</option>
            </select>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              required
              min="0"
              placeholder="Prep time (min)"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              required
              min="0"
              placeholder="Cook time (min)"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              required
              min="1"
              placeholder="Servings"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="font-semibold text-gray-800 mb-3">Photos (up to 5)</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600 mb-3
              file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
              file:bg-green-50 file:text-green-700 file:font-medium
              hover:file:bg-green-100 cursor-pointer"
          />
          {previews.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {previews.map((url, idx) => (
                <img key={idx} src={url} alt="" className="w-20 h-20 object-cover rounded-md" />
              ))}
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="font-semibold text-gray-800 mb-3">Ingredients</h2>
          {ingredients.map((ing, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={ing.name}
                onChange={(e) => updateIngredient(index, "name", e.target.value)}
                placeholder="Name"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={ing.quantity}
                onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                placeholder="Qty"
                className="w-20 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={ing.unit}
                onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                placeholder="Unit"
                className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="text-green-600 text-sm font-medium hover:underline mt-1"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="font-semibold text-gray-800 mb-3">Instructions</h2>
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2 mb-2 items-start">
              <span className="text-sm text-gray-500 mt-2 w-6">{step.stepNumber}.</span>
              <textarea
                value={step.description}
                onChange={(e) => updateStep(index, e.target.value)}
                rows={2}
                placeholder={`Step ${step.stepNumber}`}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-500 hover:text-red-700 px-2 mt-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="text-green-600 text-sm font-medium hover:underline mt-1"
          >
            + Add Step
          </button>
        </div>

        {/* Nutrition */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="font-semibold text-gray-800 mb-3">Nutrition (per serving, optional)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="Calories"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="Protein (g)"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="Carbs (g)"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              placeholder="Fat (g)"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition disabled:bg-green-300"
        >
          {submitting ? "Publishing..." : "Publish Recipe"}
        </button>
      </form>
    </div>
  );
}

export default CreateRecipe;