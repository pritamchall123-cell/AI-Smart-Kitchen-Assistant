// services/aiService.js
// A reusable service for calling Google's Gemini AI model.

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// We use "gemini-1.5-flash" — it's fast, has a generous free tier,
// and is well-suited for our use cases (recipe generation, chat, structured JSON output).
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// A general-purpose function: takes a prompt (instructions for the AI), returns its text response.
const generateContent = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw new Error("Failed to generate AI content");
  }
};


// Handles multi-turn conversations, where the AI needs to remember previous messages.
// `history` is an array of past messages: [{ role: "user"|"model", parts: [{ text: "..." }] }]
const chatWithHistory = async (history, newMessage) => {
  try {
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 500, // keeps responses reasonably concise for a chat context
      },
    });

    const result = await chat.sendMessage(newMessage);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("AI Chat Error:", error.message);
    throw new Error("Failed to get AI chat response");
  }
};

// Analyzes an image using Gemini's multimodal capability.
// imageBuffer: the raw image bytes (from Multer's memory storage)
// mimeType: e.g. "image/jpeg" or "image/png"
const analyzeImage = async (imageBuffer, mimeType, prompt) => {
  try {
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("AI Image Analysis Error:", error.message);
    throw new Error("Failed to analyze image");
  }
};

module.exports = { generateContent, chatWithHistory , analyzeImage};