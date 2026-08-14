// controllers/aiController.js
// Handles AI-powered features: recipe generation, chat assistant, etc.

const { generateContent , chatWithHistory, analyzeImage} = require("../services/aiService");
const Recipe = require("../models/Recipe");

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// @desc    Generate a recipe using AI based on user preferences
// @route   POST /api/ai/generate-recipe
// @access  Private
const generateRecipe = async (req, res) => {
  try {
    const { prompt, dietType, cuisine, maxCookTime } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Please describe what kind of recipe you want" });
    }

    // We build a detailed instruction for the AI, telling it EXACTLY what JSON shape to return.
    // This is called "prompt engineering" — being very explicit avoids the AI returning
    // conversational text, markdown formatting, or a structure that doesn't match our database.
    const aiPrompt = `
You are a professional recipe creator. Generate a complete recipe based on this request: "${prompt}"

${dietType ? `The recipe must be suitable for: ${dietType}` : ""}
${cuisine ? `Cuisine style: ${cuisine}` : ""}
${maxCookTime ? `Total cooking time must be under ${maxCookTime} minutes` : ""}

Respond with ONLY valid JSON, no markdown formatting, no code blocks, no explanation text before or after.
Use EXACTLY this structure:

{
  "title": "string",
  "description": "string, max 200 characters",
  "ingredients": [
    { "name": "string", "quantity": "string", "unit": "string" }
  ],
  "instructions": [
    { "stepNumber": 1, "description": "string" }
  ],
  "cuisine": "string",
  "mealType": "one of: breakfast, lunch, dinner, snack, dessert, drink",
  "dietType": ["array of applicable: vegetarian, vegan, non-vegetarian, gluten-free, dairy-free, keto, low-carb"],
  "difficulty": "one of: easy, medium, hard",
  "prepTime": number (minutes),
  "cookTime": number (minutes),
  "servings": number,
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "tags": ["array of relevant short tags"]
}
    `.trim();

    const rawResponse = await generateContent(aiPrompt);

    // AI responses sometimes wrap JSON in markdown code blocks (```json ... ```)
    // even when explicitly told not to — this strips that out defensively, just in case.
    const cleanedResponse = rawResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let recipeData;
    try {
      recipeData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", cleanedResponse);
      return res.status(500).json({
        message: "AI generated an invalid response. Please try again.",
      });
    }

    // Generate a unique slug, same pattern as manual recipe creation
    let slug = generateSlug(recipeData.title);
    let slugExists = await Recipe.findOne({ slug });
    let counter = 1;
    while (slugExists) {
      slug = `${generateSlug(recipeData.title)}-${counter}`;
      slugExists = await Recipe.findOne({ slug });
      counter++;
    }

    const recipe = await Recipe.create({
      ...recipeData,
      slug,
      createdBy: req.user._id,
      source: "ai", // marks this recipe as AI-generated, distinct from user-written
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error("Generate Recipe Error:", error.message);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        message: `AI generated data that didn't match our requirements: ${messages.join(", ")}`,
      });
    }

    res.status(500).json({ message: "Server error while generating recipe" });
  }
};


// @desc    Chat with the AI cooking assistant
// @route   POST /api/ai/chat
// @access  Private
const chatWithAssistant = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Please provide a message" });
    }

    // A "system instruction" style first message, priming the AI's persona and boundaries.
    // We only need to include this ONCE — if history is empty, this is a fresh conversation.
    const systemContext = {
      role: "user",
      parts: [{
        text: "You are a friendly, knowledgeable cooking assistant for a recipe app called AI Smart Kitchen Assistant. Answer cooking-related questions: ingredient substitutions, cooking techniques, food safety, timing, and recipe troubleshooting. Keep answers concise and practical. If asked something completely unrelated to cooking/food, politely redirect the conversation back to cooking topics.",
      }],
    };
    const systemAck = {
      role: "model",
      parts: [{ text: "Understood! I'm ready to help with cooking questions." }],
    };

    // If no history was provided, this is a new conversation — prepend our system context.
    // If history already exists, the system context should already be part of it from the first message.
    const fullHistory = (history && history.length > 0) ? history : [systemContext, systemAck];

    const reply = await chatWithHistory(fullHistory, message);

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat With Assistant Error:", error.message);
    res.status(500).json({ message: "Server error while getting AI response" });
  }
};

// @desc    Detect ingredients from an uploaded fridge/pantry photo
// @route   POST /api/ai/detect-ingredients
// @access  Private
const detectIngredients = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const prompt = `
Look at this image of food/fridge/pantry contents and identify all visible food ingredients.

Respond with ONLY valid JSON, no markdown formatting, no explanation text.
Use EXACTLY this structure:

{
  "ingredients": [
    { "name": "string", "confidence": "high|medium|low" }
  ]
}

If you cannot clearly identify any food items, return an empty ingredients array.
    `.trim();

    const rawResponse = await analyzeImage(req.file.buffer, req.file.mimetype, prompt);

    const cleanedResponse = rawResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let result;
    try {
      result = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse AI vision response:", cleanedResponse);
      return res.status(500).json({ message: "AI generated an invalid response. Please try again." });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Detect Ingredients Error:", error.message);
    res.status(500).json({ message: "Server error while analyzing image" });
  }
};

module.exports = { generateRecipe, chatWithAssistant, detectIngredients };